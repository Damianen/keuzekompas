import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Module } from '@/types';

export function ModuleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [module, setModule] = useState<Module | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        if (id) {
            loadModule(id);
            if (user?.id) {
                checkFavoriteStatus();
            }
        }
    }, [id, user?.id]);

    const loadModule = async (moduleId: string) => {
        try {
            const response = await api.getModule(moduleId);
            setModule(response.data);
        } catch (err) {
            console.error('Failed to load module:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkFavoriteStatus = async () => {
        if (!user?.id || !id) return;
        try {
            const response = await api.getUserFavorites(user.id);
            setIsFavorited(response.data.some(m => m.id === id));
        } catch (err) {
            console.error('Failed to check favorite status:', err);
        }
    };

    const handleDelete = async () => {
        if (!id || !confirm('Are you sure you want to delete this module?')) return;

        try {
            await api.deleteModule(id);
            navigate('/modules');
        } catch (err) {
            console.error('Failed to delete module:', err);
        }
    };

    const handleToggleFavorite = async () => {
        if (!user?.id || !id) return;
        try {
            if (isFavorited) {
                await api.removeFavorite(user.id, id);
                setIsFavorited(false);
            } else {
                await api.addFavorite(user.id, id);
                setIsFavorited(true);
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (!module) {
        return <div className="container mx-auto px-4 py-8">Module not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-10">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" asChild className="mb-4">
                    <Link to="/modules">← Back to Modules</Link>
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-3xl">{module.name}</CardTitle>
                                <CardDescription className="text-lg mt-2">
                                    {module.provider} • {module.level}
                                </CardDescription>
                            </div>
                            {user && (
                                <Button
                                    variant={isFavorited ? "default" : "outline"}
                                    onClick={handleToggleFavorite}
                                >
                                    {isFavorited ? "♥ Favorited" : "♡ Add to Favorites"}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Location</p>
                                <p className="text-base">{module.location}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Duration</p>
                                <p className="text-base">{module.duration} weeks</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Language</p>
                                <p className="text-base">{module.language}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Period</p>
                                <p className="text-base">Period {module.period}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-700">{module.description}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{module.information}</p>
                        </div>

                        {user?.role === 2 && (
                            <div className="flex gap-2 pt-4 border-t">
                                <Button asChild variant="outline">
                                    <Link to={`/modules/${module.id}/edit`}>Edit Module</Link>
                                </Button>
                                <Button variant="destructive" onClick={handleDelete}>
                                    Delete Module
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
