import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { HASHTAG_REGEX } from '@/shared/lib';

function buildDecorations(doc) {
  const decorations = [];

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text || !node.text.includes('#')) return;

    for (const match of node.text.matchAll(HASHTAG_REGEX)) {
      const start = pos + match.index;
      const end = start + match[0].length;
      decorations.push(
        Decoration.inline(start, end, { class: 'editor-hashtag' })
      );
    }
  });

  return DecorationSet.create(doc, decorations);
}

export const HashtagHighlight = Extension.create({
  name: 'hashtagHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('hashtagHighlight'),
        state: {
          init: (_, { doc }) => buildDecorations(doc),
          apply: (tr, old) => (tr.docChanged ? buildDecorations(tr.doc) : old),
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
