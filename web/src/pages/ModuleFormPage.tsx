import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreateModuleDto } from '@/types';

export function ModuleFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState<CreateModuleDto>({
        name: '',
        location: '',
        period: 1,
        provider: '',
        duration: 1,
        language: '',
        level: '',
        description: '',
        information: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadModule(id);
        }
    }, [id]);

    const loadModule = async (moduleId: string) => {
        try {
            const response = await api.getModule(moduleId);
            const module = response.data;
            setFormData({
                name: module.name,
                location: module.location,
                period: module.period,
                provider: module.provider,
                duration: module.duration,
                language: module.language,
                level: module.level,
                description: module.description,
                information: module.information,
            });
        } catch (err) {
            console.error('Failed to load module:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isEditing && id) {
                await api.updateModule(id, formData);
            } else {
                await api.createModule(formData);
            }
            navigate('/modules');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: keyof CreateModuleDto, value: string | number) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-10">
            <div className="max-w-2xl mx-auto">
                <Button variant="ghost" asChild className="mb-4">
                    <Link to="/modules">← Terug naar Modules</Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Bewerk Module' : 'Nieuwe Module Aanmaken'}</CardTitle>
                        <CardDescription>
                            {isEditing ? 'Werk module informatie bij' : 'Voeg een nieuwe module toe aan de catalogus'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Modulenaam</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="provider">Aanbieder</Label>
                                    <Input
                                        id="provider"
                                        value={formData.provider}
                                        onChange={(e) => updateField('provider', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Niveau</Label>
                                    <Input
                                        id="level"
                                        value={formData.level}
                                        onChange={(e) => updateField('level', e.target.value)}
                                        placeholder="bijv. Bachelor, Master"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Locatie</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Taal</Label>
                                    <Input
                                        id="language"
                                        value={formData.language}
                                        onChange={(e) => updateField('language', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="period">Periode</Label>
                                    <Input
                                        id="period"
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={formData.period}
                                        onChange={(e) => updateField('period', parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duur (weken)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        min="1"
                                        value={formData.duration}
                                        onChange={(e) => updateField('duration', parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Beschrijving</Label>
                                <textarea
                                    id="description"
                                    className="w-full min-h-24 px-3 py-2 border rounded-md"
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="information">Aanvullende Informatie</Label>
                                <textarea
                                    id="information"
                                    className="w-full min-h-32 px-3 py-2 border rounded-md"
                                    value={formData.information}
                                    onChange={(e) => updateField('information', e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <div className="flex gap-2">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Opslaan...' : isEditing ? 'Bijwerken' : 'Aanmaken'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link to="/modules">Annuleren</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
