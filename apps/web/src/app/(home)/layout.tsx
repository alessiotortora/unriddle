import { AppFooter } from '@/components/layout/app-footer';
import { AppNavbar } from '@/components/layout/app-navbar';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <AppNavbar />
      <main className="pt-24">{children}</main>
      <AppFooter />
    </div>
  );
}
