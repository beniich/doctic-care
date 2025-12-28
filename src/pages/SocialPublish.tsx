import { useState } from 'react';
import { Share2, Video, Upload, Film, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useModal } from '@/contexts/ModalContext';
import { cn } from '@/lib/utils';
import { OutlookLayout } from '@/components/layout/OutlookLayout';

// ============================================================================
// MODULE PUBLICATION RÉSEAUX SOCIAUX
// ============================================================================
export default function SocialPublish() {
    const { openModal } = useModal();
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

    const platforms = [
        { id: 'youtube', name: 'YouTube', color: 'bg-red-600', icon: Film },
        { id: 'tiktok', name: 'TikTok', color: 'bg-black', icon: Video },
        { id: 'instagram', name: 'Instagram Reels', color: 'bg-gradient-to-r from-pink-500 to-orange-500', icon: Film },
        { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', icon: Share2 },
        { id: 'x', name: 'X (Twitter)', color: 'bg-black', icon: FileText },
        { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', icon: Share2 },
        { id: 'pinterest', name: 'Pinterest', color: 'bg-red-700', icon: Share2 },
        { id: 'threads', name: 'Threads', color: 'bg-gray-700', icon: FileText }
    ];

    const togglePlatform = (id: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handlePublish = () => {
        if (selectedPlatforms.length === 0) {
            alert('Sélectionnez au moins une plateforme');
            return;
        }
        console.log('Publication simulée sur:', selectedPlatforms);
        console.log('Vidéo:', selectedVideo?.name);
        console.log('Titre:', title);
        console.log('Description:', description);

        // Simuler le succès avec une modal ou un toast (ici alert pour faire simple comme demandé, ou modal)
        openModal(
            <div className="p-8 text-center space-y-4">
                <div className="h-20 w-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <Share2 className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold">Publication Réussie !</h2>
                <p className="text-muted-foreground">Votre vidéo a été publiée avec succès sur {selectedPlatforms.length} plateforme(s).</p>
            </div>
        );
    };

    return (
        <OutlookLayout
            singlePane={
                <div className="p-8 space-y-8 gradient-bg min-h-full">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-bold flex items-center gap-4">
                            <Share2 className="h-12 w-12 text-primary animate-pulse" />
                            <span className="text-gradient">Publier sur les Réseaux</span>
                        </h1>
                    </div>

                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                                <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">1</span>
                                Sélectionnez votre vidéo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-600/50 hover:border-primary/50 transition-colors rounded-xl p-12 text-center bg-gray-900/20">
                                <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="video-upload"
                                />
                                <label htmlFor="video-upload" className="cursor-pointer">
                                    <Button variant="secondary" className="gap-2">
                                        <Upload className="h-4 w-4" />
                                        Choisir une vidéo
                                    </Button>
                                </label>
                                {selectedVideo && <p className="text-green-400 mt-4 font-medium animate-in fade-in">Vidéo sélectionnée : {selectedVideo.name}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                                <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">2</span>
                                Légende & Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Titre de la vidéo</label>
                                <Input placeholder="Titre accrocheur..." value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background/50 border-input" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Description</label>
                                <Textarea placeholder="Description, hashtags, conseils santé..." value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="bg-background/50 border-input resize-none" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                                <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">3</span>
                                Choisissez les plateformes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {platforms.map((plat) => {
                                    const Icon = plat.icon;
                                    return (
                                        <div
                                            key={plat.id}
                                            onClick={() => togglePlatform(plat.id)}
                                            className={cn(
                                                "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105",
                                                selectedPlatforms.includes(plat.id)
                                                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                                    : "border-border hover:border-primary/50 bg-card/50"
                                            )}
                                        >
                                            <div className={cn("h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg", plat.color)}>
                                                <Icon className="h-8 w-8 text-white" />
                                            </div>
                                            <p className="text-center font-bold">{plat.name}</p>
                                            {selectedPlatforms.includes(plat.id) && (
                                                <div className="absolute top-3 right-3 h-3 w-3 bg-primary rounded-full animate-pulse shadow-glow" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center pt-4">
                        <Button size="lg" onClick={handlePublish} className="px-12 py-8 text-xl font-bold gap-3 shadow-2xl hover:scale-105 transition-all btn-glow bg-primary hover:bg-primary/90">
                            <Share2 className="h-6 w-6" />
                            Publier sur {selectedPlatforms.length} plateforme{selectedPlatforms.length > 1 ? 's' : ''}
                        </Button>
                    </div>

                    <Card className="bg-primary/5 border-primary/20 mt-8">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Conseils pour un contenu médical éthique
                            </h3>
                            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
                                <li>Ne donnez jamais de conseils médicaux personnalisés</li>
                                <li>Mentionnez toujours que ce contenu est éducatif et non un diagnostic</li>
                                <li>Utilisez des sources fiables et citez-les</li>
                                <li>Respectez le secret médical</li>
                                <li>Ajoutez un disclaimer : "Consultez toujours votre médecin"</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            }
        />
    );
}
