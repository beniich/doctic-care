import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Hero = () => {
    const { t } = useTranslation();
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 hero-gradient animate-gradient" />

            {/* Floating Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
                    animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/20 blur-3xl"
                    animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-32 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
                >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary-foreground/90">
                        {t('hero.badge')}
                    </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
                >
                    {t('hero.title_line1')}
                    <br />
                    <span className="text-primary-foreground/80">{t('hero.title_line2')}</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10"
                >
                >
                    {t('hero.subtitle')}
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
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 group"
                    >
                        <Link to="/pricing">
                            {t('hero.cta_start')}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        className="rounded-full px-8 py-6 text-lg font-semibold bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30 backdrop-blur-sm transition-all duration-300"
                    >
                        {t('hero.cta_demo')}
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
                        { icon: Shield, value: "99.9%", label: t('hero.stat_security') },
                        { icon: Zap, value: "< 1s", label: t('hero.stat_response') },
                        { icon: Sparkles, value: "5000+", label: t('hero.stat_doctors') },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                            className="glass-card p-4 flex items-center gap-3"
                        >
                            <div className="p-2 rounded-lg bg-primary-foreground/10">
                                <stat.icon className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div className="text-left">
                                <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                                <div className="text-sm text-primary-foreground/60">{stat.label}</div>
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
