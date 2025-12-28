import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Shield, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
    {
        name: "Starter",
        price: "49",
        description: "Pour les cabinets individuels qui démarrent.",
        features: [
            "Gestion agenda & RDV",
            "Dossiers patients illimités",
            "Facturation basique",
            "Support email",
            "Application mobile",
        ],
        highlighted: false,
        buttonVariant: "outline" as const,
        buttonText: "Commencer l'essai",
        icon: Shield,
    },
    {
        name: "Pro",
        price: "99",
        description: "La solution complète pour les professionnels de santé.",
        features: [
            "Tout du plan Starter",
            "Téléconsultation HD",
            "Module de prescription",
            "Télétransmission SESAM-Vitale",
            "Rappels SMS illimités",
            "Support prioritaire",
        ],
        highlighted: true,
        buttonVariant: "default" as const,
        buttonText: "Choisir Pro",
        icon: Zap,
    },
    {
        name: "Clinic",
        price: "199",
        description: "Pour les centres médicaux et cliniques.",
        features: [
            "Tout du plan Pro",
            "Multi-praticiens (jusqu'à 10)",
            "Gestion des salles & équipements",
            "Statistiques avancées",
            "API & Intégrations",
            "Account Manager dédié",
        ],
        highlighted: false,
        buttonVariant: "outline" as const,
        buttonText: "Contacter les ventes",
        icon: Crown,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

const Pricing = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="pricing" className="py-24 bg-background relative">
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Tarifs simples
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Investissez dans votre <span className="text-gradient">Santé</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Des forfaits transparents adaptés à la taille de votre cabinet.
                        Aucun frais caché.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            variants={itemVariants}
                            className={`relative ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
                        >
                            {/* Popular badge */}
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                    <span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium shadow-lg shadow-accent/50">
                                        Plus populaire
                                    </span>
                                </div>
                            )}

                            <div
                                className={`h-full p-8 rounded-2xl border transition-all duration-300 ${plan.highlighted
                                        ? "border-accent/50 bg-card shadow-xl shadow-accent/10"
                                        : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/30"
                                    }`}
                            >
                                {/* Plan header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-xl ${plan.highlighted ? "bg-accent/20" : "bg-primary/10"}`}>
                                        <plan.icon className={`w-6 h-6 ${plan.highlighted ? "text-accent" : "text-primary"}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <span className="text-4xl md:text-5xl font-bold text-foreground">
                                        {plan.price}€
                                    </span>
                                    <span className="text-muted-foreground">/mois</span>
                                </div>

                                {/* Description */}
                                <p className="text-muted-foreground text-sm mb-6">
                                    {plan.description}
                                </p>

                                {/* Features list */}
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <div className="mt-0.5 p-1 rounded-full bg-secondary/20">
                                                <Check className="w-3.5 h-3.5 text-secondary-foreground" />
                                            </div>
                                            <span className="text-sm text-foreground/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Button
                                    variant={plan.buttonVariant}
                                    className={`w-full rounded-full py-6 font-semibold transition-all duration-300 hover:scale-[1.02] ${plan.highlighted
                                            ? "bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30"
                                            : "hover:bg-primary hover:text-primary-foreground"
                                        }`}
                                >
                                    {plan.buttonText}
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center text-muted-foreground text-sm mt-12"
                >
                    Tous les prix sont hors taxes. Annulation possible à tout moment.{" "}
                    <a href="#" className="text-primary hover:underline">
                        Voir les conditions générales
                    </a>
                </motion.p>
            </div>
        </section>
    );
};

export default Pricing;
