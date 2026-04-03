import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

const getPlans = (t: TFunction) => [
    {
        name: "Silver",
        price: "23",
        icon: Star,
        description: t("pricing.ideal_for"),
        features: [
            t("pricing.features.patients_100"),
            t("pricing.features.basic_agenda"),
            t("pricing.features.medical_records"),
            t("pricing.features.email_support"),
            t("pricing.features.user_1"),
        ],
        highlighted: false,
        buttonText: t("pricing.start_btn"),
        buttonVariant: "outline" as const,
    },
    {
        name: "Master",
        price: "79",
        icon: Sparkles,
        description: t("pricing.growth_ai"),
        features: [
            t("pricing.features.patients_unlimited"),
            t("pricing.features.ai_agenda"),
            t("pricing.features.voice_transcription"),
            t("pricing.features.ai_diagnosis"),
            t("pricing.features.users_3"),
            t("pricing.features.priority_support"),
            t("pricing.features.teletransmission"),
        ],
        highlighted: true,
        buttonText: t("pricing.trial_btn"),
        buttonVariant: "default" as const,
    },
    {
        name: "Gold",
        price: "120",
        icon: Crown,
        description: t("pricing.complete_solution"),
        features: [
            t("pricing.features.all_master"),
            t("pricing.features.users_unlimited"),
            t("pricing.features.custom_api"),
            t("pricing.features.training"),
            t("pricing.features.support_vip"),
            t("pricing.features.custom_integrations"),
            t("pricing.features.security_audit"),
        ],
        highlighted: false,
        buttonText: t("pricing.contact_btn"),
        buttonVariant: "outline" as const,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
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
            ease: [0.4, 0, 0.2, 1] as const,
        },
    },
};

const Pricing = () => {
    const { t } = useTranslation();
    const plans = getPlans(t);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="pricing" className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl -translate-y-1/2" />

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
                        {t("pricing.badge")}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        {t("pricing.title")}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t("pricing.subtitle")}
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
                                    <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-xl">
                                        {t("pricing.popular")}
                                    </span>
                                </div>
                            )}

                            <div
                                className={`h-full p-8 rounded-2xl border transition-all duration-300 ${plan.highlighted
                                    ? "border-primary/50 bg-card shadow-xl"
                                    : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/30"
                                    }`}
                            >
                                {/* Plan header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-xl ${plan.highlighted ? "bg-primary/20" : "bg-primary/10"}`}>
                                        <plan.icon className={`w-6 h-6 text-primary`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <span className="text-4xl md:text-5xl font-bold text-foreground">
                                        {plan.price}€
                                    </span>
                                    <span className="text-muted-foreground">{t("pricing.month")}</span>
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
                                                <Check className="w-3.5 h-3.5 text-secondary" />
                                            </div>
                                            <span className="text-sm text-foreground/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Button
                                    asChild
                                    variant={plan.buttonVariant}
                                    className={`w-full rounded-full py-6 font-semibold transition-all duration-300 hover:scale-[1.02] ${plan.highlighted
                                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl"
                                        : "hover:bg-primary hover:text-primary-foreground"
                                        }`}
                                >
                                    <Link to="/pricing">
                                        {plan.buttonText}
                                    </Link>
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
                    {t("pricing.disclaimer")}{" "}
                    <a href="#" className="text-primary hover:underline">
                        {t("pricing.terms")}
                    </a>
                </motion.p>
            </div>
        </section>
    );
};

export default Pricing;
