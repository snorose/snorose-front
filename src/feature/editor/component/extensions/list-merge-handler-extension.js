import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { canJoin } from 'prosemirror-transform';

import {
  getChangedTopLevelRange,
  isInlineOnlyTransaction,
  isListNode,
  resolveOrderedFormat,
  walkListFormats,
} from '@/feature/editor/lib/listNode';

// 같은 종류의 목록이 붙어 있으면 하나로 합친다.
// 번호 목록은 화면에 보이는 형식(1 / a / i …)이 같을 때만 합친다.
// range를 주면 그 범위의 최상위 블록만 본다.
const collectJoinPositions = (doc, range = null) => {
  const positions = [];

  walkListFormats(
    doc,
    (node, pos, { parent, index, parentFormat, format }) => {
      if (index === 0 || !isListNode(node)) return;

      const prev = parent.child(index - 1);
      if (prev.type !== node.type) return;
      if (
        node.type.name === 'orderedList' &&
        resolveOrderedFormat(prev.attrs.type, parentFormat) !== format
      ) {
        return;
      }

      positions.push(pos);
    },
    range
  );

  return positions;
};

export const ListMergeHandler = Extension.create({
  name: 'listMergeHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('listMergeHandler'),

        appendTransaction: (transactions, oldState, newState) => {
          // 글자 입력처럼 한 문단 안에서만 바뀌면 목록이 새로 붙을 수 없다.
          if (
            transactions.every(
              (transaction) =>
                !transaction.docChanged || isInlineOnlyTransaction(transaction)
            )
          ) {
            return null;
          }

          // 바뀐 최상위 블록과 그 앞뒤 블록만 본다. (바뀐 블록이 옆 목록과 붙었을 수 있으므로)
          const range = getChangedTopLevelRange(
            newState.doc,
            transactions.filter((transaction) => transaction.docChanged),
            1
          );
          const positions = collectJoinPositions(newState.doc, range);
          if (positions.length === 0) {
            return null;
          }

          const tr = newState.tr;
          let changed = false;

          for (const pos of positions.sort((a, b) => b - a)) {
            if (canJoin(tr.doc, pos)) {
              tr.join(pos);
              changed = true;
            }
          }

          return changed ? tr : null;
        },
      }),
    ];
  },
});
