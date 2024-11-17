export function SectionDivider() {
  return (
    <div className="relative left-1/2 flex w-screen -translate-x-1/2 items-center">
      {/* Left Border */}
      <div className="flex-1 border-t border-border"></div>

      {/* Central '+' Icons */}
      <div className="pointer-events-none absolute left-1/2 mx-auto flex w-full -translate-x-1/2 justify-between">
        <div className="mx-auto flex w-full max-w-6xl justify-between px-4 sm:px-6">
          <div className="relative -ml-[10px] bg-background p-1 text-xl text-muted-foreground">
            +
          </div>
          <div className="relative -mr-[10px] bg-background p-1 text-xl text-muted-foreground">
            +
          </div>
        </div>
      </div>

      {/* Right Border */}
      <div className="flex-1 border-t border-border"></div>
    </div>
  );
}
