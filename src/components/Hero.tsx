import { ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden radial-gradient">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 border border-primary/20"
                >
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm font-medium text-primary-foreground/80">
                        v2.0 Maintenant Disponible
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
                >
                    Doctic Pro
                    <br />
                    <span className="text-muted-foreground/80">L'OS Médical du Futur</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                >
                    Gérez patients, rendez-vous, dossiers médicaux, factures et bien plus
                    avec une plateforme intelligente conçue pour les professionnels de santé.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <Button
                        asChild
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-glow-accent transition-all duration-300 hover:scale-105 group"
                    >
                        <Link to="/landing">
                            Commencer gratuitement
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-8 py-6 text-lg font-semibold border-primary/30 hover:bg-primary/10 backdrop-blur-sm transition-all duration-300"
                    >
                        Voir la démo
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
                >
                    {[
                        { icon: Shield, value: "99.9%", label: "Sécurité RGPD" },
                        { icon: Zap, value: "< 1s", label: "Temps de réponse" },
                        { icon: Sparkles, value: "5000+", label: "Médecins actifs" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                            className="glass-card p-4 flex items-center gap-3"
                        >
                            <div className="p-2 rounded-lg bg-primary/10">
                                <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full"
                >
                    <path
                        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        className="fill-background"
                    />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
