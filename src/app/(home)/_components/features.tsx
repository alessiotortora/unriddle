import { Badge } from '@/components/ui/badge';

function Features() {
  const features = [
    'Multi-Tenant Workspaces',
    'Open API',
    'Custom Content Models',
    'Authentication via Supabase',
    'Version Control',
    'Free and Open Source',
  ];

  return (
    <section className="py-12">
      <h2 className="text-center text-3xl font-bold text-foreground">
        Features
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {features.map((feature, index) => (
          <Badge
            key={index}
            variant="outline"
            className="border-border bg-card px-4 py-2 text-foreground"
          >
            {feature}
          </Badge>
        ))}
      </div>
    </section>
  );
}

export default Features;
