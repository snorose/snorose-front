import { ListItem } from '@tiptap/extension-list';

import { ListBackspaceHandler } from './list-backspace-handler-extension';
import { ListMergeHandler } from './list-merge-handler-extension';
import { ListMotion } from './list-motion-extension';
import { ListTabHandler } from './list-tab-handler-extension';
import { CustomOrderedList } from './ordered-list-extension';

// 에디터의 목록 관련 확장 묶음.
// EditorContainer와 테스트가 같은 구성을 쓰도록 한곳에 둔다.
// (StarterKit의 listItem·orderedList는 끄고 이 묶음을 함께 넣는다.)
export const LIST_EXTENSIONS = [
  ListItem.extend({ content: '(paragraph|heading) block*' }),
  CustomOrderedList,
  ListBackspaceHandler,
  ListTabHandler,
  ListMergeHandler,
  ListMotion,
];
