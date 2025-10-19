import { FeatureCard } from './FeatureCard';
import { Search, BookmarkPlus, Globe2, Award, Filter, Users } from 'lucide-react';

const features = [
  {
    title: 'Uitgebreide Catalogus',
    description: 'Bekijk modules van universiteiten door heel Nederland en daarbuiten.',
    icon: Globe2,
  },
  {
    title: 'Slim Zoeken',
    description: 'Vind modules op naam, aanbieder, niveau of trefwoorden in seconden.',
    icon: Search,
  },
  {
    title: 'Favorieten Bewaren',
    description: 'Bouw je persoonlijke collectie van modules die je interesseren.',
    icon: BookmarkPlus,
  },
  {
    title: 'Gedetailleerde Info',
    description: 'Krijg uitgebreide informatie over duur, locatie en inhoud.',
    icon: Award,
  },
  {
    title: 'Filteren & Vergelijken',
    description: 'Beperk opties op basis van jouw specifieke vereisten.',
    icon: Filter,
  },
  {
    title: 'Voor Studenten',
    description: 'Gemaakt door studenten, voor studenten om modulekeuze te vereenvoudigen.',
    icon: Users,
  },
];

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto flex max-w-[980px] flex-col items-center justify-center gap-4 text-center mb-12">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Alles Wat Je Nodig Hebt
        </h2>
        <p className="max-w-[700px] mx-auto text-lg text-muted-foreground">
          Krachtige functies om je te helpen de juiste modules voor je studie te ontdekken en te kiezen.
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
