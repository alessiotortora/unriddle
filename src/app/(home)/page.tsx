import { SectionDivider } from '@/components/ui/section-divider';

import Features from './_components/features';
import Hero from './_components/hero';
import HowItWorks from './_components/how-it-works';
import WhatYouCanBuild from './_components/what-you-can-build';

export default function HomePage() {
  return (
    <>
      {/* Vertical Lines Container - always visible */}
      <div className="pointer-events-none fixed inset-0 flex justify-center">
        <div className="mx-auto flex w-full max-w-6xl justify-between px-4 sm:px-6">
          <div className="w-px bg-border"></div>
          <div className="w-px bg-border"></div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <section className="p-6">
          <Hero />
        </section>
        <SectionDivider />

        <section className="p-6">
          <WhatYouCanBuild />
        </section>
        <SectionDivider />

        <section className="p-6">
          <HowItWorks />
        </section>
        <SectionDivider />

        <section className="p-6">
          <Features />
        </section>
      </div>
    </>
  );
}
