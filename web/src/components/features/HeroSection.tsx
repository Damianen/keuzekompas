import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center justify-center gap-6 text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <GraduationCap className="mr-2 h-4 w-4" />
            Jouw modulekeuze gids
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Vind Jouw Perfecte Module
          </h1>

          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Verken modules van topuniversiteiten, vergelijk opties en maak weloverwogen
            beslissingen over je academische reis. Bewaar je favorieten en plan je studieroute.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/modules">
                Bekijk Modules
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Account Aanmaken</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20"></div>
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-900/20"></div>
      </div>
    </section>
  );
}
