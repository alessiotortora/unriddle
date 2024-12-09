// components
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = false,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="faded-bottom h-screen">
          <div className="h-full px-4 pb-32 pt-4 md:px-8">{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-full p-4 md:px-8">{children}</div>
      )}
    </>
  );
}
