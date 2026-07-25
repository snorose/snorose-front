export function convertListTypesInSelection(tr, schema, targetTypeName) {
  const targetType = schema.nodes[targetTypeName];
  const bulletType = schema.nodes.bulletList;
  const orderedType = schema.nodes.orderedList;
  const isListType = (type) => type === bulletType || type === orderedType;

  const { from, to } = tr.selection;

  const lists = [];
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (isListType(node.type)) {
      lists.push({ pos });
    }
  });

  lists.sort((a, b) => b.pos - a.pos);

  let changed = false;

  for (const { pos } of lists) {
    const listNode = tr.doc.nodeAt(pos);
    if (!listNode || !isListType(listNode.type)) {
      continue;
    }

    const children = [];
    listNode.forEach((child, offset, index) => {
      const start = pos + 1 + offset;
      const contentStart = start + 1;
      const contentEnd =
        contentStart +
        (child.firstChild ? child.firstChild.nodeSize : child.nodeSize - 2);
      children.push({
        index,
        start,
        end: start + child.nodeSize,
        contentStart,
        contentEnd,
      });
    });
    const selected = children.filter(
      (c) => c.contentEnd > from && c.contentStart < to
    );
    if (selected.length === 0) {
      continue;
    }

    const firstIdx = selected[0].index;
    const lastIdx = selected[selected.length - 1].index;
    const total = children.length;

    if (firstIdx === 0 && lastIdx === total - 1) {
      tr.setNodeMarkup(pos, targetType);
      changed = true;
      continue;
    }

    const afterLast = children[lastIdx].end;
    const beforeFirst = children[firstIdx].start;

    if (lastIdx < total - 1) {
      tr.split(afterLast, 1);
    }
    if (firstIdx > 0) {
      tr.split(beforeFirst, 1);
    }

    const anchor = tr.mapping.map(beforeFirst + 1);
    const $anchor = tr.doc.resolve(anchor);
    for (let depth = $anchor.depth; depth >= 0; depth--) {
      if (isListType($anchor.node(depth).type)) {
        tr.setNodeMarkup($anchor.before(depth), targetType);
        changed = true;
        break;
      }
    }
  }

  return changed;
}
