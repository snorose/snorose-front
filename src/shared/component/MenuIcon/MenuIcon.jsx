import { IconHamburgerMenu } from '@snorose/icons';

import { useSidebarStore } from '@/shared/store';

export default function MenuIcon() {
  const open = useSidebarStore((state) => state.open);

  return (
    <>
      <IconHamburgerMenu
        width={23}
        height={16}
        color='var(--blue-4)'
        onClick={(event) => {
          event.stopPropagation();
          open();
        }}
        style={{ cursor: 'pointer' }}
      />
    </>
  );
}
