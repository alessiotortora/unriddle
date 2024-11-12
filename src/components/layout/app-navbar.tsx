import Link from 'next/link';

import { Button } from '../ui/button';

export function AppNavbar() {
  return (
    <nav className="mx-auto flex h-24 max-w-6xl items-center justify-between px-10">
      <div>
        <Link href="/">
          <p className="cursor-pointer text-3xl font-semibold">CMS.</p>
        </Link>
      </div>
      <div>
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      </div>
    </nav>
  );
}
