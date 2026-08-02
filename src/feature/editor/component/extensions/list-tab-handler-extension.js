import { Extension } from '@tiptap/core';

export const ListTabHandler = Extension.create({
  name: 'listTabHandler',

  priority: 1000,

  addKeyboardShortcuts() {
    const { editor } = this;

    return {
      Tab: () =>
        editor.commands.sinkListItem('listItem') || editor.isActive('listItem'),
      'Shift-Tab': () =>
        editor.commands.liftListItem('listItem') || editor.isActive('listItem'),
    };
  },
});
