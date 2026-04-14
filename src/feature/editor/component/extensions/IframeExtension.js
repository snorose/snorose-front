import { Node } from '@tiptap/core';

export const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'iframe' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      {
        ...HTMLAttributes,
        width: '100%',
        height: '336px',
        frameborder: '0',
        allowfullscreen: 'true',
      },
    ];
  },
});