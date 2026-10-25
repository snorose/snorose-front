import {
  AddMarkStep,
  Mapping,
  RemoveMarkStep,
  ReplaceAroundStep,
  ReplaceStep,
} from 'prosemirror-transform';

// 에디터 목록(bulletList / orderedList) 노드 공용 헬퍼

export const LIST_TYPE_NAMES = ['bulletList', 'orderedList'];

export const isListNode = (node) =>
  !!node && LIST_TYPE_NAMES.includes(node.type.name);

// $pos에서 위로 올라가며 조건에 맞는 가장 가까운 노드의 depth (없으면 null)
export const findDepth = ($pos, predicate) => {
  for (let depth = $pos.depth; depth > 0; depth -= 1) {
    if (predicate($pos.node(depth))) return depth;
  }
  return null;
};

export const findListDepth = ($pos) => findDepth($pos, isListNode);

export const findListItemDepth = ($pos) =>
  findDepth($pos, (node) => node.type.name === 'listItem');

export const getNearestListType = ($pos) => {
  const depth = findListDepth($pos);
  return depth === null ? null : $pos.node(depth).type.name;
};

// 직접 지정할 수 있는 번호 형식: a·A(알파벳) / i·I(로마 숫자).
// type="1"은 형식을 지정하지 않은 것과 같게 보고 상위 목록 기준 형식을 따른다.
// (예전 CSS가 깊이별 규칙으로 type을 덮어썼던 기존 글의 모양을 유지하기 위해)
const EXPLICIT_FORMATS = ['a', 'A', 'i', 'I'];
// 하위 목록은 1 → a → i 순서로 순환한다. (대문자도 같은 순서를 따른다.)
const FORMAT_CYCLE = ['1', 'a', 'i'];

export const getNextOrderedFormat = (format) =>
  FORMAT_CYCLE[
    (FORMAT_CYCLE.indexOf(format.toLowerCase()) + 1) % FORMAT_CYCLE.length
  ];

// 번호 목록이 실제로 그려지는 형식: 직접 지정한 형식이 있으면 그 형식,
// 없으면 가장 가까운 상위 번호 목록 형식의 다음 형식 (최상위는 1).
// 저장하지 않고 화면(에디터 데코레이션 / 글 보기)과 목록 병합 판단에서 매번 계산한다.
export const resolveOrderedFormat = (type, parentFormat) => {
  if (EXPLICIT_FORMATS.includes(type)) return type;
  return parentFormat ? getNextOrderedFormat(parentFormat) : '1';
};

export const isExplicitOrderedFormat = (type) =>
  EXPLICIT_FORMATS.includes(type);

// $pos의 targetDepth에 있는 번호 목록이 실제로 그려지는 형식
export const resolveOrderedFormatAt = ($pos, targetDepth) => {
  let format = null;
  for (let depth = 1; depth <= targetDepth; depth += 1) {
    const node = $pos.node(depth);
    if (node.type.name === 'orderedList') {
      format = resolveOrderedFormat(node.attrs.type, format);
    }
  }
  return format;
};

// 문서의 블록 노드를 돌며 callback(node, pos, { parent, index, parentFormat, format })을 부른다.
// format은 번호 목록이면 그 목록의 형식, 아니면 상위에서 내려온 형식이다.
// range({ from, to })를 주면 그 범위에 걸친 최상위 블록만 돈다. (최상위 블록의 상위 형식은 항상 없음)
// (텍스트 블록 안쪽은 목록이 들어갈 수 없으므로 내려가지 않는다.)
export const walkListFormats = (doc, callback, range = null) => {
  const walk = (node, contentStart, parentFormat) => {
    node.forEach((child, offset, index) => {
      const pos = contentStart + offset;
      if (
        node === doc &&
        range &&
        (pos + child.nodeSize <= range.from || pos >= range.to)
      ) {
        return;
      }

      const format =
        child.type.name === 'orderedList'
          ? resolveOrderedFormat(child.attrs.type, parentFormat)
          : parentFormat;

      callback(child, pos, { parent: node, index, parentFormat, format });

      if (child.isBlock && !child.isLeaf && !child.isTextblock) {
        walk(child, pos + 1, format);
      }
    });
  };

  walk(doc, 0, null);
};

// 트랜잭션들이 바꾼 범위를 마지막 문서(doc)의 최상위 블록 경계로 넓혀 { from, to }로 돌려준다.
// extraBlocks만큼 앞뒤 최상위 블록을 더 넣는다. (옆 목록과 합쳐지는지 볼 때)
// 바뀐 범위를 알 수 없는 단계(속성만 바꾸는 AttrStep 등)가 있으면 null → 전체를 다시 계산한다.
export const getChangedTopLevelRange = (doc, trs, extraBlocks = 0) => {
  const maps = trs.flatMap((tr) => tr.mapping.maps);
  const steps = trs.flatMap((tr) => tr.steps);
  const spans = [];

  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index];
    if (step instanceof AddMarkStep || step instanceof RemoveMarkStep) continue;
    if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep)) {
      return null;
    }

    const rest = new Mapping(maps.slice(index + 1));
    maps[index].forEach((oldStart, oldEnd, newStart, newEnd) => {
      spans.push([rest.map(newStart, -1), rest.map(newEnd, 1)]);
    });
  }

  const from = Math.min(...spans.map(([start]) => start));
  const to = Math.max(...spans.map(([, end]) => end));
  if (from > to) return null;

  const blocks = [];
  doc.forEach((node, offset) => blocks.push([offset, offset + node.nodeSize]));

  // 블록 사이에서 무언가를 지운 것처럼 바뀐 범위가 한 점이면 그 점에 닿은 앞뒤 블록을 모두 넣고,
  // 그 밖에는 실제로 겹치는 블록만 넣는다 (경계에 닿기만 한 옆 블록은 제외)
  const isPoint = from === to;
  let first = blocks.findIndex(([, end]) =>
    isPoint ? end >= from : end > from
  );
  if (first === -1) return null;
  let last = first;
  while (
    last + 1 < blocks.length &&
    (isPoint ? blocks[last + 1][0] <= to : blocks[last + 1][0] < to)
  ) {
    last += 1;
  }

  first = Math.max(0, first - extraBlocks);
  last = Math.min(blocks.length - 1, last + extraBlocks);

  return { from: blocks[first][0], to: blocks[last][1] };
};

// tr.doc에서 itemStart(목록 항목 바로 앞 위치)에 있는 항목을 앞뒤로 나눠, 그 항목 하나만 든
// 목록으로 떼어 낸다. 떼어 낸 목록의 위치를 돌려준다.
// continueNumbering: 나뉜 뒤쪽 조각이 원래 이어지던 번호(start + 앞쪽 항목 수)부터 시작하게 한다.
// 떼어 낸 항목은 원래 이 목록의 번호에 들어 있지 않았다고 본다. (Shift-Tab으로 하위 목록에서 올라온 항목)
// (split은 앞 목록의 attrs를 그대로 복사해 뒤쪽 조각의 번호가 처음부터 다시 매겨지기 때문)
export const isolateListItem = (tr, itemStart, { continueNumbering }) => {
  const $item = tr.doc.resolve(itemStart);
  const list = $item.parent;
  const index = $item.index();
  const itemEnd = itemStart + list.child(index).nodeSize;
  const hasRest = index < list.childCount - 1;
  const stepCount = tr.steps.length;

  if (hasRest) tr.split(itemEnd, 1);
  if (index > 0) tr.split(itemStart, 1);

  const $inside = tr.doc.resolve(
    tr.mapping.slice(stepCount).map(itemStart + 1)
  );
  const listPos = $inside.before($inside.depth - 1);

  if (continueNumbering && hasRest && list.type.name === 'orderedList') {
    const restPos = listPos + tr.doc.nodeAt(listPos).nodeSize;
    const rest = tr.doc.nodeAt(restPos);
    if (rest?.type === list.type) {
      tr.setNodeMarkup(restPos, null, {
        ...rest.attrs,
        start: (list.attrs.start ?? 1) + index,
      });
    }
  }

  return listPos;
};

// 번호를 ::before 카운터로 직접 그리므로 ol의 start 값을 카운터 시작값(--ol-start = start - 1)으로 바꿔 준다. (기본값 1이면 null)
export const getOrderedListStartOffset = (start) => {
  const value = Number.parseInt(String(start ?? ''), 10);
  return Number.isFinite(value) && value !== 1 ? value - 1 : null;
};

// 번호 목록을 화면에 그릴 때 ol에 붙이는 값 (에디터 데코레이션 / 글 보기 공용)
// - data-format: 실제로 그려지는 번호 형식 (1 / a / A / i / I)
// - role="list": list-style: none 목록도 VoiceOver(WebKit)가 목록으로 읽도록
// - startOffset: --ol-start(카운터 시작값)로 넘길 값 (기본값이면 null)
export const getOrderedListDisplay = (start, format) => ({
  attrs: { role: 'list', 'data-format': format },
  startOffset: getOrderedListStartOffset(start),
});

// 한 텍스트 블록 안의 글자·마크만 바뀌는 트랜잭션인지 (일반 입력·한글 조합 등).
// 이런 변경은 목록 구조를 바꿀 수 없으므로 목록 관련 계산을 건너뛸 수 있다.
// 같은 트랜잭션을 여러 플러그인(병합·표시·모션)이 묻기 때문에 결과를 기억해 둔다.
const inlineOnlyCache = new WeakMap();

const checkInlineOnly = (tr) =>
  tr.steps.every((step, index) => {
    if (step instanceof AddMarkStep || step instanceof RemoveMarkStep) {
      return true;
    }
    if (!(step instanceof ReplaceStep)) return false;

    const doc = tr.docs[index];
    const $from = doc.resolve(step.from);
    const $to = doc.resolve(step.to);
    const { slice } = step;
    let inlineContent = true;
    slice.content.forEach((node) => {
      if (!node.isInline) inlineContent = false;
    });

    return (
      $from.parent.isTextblock &&
      $from.sameParent($to) &&
      slice.openStart === 0 &&
      slice.openEnd === 0 &&
      inlineContent
    );
  });

export const isInlineOnlyTransaction = (tr) => {
  if (!inlineOnlyCache.has(tr)) inlineOnlyCache.set(tr, checkInlineOnly(tr));
  return inlineOnlyCache.get(tr);
};
