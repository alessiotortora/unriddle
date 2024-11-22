import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="w-full">
        <Header />
        <main className="mt-16 h-screen w-full flex-1 overflow-hidden border border-red-500">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
