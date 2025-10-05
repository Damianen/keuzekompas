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
          Ready to Find Your Module?
        </h2>
        <p className="max-w-[600px] mx-auto text-lg md:text-xl text-blue-50 mb-8">
          {isAuthenticated
            ? 'Start exploring our catalog and discover modules that match your interests.'
            : 'Join thousands of students who use Keuzekompas to plan their academic journey.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Button size="lg" asChild variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link to="/modules">
                Browse Modules
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/modules">View Modules</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
