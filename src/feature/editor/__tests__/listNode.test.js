import { getSchema } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { DOMParser as PMDOMParser } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';
import { EditorState, TextSelection } from 'prosemirror-state';

import { LIST_EXTENSIONS } from '@/feature/editor/component/extensions/list-extensions';
import {
  getChangedTopLevelRange,
  getNextOrderedFormat,
  isInlineOnlyTransaction,
  isolateListItem,
  resolveOrderedFormat,
  walkListFormats,
} from '@/feature/editor/lib/listNode';

const schema = getSchema([
  StarterKit.configure({ listItem: false, orderedList: false }),
  ...LIST_EXTENSIONS,
]);

const docOf = (html) => {
  const element = document.createElement('div');
  element.innerHTML = html;
  return PMDOMParser.fromSchema(schema).parse(element);
};

const stateOf = (html) => EditorState.create({ schema, doc: docOf(html) });

// 텍스트 노드의 시작 위치
const posOf = (doc, text) => {
  let found = null;
  doc.descendants((node, pos) => {
    if (found === null && node.isText && node.text === text) found = pos;
  });
  return found;
};

const topLevelBlocks = (doc) => {
  const blocks = [];
  doc.forEach((node, offset) => blocks.push([offset, offset + node.nodeSize]));
  return blocks;
};

const formatsOf = (doc) => {
  const formats = [];
  walkListFormats(doc, (node, pos, { format }) => {
    if (node.type.name === 'orderedList') formats.push(format);
  });
  return formats;
};

const listsHTML = (doc) => {
  const lists = [];
  doc.forEach((node) => {
    const items = [];
    node.forEach((item) => items.push(item.textContent));
    lists.push(
      `${node.type.name}(start=${node.attrs.start ?? '-'},type=${
        node.attrs.type ?? '-'
      })[${items.join(',')}]`
    );
  });
  return lists;
};

describe('번호 형식 계산', () => {
  it('하위 목록은 1 → a → i 순서로 순환하고, 대문자도 같은 순서를 따른다', () => {
    expect(getNextOrderedFormat('1')).toBe('a');
    expect(getNextOrderedFormat('a')).toBe('i');
    expect(getNextOrderedFormat('i')).toBe('1');
    expect(getNextOrderedFormat('A')).toBe('i');
    expect(getNextOrderedFormat('I')).toBe('1');
  });

  it('직접 지정한 a·A·i·I는 그대로, 없으면 상위 형식의 다음 형식, 최상위는 1', () => {
    expect(resolveOrderedFormat(null, null)).toBe('1');
    expect(resolveOrderedFormat('a', null)).toBe('a');
    expect(resolveOrderedFormat('A', '1')).toBe('A');
    expect(resolveOrderedFormat(null, 'a')).toBe('i');
    expect(resolveOrderedFormat('unknown', 'i')).toBe('1');
  });

  it('type="1"은 형식 없음으로 보고 상위 기준 형식을 따른다 (기존 글 모양 유지)', () => {
    expect(resolveOrderedFormat('1', null)).toBe('1');
    expect(resolveOrderedFormat('1', '1')).toBe('a');
  });

  it('문서의 번호 목록 형식을 상위 목록 기준으로 계산하고, 글머리표 목록은 건너뛴다', () => {
    expect(
      formatsOf(
        docOf(
          '<ol type="a"><li><p>a</p><ol><li><p>b</p><ol><li><p>c</p></li></ol></li></ol></li></ol>'
        )
      )
    ).toEqual(['a', 'i', '1']);
    expect(
      formatsOf(
        docOf(
          '<ol><li><p>a</p><ul><li><p>b</p><ol><li><p>c</p></li></ol></li></ul></li></ol>'
        )
      )
    ).toEqual(['1', 'a']);
  });
});

describe('getChangedTopLevelRange: 바뀐 범위를 최상위 블록 단위로', () => {
  const html =
    '<p>p0</p><ol><li><p>a</p></li></ol><p>mid</p><ol><li><p>b</p></li></ol><p>end</p>';

  it('글자를 넣으면 그 글자가 든 최상위 블록 하나만', () => {
    const state = stateOf(html);
    const tr = state.tr.insertText('x', posOf(state.doc, 'mid') + 1);
    expect(getChangedTopLevelRange(tr.doc, [tr])).toEqual({
      from: topLevelBlocks(tr.doc)[2][0],
      to: topLevelBlocks(tr.doc)[2][1],
    });
  });

  it('extraBlocks만큼 앞뒤 블록을 더 넣는다', () => {
    const state = stateOf(html);
    const tr = state.tr.insertText('x', posOf(state.doc, 'mid') + 1);
    const blocks = topLevelBlocks(tr.doc);
    expect(getChangedTopLevelRange(tr.doc, [tr], 1)).toEqual({
      from: blocks[1][0],
      to: blocks[3][1],
    });
  });

  it('두 목록 사이 블록을 지우면 맞붙게 된 두 목록을 모두 포함한다', () => {
    const state = stateOf(html);
    const [midStart, midEnd] = topLevelBlocks(state.doc)[2];
    const tr = state.tr.delete(midStart, midEnd);
    const blocks = topLevelBlocks(tr.doc);
    expect(getChangedTopLevelRange(tr.doc, [tr])).toEqual({
      from: blocks[1][0],
      to: blocks[2][1],
    });
  });

  it('문단을 목록으로 감싸는 변경(ReplaceAroundStep)도 그 블록 범위로 잡는다', () => {
    const state = stateOf(html);
    const selected = state.apply(
      state.tr.setSelection(
        TextSelection.create(state.doc, posOf(state.doc, 'mid') + 1)
      )
    );
    let tr = null;
    wrapInList(schema.nodes.orderedList)(selected, (next) => {
      tr = next;
    });
    const blocks = topLevelBlocks(tr.doc);
    expect(getChangedTopLevelRange(tr.doc, [tr])).toEqual({
      from: blocks[2][0],
      to: blocks[2][1],
    });
  });

  it('범위를 알 수 없는 단계(속성만 바꾸는 AttrStep)가 있으면 null', () => {
    const state = stateOf(html);
    const listPos = topLevelBlocks(state.doc)[1][0];
    const tr = state.tr.setNodeAttribute(listPos, 'start', 3);
    expect(getChangedTopLevelRange(tr.doc, [tr])).toBeNull();
  });
});

describe('isInlineOnlyTransaction: 한 문단 안 글자·마크 변경만인지', () => {
  it('글자 입력·마크는 true', () => {
    const state = stateOf('<p>hello</p>');
    expect(isInlineOnlyTransaction(state.tr.insertText('x', 2))).toBe(true);
    expect(
      isInlineOnlyTransaction(
        state.tr.addMark(1, 3, schema.marks.bold.create())
      )
    ).toBe(true);
  });

  it('문단 나누기·블록을 넘는 삭제는 false', () => {
    const state = stateOf('<p>hello</p><p>world</p>');
    expect(isInlineOnlyTransaction(state.tr.split(3))).toBe(false);
    expect(isInlineOnlyTransaction(state.tr.delete(3, 10))).toBe(false);
  });
});

describe('isolateListItem: 목록에서 항목 하나 떼어 내기', () => {
  const html =
    '<ol start="5"><li><p>one</p></li><li><p>two</p></li><li><p>X</p></li><li><p>three</p></li></ol>';
  const itemStartOf = (doc, text) => posOf(doc, text) - 2;

  it('가운데 항목을 떼어 내고, continueNumbering이면 뒤쪽 조각이 번호를 이어간다', () => {
    const state = stateOf(html);
    const tr = state.tr;
    const listPos = isolateListItem(tr, itemStartOf(state.doc, 'X'), {
      continueNumbering: true,
    });
    expect(listsHTML(tr.doc)).toEqual([
      'orderedList(start=5,type=-)[one,two]',
      'orderedList(start=5,type=-)[X]',
      'orderedList(start=7,type=-)[three]',
    ]);
    expect(tr.doc.nodeAt(listPos).textContent).toBe('X');
  });

  it('continueNumbering이 아니면 뒤쪽 조각은 원래 목록의 start를 그대로 쓴다', () => {
    const state = stateOf(html);
    const tr = state.tr;
    isolateListItem(tr, itemStartOf(state.doc, 'X'), {
      continueNumbering: false,
    });
    expect(listsHTML(tr.doc)[2]).toBe('orderedList(start=5,type=-)[three]');
  });

  it('첫 항목·마지막 항목은 한쪽만 나눈다', () => {
    const first = stateOf(html);
    const trFirst = first.tr;
    isolateListItem(trFirst, itemStartOf(first.doc, 'one'), {
      continueNumbering: true,
    });
    expect(listsHTML(trFirst.doc)).toEqual([
      'orderedList(start=5,type=-)[one]',
      'orderedList(start=5,type=-)[two,X,three]',
    ]);

    const last = stateOf(html);
    const trLast = last.tr;
    isolateListItem(trLast, itemStartOf(last.doc, 'three'), {
      continueNumbering: true,
    });
    expect(listsHTML(trLast.doc)).toEqual([
      'orderedList(start=5,type=-)[one,two,X]',
      'orderedList(start=5,type=-)[three]',
    ]);
  });
});
