import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Key, ShieldCheck, HeartPulse, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PatientLoginPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Code
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulation API call
            await fetch(`${import.meta.env.VITE_API_URL || ''}/api/patient/auth/request-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setStep(2);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/patient/auth/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('patient_token', data.token);
                localStorage.setItem('patient_data', JSON.stringify(data.patient));
                navigate('/patient/dashboard');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <HeartPulse className="absolute -top-24 -left-24 w-96 h-96 text-primary rotate-12" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <Card className="glass-card border-primary/20 shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                            <ShieldCheck className="w-8 h-8 text-primary shadow-glow" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">Portail Patient</CardTitle>
                        <CardDescription>
                            Espace sécurisé Doctic Medical OS
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.form 
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleRequestCode} 
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-white/60">Votre adresse email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                placeholder="patient@email.com" 
                                                className="pl-10 bg-white/5 border-white/10 text-white" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold shadow-glow-primary group">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Recevoir mon code <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.form 
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleVerifyCode} 
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="code" className="text-white/60">Code de vérification (6 chiffres)</Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                            <Input 
                                                id="code" 
                                                placeholder="123456" 
                                                maxLength={6}
                                                className="pl-10 bg-white/5 border-white/10 text-white tracking-[0.5em] text-center text-xl font-bold" 
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <p className="text-[10px] text-white/40 text-center">Un code a été envoyé à {email}</p>
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold shadow-glow-primary">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
                                    </Button>
                                    <Button variant="ghost" className="w-full text-white/40 hover:text-white" onClick={() => setStep(1)}>
                                        Changer d'email
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">
                                Certifié RGPD · Donnés de Santé Sécurisées
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
