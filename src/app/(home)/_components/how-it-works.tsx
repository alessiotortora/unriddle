import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function HowItWorks() {
  const steps = [
    { title: 'Create Tenant', description: 'Set up your workspace.' },
    { title: 'Add Content', description: 'Add blogs, projects, or products.' },
    { title: 'Fetch Data', description: 'Access data via REST/GraphQL API.' },
    { title: 'Integrate', description: 'Use in your frontend framework.' },
  ];

  return (
    <section className="py-12">
      <h2 className="text-center text-3xl font-bold text-foreground">
        How It Works
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        {steps.map((step, index) => (
          <Card key={index} className="bg-card text-center">
            <CardHeader>
              <CardTitle className="text-foreground">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
