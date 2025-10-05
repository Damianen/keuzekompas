import { HeroSection } from '@/components/features/HeroSection';
import { FeaturesSection } from '@/components/features/FeaturesSection';
import { HowItWorksSection } from '@/components/features/HowItWorksSection';
import { CTASection } from '@/components/features/CTASection';

export function HomePage() {
  return (
    <>
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
        <HeroSection />
      </div>
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
