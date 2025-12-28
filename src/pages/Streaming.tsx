import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Camera, Film, Share2, Trash2, Play, Download, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OutlookLayout } from '@/components/layout/OutlookLayout';

interface VideoRecord {
    id: number;
    title: string;
    date: string;
    duration: string;
    status: 'brouillon' | 'publié';
    platforms: string[]; // ex: ['tiktok', 'instagram', 'youtube']
    thumbnail?: string; // base64 ou URL
    videoUrl?: string; // blob URL ou backend URL
    views?: number;
}

export default function Streaming() {
    const [searchTerm, setSearchTerm] = useState('');
    const [videos, setVideos] = useState<VideoRecord[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [currentRecording, setCurrentRecording] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunks = useRef<Blob[]>([]);

    const API_URL = 'http://localhost:5000/api/streaming';

    useEffect(() => {
        fetchVideos();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Erreur chargement');
            const data = await response.json();
            setVideos(data);
        } catch (err) {
            console.error('Impossible de charger les vidéos', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredVideos = videos.filter(v =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const platforms = [
        { id: 'youtube', name: 'YouTube', color: 'bg-red-600', icon: '▶' },
        { id: 'tiktok', name: 'TikTok', color: 'bg-black', icon: '🎵' },
        { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-600', icon: '📷' },
        { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', icon: 'f' },
        { id: 'x', name: 'X (Twitter)', color: 'bg-black', icon: '𝕏' },
        { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', icon: 'in' },
        { id: 'pinterest', name: 'Pinterest', color: 'bg-red-700', icon: 'P' },
        { id: 'threads', name: 'Threads', color: 'bg-gray-700', icon: '@' }
    ];

    const startRecording = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            const recorder = new MediaRecorder(mediaStream);
            mediaRecorderRef.current = recorder;
            recordedChunks.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setCurrentRecording(url);
                setIsRecording(false);

                // Sauvegarde simulation
                const newVideo: VideoRecord = {
                    id: Date.now(),
                    title: `Vidéo du ${new Date().toLocaleDateString('fr-FR')}`,
                    date: new Date().toLocaleDateString('fr-FR'),
                    duration: 'À calculer',
                    status: 'brouillon',
                    platforms: [],
                    videoUrl: url
                };
                setVideos(prev => [newVideo, ...prev]);
                setSelectedVideo(newVideo);
            };

            recorder.start();
            setIsRecording(true);
        } catch (err) {
            alert('Accès caméra/micro refusé ou indisponible');
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
    };

    const handlePublish = (video: VideoRecord) => {
        setSelectedVideo(video);
        setSelectedPlatforms([]);
        setIsPublishModalOpen(true);
    };

    const togglePlatform = (platformId: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(p => p !== platformId)
                : [...prev, platformId]
        );
    };

    const handleFinalPublish = async () => {
        if (selectedPlatforms.length === 0) {
            alert('Sélectionnez au moins une plateforme');
            return;
        }

        // Simulation publication
        try {
            setVideos(prev => prev.map(v =>
                v.id === selectedVideo?.id
                    ? { ...v, status: 'publié' as const, platforms: selectedPlatforms }
                    : v
            ));
            setIsPublishModalOpen(false);
            // Alert success
        } catch (err) {
            alert('Erreur lors de la publication');
        }
    };

    const handleDeleteVideo = (id: number) => {
        if (confirm('Supprimer cette vidéo ?')) {
            setVideos(prev => prev.filter(v => v.id !== id));
            if (selectedVideo?.id === id) setSelectedVideo(null);
        }
    };

    return (
        <OutlookLayout
            singlePane={
                <div className="min-h-screen bg-background text-foreground flex flex-col">
                    {/* Header */}
                    <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
                        <div className="flex items-center gap-6">
                            <h1 className="text-xl font-semibold flex items-center gap-2">
                                <Film className="h-6 w-6 text-purple-500" />
                                Streaming & Vidéos Éducatives
                            </h1>
                            <Button
                                onClick={startRecording}
                                disabled={isRecording}
                                className="rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 border-0 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                {isRecording ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 max-w-7xl mx-auto w-full">
                        {/* Recherche */}
                        <div className="mb-6 relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Rechercher une vidéo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-card"
                            />
                        </div>

                        {/* Enregistrement en cours */}
                        {isRecording && (
                            <Card className="mb-8 p-6 bg-destructive/10 border-destructive/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-destructive flex items-center gap-3">
                                        <Camera className="h-6 w-6 animate-pulse" />
                                        Enregistrement en cours
                                    </h3>
                                    <Button variant="destructive" onClick={stopRecording}>
                                        Arrêter
                                    </Button>
                                </div>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    className="w-full rounded-xl bg-black aspect-video"
                                />
                            </Card>
                        )}

                        {/* Aperçu vidéo enregistrée */}
                        {currentRecording && !isRecording && (
                            <Card className="mb-8 p-6 bg-card/90 backdrop-blur-md border-border">
                                <h3 className="text-xl font-semibold mb-4">Vidéo enregistrée</h3>
                                <video controls src={currentRecording} className="w-full rounded-xl bg-black aspect-video" />
                                <div className="flex justify-end gap-4 mt-4">
                                    <Button variant="outline" onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = currentRecording;
                                        a.download = `video-${Date.now()}.webm`;
                                        a.click();
                                    }}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Télécharger
                                    </Button>
                                    <Button onClick={() => selectedVideo && handlePublish(selectedVideo)}>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Publier
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Liste vidéos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-full text-center py-20">
                                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                                    <p className="mt-4 text-muted-foreground">Chargement des vidéos...</p>
                                </div>
                            ) : filteredVideos.length === 0 ? (
                                <div className="col-span-full text-center py-20 text-muted-foreground">
                                    <Film className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                    <p>Aucune vidéo enregistrée</p>
                                    <p className="text-sm mt-2">Cliquez sur "Enregistrer" pour commencer</p>
                                </div>
                            ) : (
                                filteredVideos.map((video) => (
                                    <Card
                                        key={video.id}
                                        className="overflow-hidden hover:shadow-2xl transition cursor-pointer group bg-card border-border"
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                                            {video.videoUrl ? (
                                                <video src={video.videoUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <Film className="h-16 w-16 text-muted-foreground" />
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                                                {video.duration}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold mb-2 truncate">{video.title}</h3>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                                <span>{video.date}</span>
                                                <Badge variant={video.status === 'publié' ? 'default' : 'secondary'}>
                                                    {video.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
                                                {video.platforms.map(p => {
                                                    const plat = platforms.find(pl => pl.id === p);
                                                    return plat ? (
                                                        <div
                                                            key={p}
                                                            className={`w-8 h-8 ${plat.color} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md`}
                                                            title={plat.name}
                                                        >
                                                            {plat.icon}
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                            <div className="flex justify-between gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => { e.stopPropagation(); handlePublish(video); }}
                                                    className="flex-1"
                                                >
                                                    <Share2 className="h-4 w-4 mr-1" />
                                                    Publier
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteVideo(video.id); }}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Modal Publication */}
                    {isPublishModalOpen && selectedVideo && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                            <Card className="w-full max-w-3xl bg-background border-border p-0 shadow-2xl flex flex-col max-h-[90vh]">
                                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Share2 className="h-6 w-6 text-purple-500" />
                                        Publier la vidéo
                                    </h2>
                                    <Button variant="ghost" size="icon" onClick={() => setIsPublishModalOpen(false)}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="p-6 overflow-y-auto">
                                    <p className="text-muted-foreground mb-6">
                                        Sélectionnez les plateformes sur lesquelles publier <span className="font-semibold text-foreground">"{selectedVideo.title}"</span>
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {platforms.map((plat) => (
                                            <button
                                                key={plat.id}
                                                onClick={() => togglePlatform(plat.id)}
                                                className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${plat.color} relative overflow-hidden group ${selectedPlatforms.includes(plat.id)
                                                    ? 'border-primary shadow-lg scale-105'
                                                    : 'border-transparent hover:border-border hover:scale-102 opacity-80'
                                                    }`}
                                            >
                                                {selectedPlatforms.includes(plat.id) && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                        <span className="text-primary-foreground text-xs font-bold">✓</span>
                                                    </div>
                                                )}
                                                <div className="text-4xl text-white">{plat.icon}</div>
                                                <span className="font-medium text-white text-sm text-center">{plat.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">{selectedPlatforms.length}</span> plateforme(s) sélectionnée(s)
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
                                    <Button variant="outline" onClick={() => setIsPublishModalOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button
                                        onClick={handleFinalPublish}
                                        disabled={selectedPlatforms.length === 0}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                                    >
                                        Publier maintenant
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            }
        />
    );
}
