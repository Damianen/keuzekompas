import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link className="flex items-center space-x-2" to="/">
              <span className="text-xl font-bold">Keuzekompas</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/modules"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Modules
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            {isAuthenticated ? (
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link to="/profile">{user?.name || 'Profile'}</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden md:inline-flex">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="hidden md:inline-flex rounded-xl">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
