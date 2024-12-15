import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { ThemeToggle } from '../ui/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 flex w-full items-center justify-between gap-3 p-4">
      <div className="flex flex-row items-center gap-3">
        <SidebarTrigger variant="outline" />
        <Separator orientation="vertical" className="h-6" />
      </div>
      <ThemeToggle />
    </header>
  );
}
