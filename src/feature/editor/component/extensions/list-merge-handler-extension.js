import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { canJoin } from 'prosemirror-transform';

const isListType = (type) =>
  type.name === 'bulletList' || type.name === 'orderedList';

const collectJoinPositions = (doc) => {
  const positions = [];

  const walk = (node, contentStart) => {
    node.forEach((child, offset, index) => {
      const childStart = contentStart + offset;

      if (
        index > 0 &&
        isListType(child.type) &&
        node.child(index - 1).type === child.type
      ) {
        positions.push(childStart);
      }

      if (child.isBlock && !child.isLeaf) {
        walk(child, childStart + 1);
      }
    });
  };

  walk(doc, 0);

  return positions;
};

export const ListMergeHandler = Extension.create({
  name: 'listMergeHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('listMergeHandler'),

        appendTransaction: (transactions, oldState, newState) => {
          if (!transactions.some((transaction) => transaction.docChanged)) {
            return null;
          }

          const positions = collectJoinPositions(newState.doc);
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
