import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ModuleSummary } from '@/types';

export function ProfilePage() {
    const { user, logout } = useAuth();
    const [editing, setEditing] = useState(false);
    const [favorites, setFavorites] = useState<ModuleSummary[]>([]);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        study: user?.study || '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const loadFavorites = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await api.getUserFavorites(user.id);
            setFavorites(response.data);
        } catch (err) {
            console.error('Failed to load favorites:', err);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                study: user.study,
            });
            loadFavorites();
        }
    }, [user, loadFavorites]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setError('');
        setLoading(true);

        try {
            await api.updateUser(user.id, formData);
            setEditing(false);
            // Optionally refresh user data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (moduleId: string) => {
        if (!user?.id) return;

        try {
            await api.removeFavorite(user.id, moduleId);
            setFavorites(favorites.filter((f) => f.id !== moduleId));
        } catch (err) {
            console.error('Failed to remove favorite:', err);
        }
    };

    if (!user) {
        return <div>Laden...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profiel</CardTitle>
                        <CardDescription>Beheer je accountgegevens</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {editing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Naam</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="study">Studieprogramma</Label>
                                    <Input
                                        id="study"
                                        value={formData.study}
                                        onChange={(e) => setFormData({ ...formData, study: e.target.value })}
                                    />
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Opslaan...' : 'Opslaan'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                                        Annuleren
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Naam</p>
                                    <p className="text-base">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">E-mail</p>
                                    <p className="text-base">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Studieprogramma</p>
                                    <p className="text-base">{user.study}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Rol</p>
                                    <p className="text-base">{user.role === 2 ? 'Beheerder' : 'Student'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setEditing(true)}>Bewerk Profiel</Button>
                                    <Button variant="outline" onClick={logout}>
                                        Uitloggen
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Favoriete Modules</CardTitle>
                        <CardDescription>Je opgeslagen modules</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {favorites.length === 0 ? (
                            <p className="text-gray-500">Nog geen favorieten</p>
                        ) : (
                            <div className="space-y-2">
                                {favorites.map((module) => (
                                    <div
                                        key={module.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{module.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {module.provider} • {module.level} • {module.duration} weken
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveFavorite(module.id)}
                                        >
                                            Verwijderen
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
