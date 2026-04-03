import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    Users,
    Calendar,
    FileText,
    CreditCard,
    Brain,
    ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

const getFeatures = (t: TFunction) => [
    {
        icon: Users,
        title: t("features.patient_mgmt"),
        description: t("features.patient_mgmt_desc"),
    },
    {
        icon: Calendar,
        title: t("features.smart_agenda"),
        description: t("features.smart_agenda_desc"),
    },
    {
        icon: FileText,
        title: t("features.medical_records"),
        description: t("features.medical_records_desc"),
    },
    {
        icon: CreditCard,
        title: t("features.billing"),
        description: t("features.billing_desc"),
    },
    {
        icon: Brain,
        title: t("features.ai_assistant"),
        description: t("features.ai_assistant_desc"),
    },
    {
        icon: ShieldCheck,
        title: t("features.security"),
        description: t("features.security_desc"),
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function Features() {
    const { t } = useTranslation();
    const features = getFeatures(t);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="features"
            className="relative py-28 bg-background overflow-hidden"
        >
            {/* Fond décoratif subtil avec glassmorphism */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* En-tête de section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-5">
                        {t("features.badge")}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-5">
                        {t("features.title")}
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        {t("features.subtitle")}
                    </p>
                </motion.div>

                {/* Grille des fonctionnalités */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            className="group"
                        >
                            <div
                                className={cn(
                                    "relative h-full p-7 rounded-3xl border transition-all duration-300",
                                    "bg-card/60 backdrop-blur-lg border-border",
                                    "hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1"
                                )}
                            >
                                {/* Icône avec gradient */}
                                <div
                                    className={cn(
                                        "w-14 h-14 flex items-center justify-center rounded-2xl mb-5",
                                        "gradient-bg shadow-lg group-hover:scale-110 transition-transform duration-300"
                                    )}
                                >
                                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                                </div>

                                {/* Contenu */}
                                <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-base">
                                    {feature.description}
                                </p>

                                {/* Ligne décorative au hover */}
                                <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
