export function SectionDivider() {
  return (
    <div className="relative left-1/2 flex w-screen -translate-x-1/2 items-center">
      <div className="flex-1 border-t border-gray-300"></div>
      <div className="pointer-events-none absolute left-1/2 mx-auto flex w-full -translate-x-1/2 justify-between">
        <div className="mx-auto flex w-full max-w-6xl justify-between px-4 sm:px-6">
          <div className="relative -ml-[10px] bg-white p-1 text-xl text-gray-400">
            +
          </div>
          <div className="relative -mr-[10px] bg-white p-1 text-xl text-gray-400">
            +
          </div>
        </div>
      </div>
      <div className="flex-1 border-t border-gray-300"></div>
    </div>
  );
}
