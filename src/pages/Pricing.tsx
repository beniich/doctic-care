import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
    {
        name: "Silver",
        priceMonthly: "23",
        priceAnnual: "19",
        description: "Idéal pour démarrer votre pratique numérique",
        features: [
            "Jusqu'à 100 patients",
            "Agenda basique",
            "Dossiers médicaux",
            "Support email",
            "1 utilisateur",
        ],
        cta: "Commencer",
        href: "/signup",
        popular: false,
    },
    {
        name: "Master",
        priceMonthly: "79",
        priceAnnual: "67",
        description: "Pour les cabinets en croissance avec IA intégrée",
        features: [
            "Patients illimités",
            "Agenda intelligent IA",
            "Transcription vocale",
            "Aide au diagnostic IA",
            "3 utilisateurs",
            "Support prioritaire",
            "Télétransmission",
        ],
        cta: "Essai gratuit 14 jours",
        href: "/signup?plan=master",
        popular: true,
    },
    {
        name: "Gold",
        priceMonthly: "120",
        priceAnnual: "100",
        description: "Solution complète pour les établissements",
        features: [
            "Tout Master inclus",
            "Utilisateurs illimités",
            "API personnalisée",
            "Formation dédiée",
            "Support VIP 24/7",
            "Intégrations sur mesure",
            "Audit de sécurité",
        ],
        cta: "Contacter les ventes",
        href: "/contact",
        popular: false,
    },
];

const testimonials = [
    {
        quote: "Doctic has transformed how we manage patient flow. Scheduling and billing are seamless now.",
        author: "Dr. Sarah M., Family Practice",
    },
    {
        quote: "HIPAA compliance was a breeze, and the telemedicine integration is outstanding.",
        author: "Dr. James L., Internal Medicine",
    },
    {
        quote: "Best value for a growing clinic. Support team is responsive and helpful.",
        author: "Dr. Priya K., Multi-specialty Clinic",
    },
];

const faqs = [
    {
        question: "Is Doctic HIPAA compliant?",
        answer: "Yes. We are fully HIPAA compliant and sign Business Associate Agreements with all customers.",
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes, you can cancel your subscription at any time. No long-term contracts.",
    },
    {
        question: "Do you offer support?",
        answer: "Professional and Enterprise plans include priority email & chat support. Free plan has community support.",
    },
    {
        question: "Can I try before I buy?",
        answer: "Yes! Professional plan includes a 14-day free trial (no credit card required).",
    },
];

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (searchParams.get("success")) {
            toast({
                title: "Payment Successful! 🎉",
                description: "Your subscription is now active. Welcome to Doctic Pro!",
            });
        } else if (searchParams.get("canceled")) {
            toast({
                title: "Payment Canceled",
                description: "Your payment was canceled. No charges were made.",
                variant: "default",
            });
        }
    }, [searchParams, toast]);

    const handleCheckout = async (planName: string) => {
        if (planName === "Free") {
            window.location.href = "/signup";
            return;
        }

        if (planName === "Enterprise") {
            window.location.href = "/contact";
            return;
        }

        if (!user?.email) {
            // Prompt login or use a default email for demo
            window.location.href = "/login?redirect=/pricing";
            return;
        }

        setLoadingPlan(planName);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan: planName.toLowerCase(),
                    billingPeriod: isAnnual ? "annual" : "monthly",
                    email: user.email,
                    userId: user.id || "demo-user",
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || "Failed to create checkout session");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast({
                title: "Checkout Error",
                description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <>
            <Helmet>
                <title>Pricing - Doctic Medical OS</title>
                <meta
                    name="description"
                    content="Flexible pricing plans for every medical practice size. Start free or upgrade for advanced features."
                />
            </Helmet>

            <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
                        >
                            Simple, transparent pricing
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
                        >
                            Choose the plan that works best for your practice. All plans include our core medical OS features.
                        </motion.p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-full border border-border">
                            <Label htmlFor="billing-toggle" className="text-sm font-medium cursor-pointer">
                                Monthly
                            </Label>
                            <Switch
                                id="billing-toggle"
                                checked={isAnnual}
                                onCheckedChange={setIsAnnual}
                            />
                            <Label htmlFor="billing-toggle" className="text-sm font-medium cursor-pointer">
                                Annual <span className="text-primary text-xs ml-1">(Save 15%)</span>
                            </Label>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card
                                    className={`relative h-full flex flex-col ${plan.popular
                                        ? "border-primary shadow-2xl scale-105 md:scale-110 z-10"
                                        : "border-border"
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                            Most Popular
                                        </div>
                                    )}

                                    <CardHeader>
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        <CardDescription className="text-lg mt-2">
                                            {plan.priceMonthly === "Custom" ? (
                                                "Contact us"
                                            ) : (
                                                <>
                                                    <span className="text-4xl font-bold text-foreground">
                                                        ${isAnnual ? plan.priceAnnual : plan.priceMonthly}
                                                    </span>
                                                    <span className="text-muted-foreground"> /month</span>
                                                    {isAnnual && plan.priceAnnual !== "0" && (
                                                        <span className="block text-xs text-muted-foreground mt-1">
                                                            Billed ${parseFloat(plan.priceAnnual) * 12}/year
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </CardDescription>
                                        <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                                    </CardHeader>

                                    <CardContent className="flex-1">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-3">
                                                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter>
                                        <Button
                                            onClick={() => handleCheckout(plan.name)}
                                            disabled={loadingPlan === plan.name}
                                            variant={plan.popular ? "default" : "outline"}
                                            size="lg"
                                            className="w-full rounded-full"
                                        >
                                            {loadingPlan === plan.name ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                plan.cta
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground">
                            Need a custom plan?{" "}
                            <Link to="/contact" className="text-primary hover:underline">
                                Contact our sales team
                            </Link>
                        </p>
                    </div>

                    {/* Testimonials */}
                    <div className="mt-20 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card p-6 rounded-xl border border-border"
                                >
                                    <p className="italic mb-4 text-muted-foreground">"{t.quote}"</p>
                                    <p className="font-medium text-right text-sm">- {t.author}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-20 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {faqs.map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-6 rounded-xl border border-border"
                                >
                                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pricing;
