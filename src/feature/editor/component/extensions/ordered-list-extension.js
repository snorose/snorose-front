import { wrappingInputRule } from '@tiptap/core';
import { OrderedList, orderedListInputRegex } from '@tiptap/extension-list';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { convertListTypesInSelection } from '@/feature/editor/lib/listConversion';
import {
  getChangedTopLevelRange,
  getNearestListType,
  getOrderedListDisplay,
  isInlineOnlyTransaction,
  walkListFormats,
} from '@/feature/editor/lib/listNode';

// 번호는 ::before 카운터로 직접 그리므로(EditorContainer.module.css) 화면에 필요한 값을 데코레이션으로 붙인다. 저장되는 HTML(getHTML)에는 start / type만 남는다.
// (글 보기 화면은 sanitize.js의 sanitizePostHtml이 같은 값을 붙인다.)
// range를 주면 그 범위의 최상위 블록 안 번호 목록만 만든다.
function collectDecorations(doc, range = null) {
  const decorations = [];

  walkListFormats(
    doc,
    (node, pos, { format }) => {
      if (node.type.name !== 'orderedList') return;

      const { attrs, startOffset } = getOrderedListDisplay(
        node.attrs.start,
        format
      );

      decorations.push(
        Decoration.node(pos, pos + node.nodeSize, {
          ...attrs,
          ...(startOffset !== null && { style: `--ol-start: ${startOffset}` }),
        })
      );
    },
    range
  );

  return decorations;
}

function updateDecorations(old, tr) {
  const mapped = old.map(tr.mapping, tr.doc);
  // 글자 입력은 목록 구조·속성을 바꿀 수 없으므로 위치만 옮긴다.
  if (isInlineOnlyTransaction(tr)) return mapped;

  // 바뀐 최상위 블록 안의 표시값만 다시 계산한다. (긴 글에서 Enter마다 전체를 다시 만들지 않도록)
  const range = getChangedTopLevelRange(tr.doc, [tr]);
  if (!range) return DecorationSet.create(tr.doc, collectDecorations(tr.doc));

  // 범위 양끝에 닿기만 하는 옆 블록의 데코레이션은 남겨 둔다.
  const stale = mapped.find(range.from + 1, range.to - 1);
  return mapped.remove(stale).add(tr.doc, collectDecorations(tr.doc, range));
}

export const CustomOrderedList = OrderedList.extend({
  // 숫자(1. 2. …)에 더해 a. / i. 로도 번호 목록을 만든다.
  // 앞 목록과 합칠지는 번호 형식을 비교하는 ListMergeHandler가 정하므로 여기서는 합치지 않는다.
  addInputRules() {
    return [
      wrappingInputRule({
        find: orderedListInputRegex,
        type: this.type,
        getAttributes: (match) => ({ start: +match[1] }),
        joinPredicate: () => false,
      }),
      wrappingInputRule({
        find: /^([ai])\.\s$/,
        type: this.type,
        getAttributes: (match) => ({ type: match[1] }),
        joinPredicate: () => false,
      }),
    ];
  },

  // Tiptap 기본 toggleOrderedList(툴바·Mod-Shift-7)는 옆 번호 목록과 형식에 상관없이 합치므로, 감싸기만 하고 합칠지는 ListMergeHandler에 맡긴다.
  addCommands() {
    return {
      ...this.parent?.(),
      toggleOrderedList:
        () =>
        ({ state, commands }) => {
          const listType = getNearestListType(state.selection.$from);

          if (listType === this.name) {
            return commands.liftListItem(this.options.itemTypeName);
          }
          if (listType) {
            return commands.command(({ tr }) =>
              convertListTypesInSelection(tr, state.schema, this.name)
            );
          }
          return commands.wrapInList(this.name);
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() ?? []),
      new Plugin({
        key: new PluginKey('orderedListDisplay'),
        state: {
          init: (_, { doc }) =>
            DecorationSet.create(doc, collectDecorations(doc)),
          apply: (tr, old) =>
            tr.docChanged ? updateDecorations(old, tr) : old,
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
