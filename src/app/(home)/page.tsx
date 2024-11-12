import { SectionDivider } from '@/components/ui/section-divider';

import Hero from './_components/hero';

export default function HomePage() {
  return (
    <>
      {/* Vertical Lines Container - always visible */}
      <div className="pointer-events-none fixed inset-0 flex justify-center">
        <div className="mx-auto flex w-full max-w-6xl justify-between px-4 sm:px-6">
          <div className="w-px bg-gray-300"></div>
          <div className="w-px bg-gray-300"></div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <section className="p-6">
          <Hero />
        </section>
        <SectionDivider />

        <section className="p-6">
          <div className="rounded-md bg-gray-100 p-4 shadow-md">
            Section 1 content
          </div>
        </section>
        <SectionDivider />

        <section className="p-6">
          <div className="rounded-md bg-gray-100 p-4 shadow-md">
            Section 2 content
          </div>
        </section>
      </div>
    </>
  );
}
