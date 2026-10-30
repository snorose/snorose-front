import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { ReplaceStep } from 'prosemirror-transform';

import {
  findListItemDepth,
  getNearestListType,
  isInlineOnlyTransaction,
  isListNode,
} from '@/feature/editor/lib/listNode';

// 목록 전환(변환·해제·들여쓰기·병합) 시 텍스트가 밀려나는 모션을 준다.
// ProseMirror는 전환 시 DOM을 새로 만들기 때문에 CSS transition 대신
// 전환 전 위치를 기억해 두었다가 새 위치에서 거꾸로 되돌아오는 FLIP 방식으로 그린다.
// 어떤 명령으로 바뀌었는지와 상관없이, 트랜잭션이 적용되기 직전(filterTransaction)에
// 선택 영역 블록의 목록 구조가 바뀌는지 보고 바뀔 때만 위치를 기록한다.

const listMotionKey = new PluginKey('listMotion');

const DURATION = 180;
const EASING = 'cubic-bezier(0.2, 0, 0, 1)';
// 번호가 나타날 때 왼쪽에서 밀려 들어오는 거리
const MARKER_OFFSET = '-1.2rem';
const MAX_ITEMS = 50;
// 사용자가 직접 목록을 바꾼 게 아닌 트랜잭션 (붙여넣기·드롭·잘라내기)
const SKIPPED_UI_EVENTS = ['paste', 'drop', 'cut'];

// 매 트랜잭션마다 미디어 쿼리를 새로 만들지 않도록 한 번만 만들어 둔다.
const reducedMotionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)')
    : null;
const prefersReducedMotion = () => !!reducedMotionQuery?.matches;

const supportsPseudoAnimation = () =>
  typeof KeyframeEffect !== 'undefined' &&
  'pseudoElement' in KeyframeEffect.prototype;

const getCoords = (view, pos) => {
  try {
    return view.coordsAtPos(pos);
  } catch {
    return null;
  }
};

// 블록이 들어 있는 목록 구조 (예: 'orderedList>bulletList', 목록 밖이면 '')
const getListPath = (doc, pos) => {
  if (pos < 0 || pos > doc.content.size) return null;

  const $pos = doc.resolve(pos);
  const path = [];
  for (let depth = 1; depth <= $pos.depth; depth += 1) {
    const node = $pos.node(depth);
    if (isListNode(node)) path.push(node.type.name);
  }
  return path.join('>');
};

const shouldSkip = (tr, state) =>
  !tr.docChanged ||
  // 글자 입력처럼 한 문단 안에서만 바뀌면 목록 구조가 바뀔 수 없다.
  isInlineOnlyTransaction(tr) ||
  // 되돌리기/다시 실행
  !!tr.getMeta('history$') ||
  SKIPPED_UI_EVENTS.includes(tr.getMeta('uiEvent')) ||
  // 글 불러오기(setContent)처럼 문서 전체를 새 내용으로 바꾸는 경우
  // (문단 하나뿐인 문서를 목록으로 감싸는 ReplaceAroundStep은 제외)
  tr.steps.some(
    (step) =>
      step instanceof ReplaceStep &&
      step.from === 0 &&
      step.to === state.doc.content.size
  ) ||
  prefersReducedMotion();

// 적용 직전, 목록 구조가 바뀌는 선택 영역 블록들의 화면 위치를 기록한다
// (커서가 있는 블록은 커서 위치, 나머지는 블록 시작 위치 기준)
const captureListMotion = (view, state, tr) => {
  const { from, to, head } = state.selection;
  const candidates = [];

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (candidates.length >= MAX_ITEMS) return false;
    if (!node.isTextblock) return true;

    const contentStart = pos + 1;
    const contentEnd = pos + node.nodeSize - 1;
    const ref =
      head >= contentStart && head <= contentEnd ? head : contentStart;

    // 지워진 블록(목록 경계를 넘는 선택 삭제 등)은 다른 위치로 옮겨져 목록 구조가 바뀐 것처럼 보이므로 제외하고, 남아 있는 블록의 목록 구조가 바뀔 때만 기록한다.
    // 블록 시작이 지워져 앞 블록에 합쳐진 경우(선택 영역 끝 블록 등)도 제외한다.
    const mapped = tr.mapping.mapResult(ref);
    if (
      !mapped.deleted &&
      !tr.mapping.mapResult(contentStart, -1).deleted &&
      getListPath(state.doc, ref) !== getListPath(tr.doc, mapped.pos)
    ) {
      candidates.push(ref);
    }

    return false;
  });

  const items = candidates.flatMap((ref) => {
    const coords = getCoords(view, ref);
    if (!coords) return [];

    return {
      pos: ref,
      left: coords.left,
      top: coords.top,
      listName: getNearestListType(state.doc.resolve(ref)),
    };
  });

  return items.length > 0 ? { items } : null;
};

const mapMotion = (motion, mapping) => ({
  items: motion.items.map((item) => ({ ...item, pos: mapping.map(item.pos) })),
});

const playMotion = (view, motion) => {
  const { doc } = view.state;
  // 움직일 요소 → 전환 전후 위치 차이, 번호를 새로 보여줄 항목
  const moves = new Map();
  const markers = new Set();

  motion.items.forEach((item) => {
    if (item.pos < 0 || item.pos > doc.content.size) return;

    const $pos = doc.resolve(item.pos);
    if (!$pos.parent.isTextblock || $pos.depth < 1) return;

    const coords = getCoords(view, item.pos);
    if (!coords) return;

    const dx = item.left - coords.left;
    const dy = item.top - coords.top;
    const listName = getNearestListType($pos);
    const moved = Math.abs(dx) >= 1 || Math.abs(dy) >= 1;

    const itemDepth = findListItemDepth($pos);
    const itemDom =
      itemDepth === null ? null : view.nodeDOM($pos.before(itemDepth));

    // 목록 안에서 위치만 바뀌면(들여쓰기) 번호째로 항목을 옮기고, 목록에 들어가거나 빠지면 번호는 제자리에 두고 텍스트만 민다.
    const target =
      item.listName && itemDom ? itemDom : view.nodeDOM($pos.before());

    if (moved && target instanceof HTMLElement && !moves.has(target)) {
      moves.set(target, { dx, dy });
    }

    // 번호가 나타나는 모션은 ::before로 직접 그리는 번호 목록에만 준다.
    // (글머리표 목록은 브라우저 기본 마커라 애니메이션할 수 없다.)
    if (
      listName === 'orderedList' &&
      listName !== item.listName &&
      itemDom instanceof HTMLElement
    ) {
      markers.add(itemDom);
    }
  });

  const animations = [];

  moves.forEach(({ dx, dy }, target) => {
    // 함께 움직이는 상위 항목이 있으면(하위 목록째 들여쓰기 등) 그 이동분은 상위 항목이 이미 그리므로 빼고, 상위 항목 기준 상대 위치만 움직인다.
    let ancestor = target.parentElement;
    while (ancestor && ancestor !== view.dom && !moves.has(ancestor)) {
      ancestor = ancestor.parentElement;
    }
    const base = ancestor ? moves.get(ancestor) : null;
    const x = dx - (base?.dx ?? 0);
    const y = dy - (base?.dy ?? 0);

    if (Math.abs(x) < 1 && Math.abs(y) < 1) return;

    animations.push(
      target.animate(
        [
          { transform: `translate(${x}px, ${y}px)` },
          { transform: 'translate(0, 0)' },
        ],
        { duration: DURATION, easing: EASING }
      )
    );
  });

  if (supportsPseudoAnimation()) {
    markers.forEach((itemDom) => {
      animations.push(
        itemDom.animate(
          [
            { opacity: 0, transform: `translateX(${MARKER_OFFSET})` },
            { opacity: 1, transform: 'translateX(0)' },
          ],
          { duration: DURATION, easing: EASING, pseudoElement: '::before' }
        )
      );
    });
  }

  return animations;
};

export const ListMotion = Extension.create({
  name: 'listMotion',

  addProseMirrorPlugins() {
    // Tiptap v3의 editor.view는 마운트 전·destroy 후 접근하면 예외를 던지는 Proxy라, 플러그인 view()에서 받은 EditorView를 직접 보관해 쓴다.
    let currentView = null;

    return [
      new Plugin({
        key: listMotionKey,

        // 트랜잭션이 적용되기 전, 화면이 아직 이전 상태일 때 위치를 기록해 둔다.
        filterTransaction: (tr, state) => {
          // 같은 dispatch에서 이어 붙는 트랜잭션(appendTransaction)은 중간 상태(state)로 검사되고 화면(DOM)은 아직 이전 상태라 위치를 잴 수 없다.
          // 이 시점엔 'appendedTransaction' meta가 아직 붙지 않으므로 화면 상태와 다른 state로 들어오는지로 구분한다.
          if (
            !currentView?.dom.isConnected ||
            state !== currentView.state ||
            shouldSkip(tr, state)
          ) {
            return true;
          }

          const motion = captureListMotion(currentView, state, tr);
          if (motion) tr.setMeta(listMotionKey, motion);

          return true;
        },

        state: {
          init: () => null,
          apply: (tr, value) => {
            const motion = tr.getMeta(listMotionKey);
            if (motion) return mapMotion(motion, tr.mapping);

            // 같은 dispatch에서 이어 붙는 트랜잭션(목록 병합 등)은 위치만 갱신
            if (value && tr.getMeta('appendedTransaction')) {
              return mapMotion(value, tr.mapping);
            }

            return null;
          },
        },

        view: (editorView) => {
          currentView = editorView;
          let played = null;
          let running = [];

          // iOS(WebKit)는 커서를 텍스트와 따로 그려 transform 모션을 매끄럽게 따라오지 못하고 뚝뚝 끊기므로, 모션이 도는 동안에만 커서를 숨긴다.
          // (루트 style 변경은 ProseMirror가 DOM 변경으로 보지 않는다.)
          const setCaretHidden = (hidden) => {
            if (hidden) editorView.dom.style.caretColor = 'transparent';
            else editorView.dom.style.removeProperty('caret-color');
          };

          const cancelRunning = () => {
            running.forEach((animation) => animation.cancel());
            running = [];
          };

          return {
            update: (view) => {
              const motion = listMotionKey.getState(view.state);
              if (!motion || motion === played) return;

              // 이전 모션이 끝나기 전에 다시 전환되면, 전환 전 위치는 이미 화면에 보이던(모션 중인) 위치로 기록돼 있으므로 이전 모션은 끊고 이어 그린다.
              played = motion;
              cancelRunning();

              const animations = playMotion(view, motion);
              running = animations;
              setCaretHidden(animations.length > 0);

              Promise.allSettled(animations.map((a) => a.finished)).then(() => {
                if (running === animations) setCaretHidden(false);
              });
            },
            destroy: () => {
              cancelRunning();
              setCaretHidden(false);
              if (currentView === editorView) currentView = null;
            },
          };
        },
      }),
    ];
  },
});
