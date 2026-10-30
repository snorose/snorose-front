import { Extension } from '@tiptap/core';

export const ListBackspaceHandler = Extension.create({
  name: 'listBackspaceHandler',

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { editor } = this;
        const { $from, empty } = editor.state.selection;

        // 선택 영역이 있거나 텍스트 맨 앞이 아니면 기본 동작
        if (!empty || $from.parentOffset !== 0) {
          return false;
        }

        // 커서가 위치한 문단의 부모가 listItem이고,
        // 그 문단이 항목의 첫 번째 블록(항목 맨 앞)일 때만 처리
        const itemDepth = $from.depth - 1;
        if (
          itemDepth < 0 ||
          $from.node(itemDepth).type.name !== 'listItem' ||
          $from.index(itemDepth) !== 0
        ) {
          return false;
        }

        // 마커만 제거 → 목록에서 한 단계 빼내 문단으로 전환
        return editor.chain().liftListItem('listItem').run();
      },
    };
  },
});
