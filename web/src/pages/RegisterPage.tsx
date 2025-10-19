import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        study: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Wachtwoorden komen niet overeen');
            return;
        }

        setLoading(true);
        try {
            await register({
                email: formData.email,
                name: formData.name,
                study: formData.study,
                password: formData.password,
            });
            navigate('/modules');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registratie mislukt');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 mt-10">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Account aanmaken</CardTitle>
                    <CardDescription>Registreer om modules te verkennen</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="naam@voorbeeld.nl"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Naam</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Jan Jansen"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="study">Studieprogramma</Label>
                            <Input
                                id="study"
                                type="text"
                                placeholder="Informatica"
                                value={formData.study}
                                onChange={(e) => setFormData({ ...formData, study: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Wachtwoord</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Account aanmaken...' : 'Registreren'}
                        </Button>
                        <p className="text-center text-sm text-gray-600">
                            Al een account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Inloggen
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
