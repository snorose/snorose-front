import { Node } from '@tiptap/core';

export const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      embedType: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-embed-type'),
        renderHTML: (attributes) =>
          attributes.embedType
            ? { 'data-embed-type': attributes.embedType }
            : {},
      },
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
        height: `500px`,
        frameborder: '0',
        allowfullscreen: 'true',
        scrolling: 'no',
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      },
    ];
  },
});
