import { Button } from '@/components/ui/button';

function Hero() {
  return (
    <section className="rounded-lg bg-background p-12 text-center shadow-sm">
      <h1 className="text-4xl font-bold text-foreground">
        The Open-Source CMS for Everyone
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Manage blogs, portfolios, shops, and more with ease. Free, minimal, and
        multi-tenant.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Button asChild>
          <a href="/get-started">Get Started</a>
        </Button>
        <Button asChild variant="outline">
          <a href="https://github.com/your-repo">View on GitHub</a>
        </Button>
      </div>
    </section>
  );
}

export default Hero;
