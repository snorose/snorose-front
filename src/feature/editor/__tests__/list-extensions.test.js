import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import { LIST_EXTENSIONS } from '@/feature/editor/component/extensions/list-extensions';

// jsdom에는 레이아웃이 없어 ProseMirror의 스크롤·좌표 계산용 API를 비워 둔다.
beforeAll(() => {
  const emptyRect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  };
  Range.prototype.getClientRects = () => [];
  Range.prototype.getBoundingClientRect = () => emptyRect;
  document.elementFromPoint = () => null;
});

const editors = [];
afterEach(() => {
  editors.splice(0).forEach((editor) => editor.destroy());
});

const createEditor = (content) => {
  const editor = new Editor({
    element: document.createElement('div'),
    extensions: [
      StarterKit.configure({
        link: false,
        blockquote: false,
        listItem: false,
        orderedList: false,
      }),
      ...LIST_EXTENSIONS,
    ],
    content,
  });
  editors.push(editor);
  return editor;
};

// 사용자가 글자를 치는 것처럼 입력 규칙을 거쳐 넣는다.
const typeText = (editor, text) => {
  const { view } = editor;
  [...text].forEach((char) => {
    const { from, to } = view.state.selection;
    const handled = view.someProp('handleTextInput', (handler) =>
      handler(view, from, to, char, () =>
        view.state.tr.insertText(char, from, to)
      )
    );
    if (!handled) view.dispatch(view.state.tr.insertText(char, from, to));
  });
};

const press = (editor, key, shiftKey = false) =>
  editor.view.someProp('handleKeyDown', (handler) =>
    handler(editor.view, new KeyboardEvent('keydown', { key, shiftKey }))
  );

// 텍스트 노드 시작 위치
const posOf = (editor, text) => {
  let found = null;
  editor.state.doc.descendants((node, pos) => {
    if (found === null && node.isText && node.text === text) found = pos;
  });
  return found;
};

// 비교하기 쉽게 <p> 태그를 뺀다. (끝에 자동으로 붙는 빈 문단도 함께 사라진다.)
const htmlOf = (editor) => editor.getHTML().replace(/<\/?p>/g, '');

describe('번호 목록 입력 규칙과 병합', () => {
  it('1. 을 입력하면 번호 목록이 된다', () => {
    const editor = createEditor('<p></p>');
    typeText(editor, '1. hello');
    expect(htmlOf(editor)).toBe('<ol><li>hello</li></ol>');
  });

  it('숫자 목록 아래에서 a. 는 따로, 5. 는 이어 붙는다', () => {
    const alpha = createEditor('<ol><li><p>a</p></li></ol><p></p>');
    alpha.commands.setTextSelection(alpha.state.doc.content.size - 1);
    typeText(alpha, 'a. b');
    expect(htmlOf(alpha)).toBe(
      '<ol><li>a</li></ol><ol type="a"><li>b</li></ol>'
    );

    const number = createEditor('<ol><li><p>a</p></li></ol><p></p>');
    number.commands.setTextSelection(number.state.doc.content.size - 1);
    typeText(number, '5. b');
    expect(htmlOf(number)).toBe('<ol><li>a</li><li>b</li></ol>');
  });

  it('툴바·단축키(toggleOrderedList)도 형식이 다른 옆 목록과 합치지 않는다', () => {
    const editor = createEditor('<ol type="a"><li><p>a</p></li></ol><p>x</p>');
    editor.commands.setTextSelection(posOf(editor, 'x'));
    editor.commands.toggleOrderedList();
    expect(htmlOf(editor)).toBe(
      '<ol type="a"><li>a</li></ol><ol><li>x</li></ol>'
    );
  });
});

describe('변환 직후 Backspace', () => {
  it.each(['1. ', 'a. ', 'i. '])(
    '%s 변환 직후 Backspace 한 번 → 번호가 지워지고 빈 문단이 된다 (입력 글자는 되살리지 않는다)',
    (input) => {
      const editor = createEditor('<p>t</p><p></p>');
      editor.commands.setTextSelection(editor.state.doc.content.size - 1);
      typeText(editor, input);
      expect(editor.getHTML()).toContain('<ol');
      press(editor, 'Backspace');
      expect(editor.getHTML()).toBe('<p>t</p><p></p><p></p>');
    }
  );

  it('앞 목록에 합쳐진 경우도 Backspace 한 번에 그 항목만 목록에서 빠진다', () => {
    const editor = createEditor('<ol><li><p>a</p></li></ol><p></p><p>t</p>');
    // 목록 바로 아래 빈 문단 안
    editor.commands.setTextSelection(editor.state.doc.child(0).nodeSize + 1);
    typeText(editor, '1. ');
    expect(htmlOf(editor)).toBe('<ol><li>a</li><li></li></ol>t');
    press(editor, 'Backspace');
    expect(editor.getHTML()).toBe('<ol><li><p>a</p></li></ol><p></p><p>t</p>');
  });

  it('다른 입력이 끼면 Backspace는 목록만 푼다', () => {
    const editor = createEditor('<p></p>');
    typeText(editor, 'a. word');
    editor.commands.setTextSelection(posOf(editor, 'word'));
    press(editor, 'Backspace');
    expect(htmlOf(editor)).toBe('word');
  });
});

describe('Tab / Shift-Tab', () => {
  it('Shift-Tab으로 나뉜 바깥 목록의 뒤쪽 조각은 번호를 이어간다', () => {
    const editor = createEditor(
      '<ol><li><p>one</p></li><li><p>two</p><ol type="a"><li><p>X</p></li></ol></li><li><p>three</p></li></ol>'
    );
    editor.commands.setTextSelection(posOf(editor, 'X'));
    press(editor, 'Tab', true);
    expect(htmlOf(editor)).toBe(
      '<ol><li>one</li><li>two</li></ol><ol type="a"><li>X</li></ol><ol start="3"><li>three</li></ol>'
    );
  });

  it('직접 지정한 형식은 첫 항목 Tab 후에도 유지되고 Shift-Tab으로 그대로 돌아온다', () => {
    const editor = createEditor(
      '<ol><li><p>a</p></li></ol><ol type="i" start="4"><li><p>x</p></li></ol>'
    );
    editor.commands.setTextSelection(posOf(editor, 'x'));
    press(editor, 'Tab');
    expect(htmlOf(editor)).toBe(
      '<ol><li>a<ol type="i"><li>x</li></ol></li></ol>'
    );
    press(editor, 'Tab', true);
    expect(htmlOf(editor)).toBe(
      '<ol><li>a</li></ol><ol type="i"><li>x</li></ol>'
    );
  });
});
