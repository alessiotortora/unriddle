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
        <ScrollArea className="md:faded-bottom h-screen">
          <div className="h-full px-4 pb-32 pt-4">{children}</div>
        </ScrollArea>
      ) : (
        <div className="md:faded-bottom h-full p-4">{children}</div>
      )}
    </>
  );
}
