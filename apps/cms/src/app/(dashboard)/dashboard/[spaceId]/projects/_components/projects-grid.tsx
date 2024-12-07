interface ProjectsGridProps {
  children: React.ReactNode;
}

export function ProjectsGrid({ children }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
} 