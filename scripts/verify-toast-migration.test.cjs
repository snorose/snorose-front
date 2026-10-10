// Run independently of the app build: node --test scripts/verify-toast-migration.test.cjs
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const test = require('node:test');
const { inspect, verify } = require('./verify-toast-migration.cjs');

const fixture = (call, condition = 'ready') => `
  import { useToast as useNotice } from '@/shared/hook';
  function Example() {
    const { toast: notify } = useNotice();
    if (${condition}) { ${call}; }
  }
`;

test('recognizes both imported-hook and toast aliases, including legacy calls', () => {
  const old = inspect(
    fixture("notify({ message: getMessage(), variant: 'success' })"),
    'src/example.jsx',
    { allowLegacy: true }
  );
  const next = inspect(
    fixture('notify.success(getMessage())'),
    'src/example.jsx'
  );
  assert.equal(next.calls.length, 1);
  assert.deepEqual(next.ast, old.ast);
  assert.throws(
    () =>
      inspect(fixture('notify({ message: getMessage() })'), 'src/example.jsx'),
    /legacy/
  );
});

test('missing legacy variant means info, not success or error', () => {
  const old = inspect(fixture('notify({ message })'), 'src/example.jsx', {
    allowLegacy: true,
  });
  assert.deepEqual(
    old.ast,
    inspect(fixture('notify.info(message)'), 'src/example.jsx').ast
  );
  assert.notDeepEqual(
    old.ast,
    inspect(fixture('notify.success(message)'), 'src/example.jsx').ast
  );
});

test('rejects indirect use instead of silently skipping it', () => {
  for (const usage of [
    'sendElsewhere(notify)',
    'sendElsewhere(notify.error)',
    "notify['success'](message)",
    'notify?.(message)',
    'const { success } = notify',
    'const other = notify',
  ]) {
    assert.throws(
      () => inspect(fixture(usage), 'src/example.jsx'),
      /requires review/
    );
  }
});

test('rejects unsupported hook imports, results and re-exports', () => {
  for (const source of [
    "import * as hooks from '@/shared/hook'; hooks.useToast();",
    "import hooks from '@/shared/hook'; hooks.useToast();",
    "const hooks = require('@/shared/hook');",
    "import('@/shared/hook');",
    "export * from '@/shared/hook';",
    "export { useToast as useNotice } from '@/shared/hook';",
    "import { useToast } from '@/shared/hook'; consume(useToast);",
    "import { useToast } from '@/shared/hook'; const result = useToast();",
  ])
    assert.throws(() => inspect(source, 'src/example.jsx'));
});

test('rejects invalid methods, missing/extra arguments and unexpected old options', () => {
  for (const call of [
    'notify.warning(message)',
    'notify.error()',
    'notify.error(message, options)',
  ]) {
    assert.throws(() => inspect(fixture(call), 'src/example.jsx'));
  }
  assert.throws(() =>
    inspect(
      fixture('notify({ message, action: callback })'),
      'src/example.jsx',
      { allowLegacy: true }
    )
  );
});

test('compares control flow, message evaluation and call count, ignoring formatting only', () => {
  const old = inspect(
    fixture("notify({ message: getMessage(), variant: 'error' })"),
    'src/example.jsx',
    { allowLegacy: true }
  );
  for (const changed of [
    fixture('notify.error(getMessage())', '!ready'),
    fixture('notify.error(otherMessage())'),
    fixture('notify.error(getMessage()); notify.error(getMessage())'),
    fixture(''),
  ])
    assert.notDeepEqual(inspect(changed, 'src/example.jsx').ast, old.ast);
  assert.deepEqual(
    inspect(
      fixture('notify.error( /* unchanged */ getMessage() )'),
      'src/example.jsx'
    ).ast,
    old.ast
  );
});

test('all production modules pass against a fixed baseline, with only three declared exceptions', () => {
  const result = verify();
  assert.equal(result.count, 145);
  assert.equal(result.fileCount, 41);
  assert.deepEqual(result.exceptions.map(({ file }) => file).sort(), [
    'src/feature/exam/component/ReviewDownload/ReviewDownload.jsx',
    'src/feature/exam/hook/useDeleteExamReviewHandler.jsx',
    'src/page/alert/AlertSettingPage/AlertSettingPage.jsx',
  ]);
});

test('detects wrong variants, wrong messages and deletions at EACH of the 145 real call sites', () => {
  const files = execFileSync('git', ['ls-files', 'src'], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(
      (file) => /\.[jt]sx?$/.test(file) && !/\.(test|stories)\./.test(file)
    );
  let checked = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    const original = inspect(source, file);
    for (const call of original.calls) {
      const message = source.slice(call.messageStart, call.messageEnd);
      const wrongVariant = call.variant === 'error' ? 'success' : 'error';
      for (const replacement of [
        `${call.receiver}.${wrongVariant}(${message})`,
        `${call.receiver}.${call.variant}('__changed_message__')`,
        'undefined',
      ]) {
        const mutant =
          source.slice(0, call.start) + replacement + source.slice(call.end);
        assert.notDeepEqual(
          inspect(mutant, file).ast,
          original.ast,
          `${file}:${call.line}: failed to detect ${replacement}`
        );
      }
      checked++;
    }
  }
  assert.equal(checked, 145);
});
