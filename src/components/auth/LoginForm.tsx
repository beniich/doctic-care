import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/contexts/ModalContext';
import { ROLES } from '@/lib/constants';
import { LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginForm = () => {
    const { login } = useAuth();
    const { closeModal } = useModal(); // Pour fermer le modal après connexion
    const navigate = useNavigate();
    const [email, setEmail] = useState('medecin@doctic.com');
    const [password, setPassword] = useState('password');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulation d'api call
        setTimeout(() => {
            login(ROLES.DOCTOR);
            setIsLoading(false);
            closeModal(); // Fermer le modal
            navigate('/'); // Aller au dashboard
        }, 800);
    };

    return (
        <div className="w-full max-w-sm mx-auto p-4">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
                    <User className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
                <p className="text-muted-foreground">Accédez à votre espace Doctic Pro</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votrenom@doctic.com"
                        required
                        className="bg-background/50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mot de passe</label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-background/50"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <LogIn className="w-4 h-4 mr-2" />
                            Se connecter
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                    Compte de démonstration : <br />
                    <span className="font-mono text-xs">medecin@doctic.com / password</span>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
