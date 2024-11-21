import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function WhatYouCanBuild() {
  const features = [
    { title: 'Blogs', description: 'Manage posts and categories.', icon: '📝' },
    {
      title: 'Portfolios',
      description: 'Showcase your projects dynamically.',
      icon: '🎨',
    },
    {
      title: 'Shops',
      description: 'Add products and manage orders.',
      icon: '🛒',
    },
    {
      title: 'Custom Content',
      description: 'Define your own data models.',
      icon: '🔧',
    },
  ];

  return (
    <section className="py-12">
      <h2 className="text-center text-3xl font-bold text-foreground">
        What You Can Build
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="border-border bg-card text-center"
          >
            <CardHeader>
              <div className="text-4xl">{feature.icon}</div>
              <CardTitle className="mt-4 text-foreground">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default WhatYouCanBuild;
