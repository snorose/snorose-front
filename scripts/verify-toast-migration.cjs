// Compare production call sites with a Git revision, ignoring formatting/comments.
// Usage: node scripts/verify-toast-migration.cjs [base-ref]
// Migration baseline: 3ee33ff5 (pass it explicitly after committing the migration).
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const posix = require('node:path').posix;
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const variants = new Set(['success', 'error', 'info']);
const metadata = new Set([
  'start',
  'end',
  'loc',
  'extra',
  'comments',
  'leadingComments',
  'trailingComments',
  'innerComments',
]);

function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !metadata.has(key))
      .map(([key, item]) => [key, clean(item)])
  );
}

function inspect(source, file, { allowLegacy = false } = {}) {
  const ast = parser.parse(source, {
    sourceType: 'module',
    // Some existing .jsx files contain TS annotations. This is a migration audit,
    // not a replacement for the project's type/syntax checker.
    plugins: ['jsx', 'typescript'],
  });
  const calls = [];
  const exceptions = [];
  const toastBindings = new Set();
  const hookBindings = new Set();
  const hookModule = (value) => {
    const resolved = (
      value.startsWith('@/')
        ? `src/${value.slice(2)}`
        : value.startsWith('.')
          ? posix.join(posix.dirname(file), value)
          : value
    )
      .replace(/\.[jt]sx?$/, '')
      .replace(/\/index$/, '');
    return ['src/shared/hook', 'src/shared/hook/useToast'].includes(resolved);
  };
  traverse(ast, {
    ImportDeclaration(path) {
      for (const specifier of path.node.specifiers) {
        const namedHook =
          t.isImportSpecifier(specifier) &&
          specifier.imported.name === 'useToast';
        const directHook =
          t.isImportDefaultSpecifier(specifier) &&
          /\/useToast(?:\.[jt]sx?)?$/.test(path.node.source.value);
        if (
          hookModule(path.node.source.value) &&
          t.isImportNamespaceSpecifier(specifier)
        ) {
          throw new Error(
            `${file}: namespace hook import requires explicit review`
          );
        }
        if (
          hookModule(path.node.source.value) &&
          t.isImportDefaultSpecifier(specifier)
        ) {
          assert(
            directHook,
            `${file}: default barrel import requires explicit review`
          );
        }
        if (!namedHook && !directHook) continue;
        assert(
          hookModule(path.node.source.value),
          `${file}: unrecognized useToast import route`
        );
        hookBindings.add(path.scope.getBinding(specifier.local.name));
      }
    },
    ExportNamedDeclaration(path) {
      if (!path.node.source || !hookModule(path.node.source.value)) return;
      assert(
        file === 'src/shared/hook/index.js' &&
          path.node.specifiers.every(
            (item) =>
              item.local.name === 'default' && item.exported.name === 'useToast'
          ),
        `${file}: hook re-export requires explicit review`
      );
    },
    ExportAllDeclaration(path) {
      assert(
        !hookModule(path.node.source.value),
        `${file}: wildcard hook re-export requires explicit review`
      );
    },
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (
        (t.isIdentifier(callee, { name: 'require' }) ||
          callee.type === 'Import') &&
        t.isStringLiteral(args[0]) &&
        hookModule(args[0].value)
      ) {
        throw new Error(
          `${file}: dynamic/CommonJS hook import requires explicit review`
        );
      }
    },
  });
  // Follow every reference to the imported hook, including local aliases.
  // Unsupported escapes fail the audit instead of silently reducing coverage.
  for (const binding of hookBindings) {
    assert(binding.constant, `${file}: reassigned hook requires review`);
    for (const reference of binding.referencePaths) {
      const call = reference.parentPath;
      assert(
        call.isCallExpression() && call.node.callee === reference.node,
        `${file}: hook passed around instead of called directly`
      );
      const declaration = call.parentPath;
      assert(
        declaration.isVariableDeclarator() &&
          declaration.node.init === call.node &&
          t.isObjectPattern(declaration.node.id),
        `${file}: hook result must be explicitly destructured`
      );
      for (const property of declaration.node.id.properties) {
        assert(
          t.isObjectProperty(property) &&
            !property.computed &&
            t.isIdentifier(property.value),
          `${file}: unsupported hook result destructuring`
        );
        const name = property.key.name || property.key.value;
        assert(
          ['toast', 'removeToast'].includes(name),
          `${file}: unexpected hook result ${name}`
        );
        if (name === 'toast')
          toastBindings.add(declaration.scope.getBinding(property.value.name));
      }
    }
  }
  for (const binding of toastBindings) {
    assert(binding.constant, `${file}: reassigned toast requires review`);
    for (const reference of binding.referencePaths) {
      const parent = reference.parentPath;
      const direct =
        parent.isCallExpression() && parent.node.callee === reference.node;
      const method =
        parent.isMemberExpression() &&
        parent.node.object === reference.node &&
        !parent.node.computed &&
        parent.parentPath.isCallExpression() &&
        parent.parentPath.node.callee === parent.node;
      assert(
        direct || method,
        `${file}:${reference.node.loc.start.line}: toast escape or unsupported call requires review`
      );
    }
  }
  traverse(ast, {
    CallExpression(path) {
      const { node } = path;
      const legacy =
        t.isIdentifier(node.callee) &&
        toastBindings.has(path.scope.getBinding(node.callee.name));
      const modern =
        t.isMemberExpression(node.callee) &&
        t.isIdentifier(node.callee.object) &&
        toastBindings.has(path.scope.getBinding(node.callee.object.name));
      if (!legacy && !modern) return;
      assert.equal(node.arguments.length, 1, `${file}: expected one argument`);
      let message;
      let variant;
      if (legacy) {
        assert(
          allowLegacy,
          `${file}:${node.loc.start.line}: legacy toast() remains`
        );
        const payload = node.arguments[0];
        if (t.isObjectExpression(payload)) {
          const props = new Map();
          for (const prop of payload.properties) {
            assert(
              t.isObjectProperty(prop) && !prop.computed,
              `${file}: unsupported payload`
            );
            const key = prop.key.name || prop.key.value;
            assert(
              ['message', 'variant'].includes(key) && !props.has(key),
              `${file}: unexpected property ${key}`
            );
            props.set(key, prop.value);
          }
          message = props.get('message');
          assert(message, `${file}: missing message`);
          const value = props.get('variant');
          assert(
            !value || t.isStringLiteral(value),
            `${file}: dynamic variant requires review`
          );
          variant = value ? value.value : 'info';
          // Preserve two already-migrated error handlers from the user's working tree.
          if (
            !value &&
            ((file ===
              'src/feature/exam/component/ReviewDownload/ReviewDownload.jsx' &&
              t.isIdentifier(message, { name: 'message' })) ||
              (file ===
                'src/feature/exam/hook/useDeleteExamReviewHandler.jsx' &&
                t.isMemberExpression(message) &&
                t.isMemberExpression(message.object) &&
                t.isIdentifier(message.object.object, { name: 'response' }) &&
                t.isIdentifier(message.object.property, { name: 'data' }) &&
                t.isIdentifier(message.property, { name: 'message' })))
          ) {
            variant = 'error';
            exceptions.push({
              file,
              line: node.loc.start.line,
              reason: 'Existing user change: default/info -> error',
            });
          }
        } else {
          // Explicitly reviewed exception: the old API incorrectly received a string.
          assert.equal(
            file,
            'src/page/alert/AlertSettingPage/AlertSettingPage.jsx'
          );
          assert(
            t.isMemberExpression(payload) &&
              t.isIdentifier(payload.object, { name: 'error' }) &&
              t.isIdentifier(payload.property, { name: 'message' })
          );
          message = payload;
          variant = 'error';
          exceptions.push({
            file,
            line: node.loc.start.line,
            reason: 'Malformed string payload -> error message',
          });
        }
      } else {
        assert(
          !node.callee.computed,
          `${file}: computed toast method requires review`
        );
        variant = node.callee.property.name;
        message = node.arguments[0];
        assert(
          !t.isSpreadElement(message),
          `${file}: spread argument requires review`
        );
      }
      assert(variants.has(variant), `${file}: invalid variant ${variant}`);
      calls.push({
        variant,
        message: clean(message),
        line: node.loc.start.line,
        legacy,
        start: node.start,
        end: node.end,
        messageStart: message.start,
        messageEnd: message.end,
        receiver: legacy ? node.callee.name : node.callee.object.name,
      });
      // Normalize both interfaces; compare the entire surrounding AST, not just text/counts.
      path.replaceWith(
        t.callExpression(t.identifier('__verifiedToast'), [
          t.stringLiteral(variant),
          t.cloneNode(message, true),
        ])
      );
      path.skip();
    },
  });
  return {
    ast: clean(ast.program),
    calls,
    exceptions,
    hookCount: hookBindings.size,
  };
}

function verify(base = '3ee33ff5') {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
  const baseFiles = new Set(
    git('ls-tree', '-r', '--name-only', base, '--', 'src').trim().split('\n')
  );
  const files = [
    ...new Set([
      ...git('ls-files', '--cached', '--others', '--exclude-standard', 'src')
        .trim()
        .split('\n'),
      ...baseFiles,
    ]),
  ].filter(
    (file) => /\.[jt]sx?$/.test(file) && !/\.(test|stories)\./.test(file)
  );
  let count = 0;
  let fileCount = 0;
  const exceptions = [];
  for (const file of files) {
    const source = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const after = inspect(source, file);
    const before = inspect(
      baseFiles.has(file) ? git('show', `${base}:${file}`) : '',
      file,
      {
        allowLegacy: true,
      }
    );
    exceptions.push(...before.exceptions);
    assert.deepEqual(
      after.ast,
      before.ast,
      `${file}: message, variant, call count or surrounding logic changed`
    );
    if (!before.calls.length && !after.calls.length) continue;
    count += after.calls.length;
    fileCount++;
  }
  console.log(
    `PASS: scanned ${files.length} production source files; verified ${count} calls in ${fileCount} files against ${base}.`
  );
  console.log(
    `${count - exceptions.length} calls preserve message/variant/conditions; ${exceptions.length} explicit behavior exceptions below; no unsupported hook/toast references.`
  );
  for (const exception of exceptions)
    console.log(`${exception.file}:${exception.line}: ${exception.reason}`);
  return { count, fileCount, scannedFiles: files.length, exceptions };
}

module.exports = { inspect, verify };
if (require.main === module) verify(process.argv[2]);
