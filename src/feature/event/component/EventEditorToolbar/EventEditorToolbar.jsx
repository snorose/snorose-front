import { useLayoutEffect, useRef, useState } from 'react';

import {
  IconHashtag,
  IconOpenEditor,
  IconOpenEditorThick,
} from '@snorose/icons';

import { useAttachmentBarPosition } from '@/feature/attachment/hook';
import { FixedMenuEditor } from '@/feature/editor/component';

import styles from './EventEditorToolbar.module.css';

export default function EventEditorToolbar({
  editor,
  visible,
  disabled,
  onHeightChange,
}) {
  const barRef = useAttachmentBarPosition();
  const [expanded, setExpanded] = useState(false);
  const EditorIcon = expanded ? IconOpenEditorThick : IconOpenEditor;
  const shown = visible && Boolean(editor) && !disabled;
  const heightCallback = useRef(onHeightChange);
  heightCallback.current = onHeightChange;

  useLayoutEffect(() => {
    const element = barRef.current;
    if (!element) return;
    const update = () =>
      heightCallback.current?.(element.getBoundingClientRect().height);
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [shown, expanded, barRef]);

  return (
    <div ref={barRef} className={styles.bar} hidden={!shown}>
      {expanded && editor && <FixedMenuEditor editor={editor} />}
      <div
        className={styles.actions}
        onMouseDown={(event) => event.preventDefault()}
      >
        <button
          type='button'
          aria-label='글자 꾸미기'
          aria-expanded={expanded}
          onClick={() => setExpanded((previous) => !previous)}
        >
          <EditorIcon
            width={27}
            height={21}
            color='var(--blue-3)'
            aria-hidden='true'
          />
        </button>
        <button
          type='button'
          aria-label='해시태그'
          onClick={() => editor?.chain().focus().insertContent('#').run()}
        >
          <IconHashtag
            width={23}
            height={21}
            color='var(--blue-3)'
            aria-hidden='true'
          />
        </button>
      </div>
    </div>
  );
}
