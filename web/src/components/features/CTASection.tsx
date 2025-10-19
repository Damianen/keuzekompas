import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-[980px] rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl mb-4">
          Klaar om Jouw Module te Vinden?
        </h2>
        <p className="max-w-[600px] mx-auto text-lg md:text-xl text-blue-50 mb-8">
          {isAuthenticated
            ? 'Begin met het verkennen van onze catalogus en ontdek modules die bij jouw interesses passen.'
            : 'Sluit je aan bij duizenden studenten die Keuzekompas gebruiken om hun academische reis te plannen.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Button size="lg" asChild variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link to="/modules">
                Bekijk Modules
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link to="/register">
                  Gratis Beginnen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/modules">Bekijk Modules</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
