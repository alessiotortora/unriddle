interface EventsGridProps {
  children: React.ReactNode;
}

export function EventsGrid({ children }: EventsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
