import React, { useState } from 'react';
import { Stethoscope, Mail, Lock, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/lib/constants';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [email, setEmail] = useState('medecin@doctic.com');
    const [password, setPassword] = useState('password');

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Connexion via AuthContext
        login(ROLES.DOCTOR);
        // Redirection vers dashboard
        navigate('/');
    };

    const bg = isDarkMode ? 'bg-gray-950' : 'bg-gray-50';
    const card = isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200';

    return (
        <div className={`min-h-screen ${bg} flex items-center justify-center p-4 transition-all duration-500`}>
            <Card className={`w-full max-w-md p-10 ${card} rounded-3xl shadow-2xl border`}>
                <div className="flex justify-end mb-6">
                    <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-700/30 dark:hover:bg-gray-200/30 transition">
                        {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
                    </button>
                </div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl mb-6 shadow-lg">
                        <Stethoscope className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Doctic Pro</h1>
                    <p className="text-gray-400">Connexion à votre espace médical</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <Input
                                type="email"
                                placeholder="dr.dupont@clinic.fr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-lg rounded-xl shadow-lg transition">
                        Se connecter
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400 mb-4">Ou continuer avec</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-red-500 rounded-full" /> Google
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-black rounded-full" /> GitHub
                        </Button>
                    </div>
                    <p className="mt-6 text-sm">
                        Pas de compte ?{' '}
                        <a href="/landing#pricing" className="text-blue-500 hover:underline font-medium">
                            Découvrir les abonnements
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    );
}
