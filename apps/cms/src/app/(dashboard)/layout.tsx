import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getProjects } from '@/lib/actions/get/get-projects';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const projects = await getProjects();
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar projects={projects} />
      <div className="w-full">
        <Header />
        <main className="mt-16 h-screen w-full flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
