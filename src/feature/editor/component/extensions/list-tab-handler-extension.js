import { Extension } from '@tiptap/core';
import { liftListItem } from 'prosemirror-schema-list';
import { TextSelection } from 'prosemirror-state';

const isListNode = (node) =>
  node?.type.name === 'bulletList' || node?.type.name === 'orderedList';

const findListItemDepth = ($pos) => {
  for (let depth = $pos.depth; depth > 0; depth -= 1) {
    if ($pos.node(depth).type.name === 'listItem') return depth;
  }
  return null;
};

const findListDepth = ($pos) => {
  for (let depth = $pos.depth; depth > 0; depth -= 1) {
    if (isListNode($pos.node(depth))) return depth;
  }
  return null;
};

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

  tr.insert(insertPos, list.type.create(list.attrs, item));

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
  if (list.type === outerList.type) return false;

  let handled = false;

  liftListItem(state.schema.nodes.listItem)(state, (tr) => {
    const $lifted = tr.selection.$from;
    const liftedDepth = findListItemDepth($lifted);
    if (liftedDepth === null) return;

    const holderDepth = liftedDepth - 1;
    const holder = $lifted.node(holderDepth);
    if (!isListNode(holder)) return;

    const itemStart = $lifted.before(liftedDepth);
    const itemEnd = $lifted.after(liftedDepth);
    const index = $lifted.index(holderDepth);

    const liftSteps = tr.steps.length;

    if (index < holder.childCount - 1) tr.split(itemEnd, 1);
    if (index > 0) tr.split(itemStart, 1);

    const mapping = tr.mapping.slice(liftSteps);
    const $isolated = tr.doc.resolve(mapping.map(itemStart + 2));
    const isolatedDepth = findListDepth($isolated);
    if (isolatedDepth === null) return;

    tr.setNodeMarkup($isolated.before(isolatedDepth), list.type, list.attrs);
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
