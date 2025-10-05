import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Module } from '@/types';

export function ModulesPage() {
    const { user } = useAuth();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [favoriteModuleIds, setFavoriteModuleIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadModules();
        if (user?.id) {
            loadFavorites();
        }
    }, [user?.id]);

    const loadModules = async () => {
        try {
            const response = await api.listModules();
            setModules(response.data.modules);
        } catch (err) {
            console.error('Failed to load modules:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = async () => {
        if (!user?.id) return;
        try {
            const response = await api.getUserFavorites(user.id);
            setFavoriteModuleIds(new Set(response.data.map(m => m.id)));
        } catch (err) {
            console.error('Failed to load favorites:', err);
        }
    };

    const handleToggleFavorite = async (moduleId: string) => {
        if (!user?.id) return;
        const isFavorited = favoriteModuleIds.has(moduleId);

        try {
            if (isFavorited) {
                await api.removeFavorite(user.id, moduleId);
                setFavoriteModuleIds(prev => {
                    const next = new Set(prev);
                    next.delete(moduleId);
                    return next;
                });
            } else {
                await api.addFavorite(user.id, moduleId);
                setFavoriteModuleIds(prev => new Set(prev).add(moduleId));
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    const filteredModules = modules.filter(
        (module) =>
            module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-18">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold">Modules</h1>
                    {user?.role === 2 && (
                        <Button asChild>
                            <Link to="/modules/new">Add Module</Link>
                        </Button>
                    )}
                </div>
                <Input
                    type="search"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredModules.map((module) => (
                    <Card key={module.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{module.name}</CardTitle>
                            <CardDescription>
                                {module.provider} • {module.level}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-2 mb-4">
                                <p className="text-sm line-clamp-3">{module.description}</p>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                    <span>{module.location}</span>
                                    <span>•</span>
                                    <span>{module.duration} weeks</span>
                                    <span>•</span>
                                    <span>{module.language}</span>
                                    <span>•</span>
                                    <span>Period {module.period}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button asChild variant="outline" className="flex-1">
                                    <Link to={`/modules/${module.id}`}>View Details</Link>
                                </Button>
                                {user && (
                                    <Button
                                        variant={favoriteModuleIds.has(module.id) ? "default" : "ghost"}
                                        size="icon"
                                        onClick={() => handleToggleFavorite(module.id)}
                                        title={favoriteModuleIds.has(module.id) ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        {favoriteModuleIds.has(module.id) ? "♥" : "♡"}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredModules.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No modules found</p>
                </div>
            )}
        </div>
    );
}
