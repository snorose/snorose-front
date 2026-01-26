import { ReactNode } from 'react';

import { Navbar } from '@/shared/component';

type NavbarLayoutProps = {
  children: ReactNode;
};

export default function NavbarLayout({ children }: NavbarLayoutProps) {
  return (
    <>
      {children}
      <Navbar />
    </>
  );
}
