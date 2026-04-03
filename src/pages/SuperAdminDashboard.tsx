import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Users, CreditCard, Activity, Plus, Search, MoreVertical, ShieldAlert } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    plan: string;
    subscriptionStatus: string;
    stripeSubscriptionId?: string;
    active: boolean;
    _count?: {
        users: number;
        patients: number;
    };
    createdAt: string;
}

const SuperAdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const res = await api.get<{ data: Tenant[] }>('/tenants');
                setTenants(res.data);
            } catch (error) {
                console.error("Erreur chargement tenants", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === 'SUPER_ADMIN') {
            fetchTenants();
        }
    }, [user]);

    if (user?.role !== 'SUPER_ADMIN') {
        return <Navigate to="/dashboard" />;
    }

    const filteredTenants = tenants.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Sidebar (simplified for SuperAdmin) */}
            <div className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-md p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-3 mb-12">
                    <ShieldAlert className="w-8 h-8 text-rose-500" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-orange-500 bg-clip-text text-transparent">Doctic Control</h1>
                </div>
                <nav className="space-y-4">
                    <Button variant="secondary" className="w-full justify-start text-left bg-white/5 border-white/10 text-white hover:bg-white/10">
                        <Building2 className="w-5 h-5 mr-3" />
                        Cliniques (Tenants)
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left text-white/50 hover:text-white">
                        <CreditCard className="w-5 h-5 mr-3" />
                        Abonnements & MRR
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left text-white/50 hover:text-white">
                        <Activity className="w-5 h-5 mr-3" />
                        Logs d'Audit
                    </Button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-rose-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-light text-white tracking-tight">Vue Globale <span className="font-bold">Réseau</span></h2>
                        <p className="text-white/50 mt-1">Gérez les locataires (Tenants), abonnements et facturations globales.</p>
                    </div>
                    <Button onClick={() => navigate('/onboarding')} className="bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white shadow-lg shadow-rose-500/20 rounded-xl px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau Tenant
                    </Button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white/50 flex items-center justify-between">
                                MRR Estimé
                                <CreditCard className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {tenants.reduce((acc, t) => {
                                    if (t.subscriptionStatus !== 'active') return acc;
                                    const prices: Record<string, number> = { 'STARTER': 19, 'PRO': 67, 'BUSINESS': 100 };
                                    return acc + (prices[t.plan] || 0);
                                }, 0)} €
                            </div>
                            <p className="text-xs text-emerald-400 mt-1">Revenus récurrents réels</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white/50 flex items-center justify-between">
                                Tenants Actifs
                                <Building2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{tenants.length}</div>
                            <p className="text-xs text-white/40 mt-1">Cliniques enregistrées</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white/50 flex items-center justify-between">
                                Utilisateurs Totaux
                                <Users className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {tenants.reduce((acc, t) => acc + (t._count?.users || 0), 0)}
                            </div>
                            <p className="text-xs text-emerald-400 mt-1">+45 nouveaux praticiens</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white/50 flex items-center justify-between">
                                Patients Couverts
                                <Activity className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {(tenants.reduce((acc, t) => acc + (t._count?.patients || 0), 0)).toLocaleString()}
                            </div>
                            <p className="text-xs text-white/40 mt-1">Dossiers sur le réseau</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Table */}
                <Card className="bg-black/40 border border-white/10 backdrop-blur-xl">
                    <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-5">
                        <CardTitle className="text-lg text-white font-medium">Cliniques Connectées</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input 
                                placeholder="Rechercher une clinique..." 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-64 bg-white/5 border-white/10 text-white pl-9 rounded-xl focus:border-rose-500"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-10 text-center text-white/50">Chargement de l'infrastructure...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-white/50 font-medium">Clinique / Tenant</TableHead>
                                        <TableHead className="text-white/50 font-medium">Statut</TableHead>
                                        <TableHead className="text-white/50 font-medium">Plan</TableHead>
                                        <TableHead className="text-white/50 font-medium text-right">Membres</TableHead>
                                        <TableHead className="text-white/50 font-medium text-right">Patients</TableHead>
                                        <TableHead className="text-white/50 font-medium text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTenants.length === 0 ? (
                                        <TableRow className="border-none">
                                            <TableCell colSpan={6} className="text-center py-10 text-white/40">Aucun tenant trouvé.</TableCell>
                                        </TableRow>
                                    ) : filteredTenants.map((tenant) => (
                                        <TableRow key={tenant.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell>
                                                <div className="font-medium text-white">{tenant.name}</div>
                                                <div className="text-xs text-white/40 font-mono mt-1">{tenant.slug}.doctic.com</div>
                                            </TableCell>
                                            <TableCell>
                                                {tenant.active ? (
                                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Actif</Badge>
                                                ) : (
                                                    <Badge className="bg-rose-500/10 text-rose-400 border-none">Suspendu</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="outline" className={`border-white/10 bg-white/5 ${
                                                        tenant.plan === 'ENTERPRISE' ? 'text-amber-400' :
                                                        tenant.plan === 'PRO' ? 'text-blue-400' : 'text-white/70'
                                                    }`}>
                                                        {tenant.plan}
                                                    </Badge>
                                                    <div className="text-[10px] text-white/30 uppercase tracking-wider pl-1">
                                                        {tenant.subscriptionStatus}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-white/70">{tenant._count?.users || 0}</TableCell>
                                            <TableCell className="text-right text-white/70">{tenant._count?.patients || 0}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/10">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
