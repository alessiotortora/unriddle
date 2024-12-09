import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';

export function Header() {
  return (
    <header className="fixed top-0 flex w-full shrink-0 items-center gap-3 p-4">
      <SidebarTrigger variant="outline" className="scale-75" />
      <Separator orientation="vertical" className="mr-2 h-6" />
    </header>
  );
}
