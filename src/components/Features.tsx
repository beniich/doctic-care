import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    Calendar,
    Users,
    FileText,
    CreditCard,
    Brain,
    Shield
} from "lucide-react";

const features = [
    {
        icon: Calendar,
        title: "Gestion Intelligente des RDV",
        description: "Planification automatisée, rappels SMS/Email et synchronisation multi-calendriers.",
    },
    {
        icon: Users,
        title: "Dossiers Patients Complets",
        description: "Accédez à l'historique complet, aux antécédents et aux notes de consultation en un clic.",
    },
    {
        icon: FileText,
        title: "Ordonnances Digitales",
        description: "Créez, signez et envoyez des ordonnances et résultats d'examens de vos patients.",
    },
    {
        icon: CreditCard,
        title: "Facturation Automatisée",
        description: "Générez factures et tiers-payant automatiquement avec notre système de télétransmission.",
    },
    {
        icon: Brain,
        title: "Assistant IA",
        description: "Bénéficiez d'une aide au diagnostic, transcription vocale et génération de comptes-rendus.",
    },
    {
        icon: Shield,
        title: "Sécurité Maximale",
        description: "Vos données sont protégées avec un chiffrement de bout en bout et conformité RGPD.",
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

const Features = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="features" className="py-24 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />

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
                        Fonctionnalités
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Fonctionnalités{" "}
                        <span className="text-gradient">Puissantes</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Tout ce dont vous avez besoin pour gérer votre cabinet médical
                        avec efficacité et sérénité.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="group"
                        >
                            <div className="h-full p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-lg hover:border-primary/30 transition-all duration-300">
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-foreground mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover line */}
                                <div className="mt-5 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
