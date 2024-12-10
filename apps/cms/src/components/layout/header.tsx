import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';

export function Header() {
  return (
    <header className="fixed top-0 flex w-full shrink-0 items-center gap-3 p-4">
      <SidebarTrigger variant="outline" />
      <Separator orientation="vertical" className="h-6" />
    </header>
  );
}
