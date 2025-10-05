import { FeatureCard } from './FeatureCard';
import { Search, BookmarkPlus, Globe2, Award, Filter, Users } from 'lucide-react';

const features = [
  {
    title: 'Extensive Catalog',
    description: 'Browse modules from universities across the Netherlands and beyond.',
    icon: Globe2,
  },
  {
    title: 'Smart Search',
    description: 'Find modules by name, provider, level, or keywords in seconds.',
    icon: Search,
  },
  {
    title: 'Save Favorites',
    description: 'Build your personal collection of modules that interest you.',
    icon: BookmarkPlus,
  },
  {
    title: 'Detailed Info',
    description: 'Get comprehensive information about duration, location, and content.',
    icon: Award,
  },
  {
    title: 'Filter & Compare',
    description: 'Narrow down options based on your specific requirements.',
    icon: Filter,
  },
  {
    title: 'For Students',
    description: 'Built by students, for students to simplify module selection.',
    icon: Users,
  },
];

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto flex max-w-[980px] flex-col items-center justify-center gap-4 text-center mb-12">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Everything You Need
        </h2>
        <p className="max-w-[700px] mx-auto text-lg text-muted-foreground">
          Powerful features to help you discover and choose the right modules for your studies.
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
