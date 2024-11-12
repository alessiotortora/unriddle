import { AppNavbar } from '@/components/layout/app-navbar';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="min-h-screen">
      <AppNavbar />
      <main>{children}</main>
    </div>
  );
}
