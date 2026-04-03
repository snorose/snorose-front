import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

export const EnterKeyHandler = Extension.create({
  name: 'enterKeyHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('enterKeyHandler'),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === 'Enter') {
              const { state, dispatch } = view;
              const { $from } = state.selection;
              if ($from.parent.textContent.length === 0) {
                const tr = state.tr
                  .insertText('\u00A0', $from.pos)
                  .split($from.pos + 1);
                dispatch(tr);
                return true; 
              }
            }
            return false; 
          },
        },
      }),
    ];
  },
});