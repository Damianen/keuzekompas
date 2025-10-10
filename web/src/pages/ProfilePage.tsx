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
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Manage your account information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {editing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="study">Study Program</Label>
                                    <Input
                                        id="study"
                                        value={formData.study}
                                        onChange={(e) => setFormData({ ...formData, study: e.target.value })}
                                    />
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                    <p className="text-base">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-base">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Study Program</p>
                                    <p className="text-base">{user.study}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Role</p>
                                    <p className="text-base">{user.role === 2 ? 'Admin' : 'Student'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                                    <Button variant="outline" onClick={logout}>
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Favorite Modules</CardTitle>
                        <CardDescription>Your saved modules</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {favorites.length === 0 ? (
                            <p className="text-gray-500">No favorites yet</p>
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
                                                {module.provider} • {module.level} • {module.duration} weeks
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveFavorite(module.id)}
                                        >
                                            Remove
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
