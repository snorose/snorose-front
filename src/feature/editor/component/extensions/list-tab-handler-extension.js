import { Extension } from '@tiptap/core';
import { liftListItem } from 'prosemirror-schema-list';
import { TextSelection } from 'prosemirror-state';

import {
  findListItemDepth,
  isExplicitOrderedFormat,
  isListNode,
  isolateListItem,
  resolveOrderedFormatAt,
} from '@/feature/editor/lib/listNode';

export const sinkFirstListItem = (state, dispatch) => {
  const { $from } = state.selection;

  const itemDepth = findListItemDepth($from);
  if (itemDepth === null || itemDepth < 2) return false;

  const listDepth = itemDepth - 1;
  const list = $from.node(listDepth);
  if (!isListNode(list)) return false;

  if ($from.index(listDepth) !== 0) return false;

  const listIndex = $from.index(listDepth - 1);
  if (listIndex === 0) return false;

  const prevList = $from.node(listDepth - 1).child(listIndex - 1);
  if (!isListNode(prevList) || prevList.childCount === 0) return false;

  if (!dispatch) return true;

  const item = $from.node(itemDepth);
  const itemStart = $from.before(itemDepth);
  const itemEnd = $from.after(itemDepth);
  const listStart = $from.before(listDepth);
  const listEnd = $from.after(listDepth);

  const insertPos = listStart - 2;

  const tr = state.tr;

  if (list.childCount === 1) {
    tr.delete(listStart, listEnd);
  } else {
    tr.delete(itemStart, itemEnd);
  }

  // 하위 목록이 되므로 시작 번호(start)는 1로 둔다.
  // 직접 지정한 번호 형식(type)은 유지해 Shift-Tab으로 되돌려도 형식이 그대로 남는다.
  tr.insert(insertPos, list.type.create({ ...list.attrs, start: 1 }, item));

  const cursor = insertPos + 1 + ($from.pos - itemStart);
  tr.setSelection(TextSelection.near(tr.doc.resolve(cursor)));
  tr.scrollIntoView();

  dispatch(tr);
  return true;
};

export const liftListItemKeepingType = (state, dispatch) => {
  const { $from } = state.selection;

  const itemDepth = findListItemDepth($from);
  if (itemDepth === null || itemDepth < 3) return false;

  const list = $from.node(itemDepth - 1);
  const parentItem = $from.node(itemDepth - 2);
  const outerList = $from.node(itemDepth - 3);

  if (!isListNode(list) || !isListNode(outerList)) return false;
  if (parentItem.type.name !== 'listItem') return false;
  // 목록 종류가 같아도, 직접 지정한 번호 형식(a. / i. 등)이 바깥 목록 형식과 다르면
  // 바깥 목록에 섞지 않고 그 형식 그대로 떼어 낸다. (Tab ↔ Shift-Tab이 대칭이 되도록)
  const keepsOwnFormat =
    list.type.name === 'orderedList' &&
    isExplicitOrderedFormat(list.attrs.type) &&
    list.attrs.type !== resolveOrderedFormatAt($from, itemDepth - 3);
  if (list.type === outerList.type && !keepsOwnFormat) return false;

  let handled = false;

  liftListItem(state.schema.nodes.listItem)(state, (tr) => {
    const $lifted = tr.selection.$from;
    const liftedDepth = findListItemDepth($lifted);
    if (liftedDepth === null) return;

    const holderDepth = liftedDepth - 1;
    const holder = $lifted.node(holderDepth);
    if (!isListNode(holder)) return;

    // 올라온 항목을 바깥 목록에서 떼어 내 원래 목록 종류·형식 그대로 둔다.
    // 바깥 목록의 뒤쪽 조각은 원래 이어지던 번호부터 시작한다.
    const isolatedPos = isolateListItem(tr, $lifted.before(liftedDepth), {
      continueNumbering: true,
    });
    tr.setNodeMarkup(isolatedPos, list.type, list.attrs);

    tr.scrollIntoView();

    handled = true;
    if (dispatch) dispatch(tr);
  });

  return handled;
};

export const ListTabHandler = Extension.create({
  name: 'listTabHandler',

  priority: 1000,

  addKeyboardShortcuts() {
    const { editor } = this;

    return {
      Tab: () =>
        editor.commands.sinkListItem('listItem') ||
        sinkFirstListItem(editor.state, editor.view.dispatch) ||
        editor.isActive('listItem'),
      'Shift-Tab': () =>
        liftListItemKeepingType(editor.state, editor.view.dispatch) ||
        editor.commands.liftListItem('listItem') ||
        editor.isActive('listItem'),
    };
  },
});
