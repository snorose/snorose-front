import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

const isInList = (state) => {
  const { $from } = state.selection;
  for (let depth = $from.depth; depth > 0; depth--) {
    const name = $from.node(depth).type.name;
    if (name === 'bulletList' || name === 'orderedList') {
      return true;
    }
  }
  return false;
};

export const ListTabHandler = Extension.create({
  name: 'listTabHandler',

  priority: 1000,

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      new Plugin({
        key: new PluginKey('listTabHandler'),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key !== 'Tab') {
              return false;
            }
            if (!isInList(view.state)) {
              return false;
            }

            if (event.shiftKey) {
              editor.commands.liftListItem('listItem');
            } else {
              editor.commands.sinkListItem('listItem');
            }

            event.preventDefault();
            return true;
          },
        },
      }),
    ];
  },
});
