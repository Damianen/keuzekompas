import { UserPlus, Search, Heart, GraduationCap } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Account Aanmaken',
    description: 'Meld je aan met je e-mail om te beginnen en toegang te krijgen tot alle functies.',
    icon: UserPlus,
  },
  {
    number: '2',
    title: 'Modules Bekijken',
    description: 'Verken onze uitgebreide catalogus en gebruik filters om te vinden wat je nodig hebt.',
    icon: Search,
  },
  {
    number: '3',
    title: 'Favorieten Opslaan',
    description: 'Markeer modules die je interesseren en bouw je persoonlijke collectie.',
    icon: Heart,
  },
  {
    number: '4',
    title: 'Maak Je Keuze',
    description: 'Bekijk je opties en maak een weloverwogen beslissing over je studie.',
    icon: GraduationCap,
  },
];

export function HowItWorksSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto flex max-w-[980px] flex-col items-center justify-center gap-4 text-center mb-16">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Hoe Het Werkt
        </h2>
        <p className="max-w-[700px] mx-auto text-lg text-muted-foreground">
          Begin in slechts een paar eenvoudige stappen
        </p>
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              <div className="mb-4 relative">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
