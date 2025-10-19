import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/modules');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Inloggen mislukt');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-20 mt-14">
            <div className="mx-auto max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Inloggen</CardTitle>
                        <CardDescription>
                            Voer je inloggegevens in om toegang te krijgen tot je account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Voer je e-mailadres in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2 pb-6">
                                <Label htmlFor="password">Wachtwoord</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Voer je wachtwoord in"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? 'Bezig met inloggen...' : 'Inloggen'}
                            </Button>
                            <p className="text-sm text-muted-foreground text-center">
                                Nog geen account?{' '}
                                <Link to="/register" className="text-primary hover:underline">
                                    Registreren
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
