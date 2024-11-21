'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useUser } from '@/hooks/use-user';

import { Button } from '../ui/button';
import { ModeToggle } from '../ui/theme-toggle';

export function AppNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main Navigation"
      className={`fixed left-0 right-0 top-0 z-10 mx-auto w-full max-w-5xl px-10 py-3 transition-all duration-300 ${
        isScrolled
          ? 'bg-background dark:bg-muted mt-4 rounded-lg shadow-md'
          : 'mt-0 bg-transparent shadow-none'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link href="/">
            <p className="cursor-pointer text-3xl font-semibold">CMS.</p>
          </Link>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-4">
          <ModeToggle />

          {user ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
