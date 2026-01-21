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
        shortdescription: '',
        description: '',
        content: '',
        studycredit: 5,
        location: '',
        contact_id: 1,
        level: '',
        learningoutcomes: '',
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
                shortdescription: module.shortdescription,
                description: module.description,
                content: module.content,
                studycredit: module.studycredit,
                location: module.location,
                contact_id: module.contact_id,
                level: module.level,
                learningoutcomes: module.learningoutcomes,
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
                                    <Label htmlFor="level">Niveau</Label>
                                    <Input
                                        id="level"
                                        value={formData.level}
                                        onChange={(e) => updateField('level', e.target.value)}
                                        placeholder="bijv. Bachelor, Master"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Locatie</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="studycredit">Studiepunten (EC)</Label>
                                    <Input
                                        id="studycredit"
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={formData.studycredit}
                                        onChange={(e) => updateField('studycredit', parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_id">Contact ID</Label>
                                    <Input
                                        id="contact_id"
                                        type="number"
                                        min="1"
                                        value={formData.contact_id}
                                        onChange={(e) => updateField('contact_id', parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shortdescription">Korte Beschrijving</Label>
                                <textarea
                                    id="shortdescription"
                                    className="w-full min-h-20 px-3 py-2 border rounded-md"
                                    value={formData.shortdescription}
                                    onChange={(e) => updateField('shortdescription', e.target.value)}
                                    required
                                />
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
                                <Label htmlFor="content">Inhoud</Label>
                                <textarea
                                    id="content"
                                    className="w-full min-h-32 px-3 py-2 border rounded-md"
                                    value={formData.content}
                                    onChange={(e) => updateField('content', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="learningoutcomes">Leeruitkomsten</Label>
                                <textarea
                                    id="learningoutcomes"
                                    className="w-full min-h-32 px-3 py-2 border rounded-md"
                                    value={formData.learningoutcomes}
                                    onChange={(e) => updateField('learningoutcomes', e.target.value)}
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
