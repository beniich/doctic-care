import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Shield, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setLoading(planId);
    // Simulation redirection Stripe Checkout
    setTimeout(() => {
      setLoading(null);
      navigate("/dashboard");
    }, 2000);
  };

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "49€",
      period: "/mois",
      description: "Pour les praticiens indépendants débutants.",
      features: ["Gestion des patients", "Agenda basique", "Facturation simplifiée", "Support par email"],
      icon: <Shield className="w-6 h-6 text-indigo-bloom-400" />,
      cta: "Commencer l'essai",
      highlight: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "99€",
      period: "/mois",
      description: "La solution complète pour développer votre cabinet.",
      features: ["Tout du Starter", "Téléconsultation illimitée", "Rappels SMS automatiques", "Statistiques avancées", "Support prioritaire 24/7"],
      icon: <Zap className="w-6 h-6 text-white" />,
      cta: "Essai gratuit 14 jours",
      highlight: true
    },
    {
      id: "clinic",
      name: "Clinique",
      price: "Sur devis",
      period: "",
      description: "Pour les centres médicaux multi-praticiens.",
      features: ["Tout du Pro", "Comptes multiples (jusqu'à 50)", "Gestion des secrétariats", "API & Intégrations sur mesure", "Account Manager dédié"],
      icon: <Sparkles className="w-6 h-6 text-indigo-bloom-400" />,
      cta: "Contacter les ventes",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-indigo-bloom-950 py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-sm font-semibold tracking-wide text-indigo-bloom-400 uppercase">Tarification</h2>
        <p className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">
          Choisissez le plan adapté à votre pratique
        </p>
        <p className="mt-4 max-w-2xl text-xl text-indigo-bloom-200 mx-auto">
          Tous nos plans incluent 14 jours d'essai gratuit. Annulable à tout moment.
        </p>
      </div>

      <div className="mt-16 max-w-7xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-3xl p-8 flex flex-col ${
              plan.highlight 
                ? "bg-gradient-to-b from-indigo-bloom-600 to-indigo-bloom-900 border-2 border-indigo-bloom-400 shadow-glow-indigo transform scale-105 z-10" 
                : "bg-indigo-bloom-900 border border-indigo-bloom-700/50"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-2xl font-bold ${plan.highlight ? "text-white" : "text-indigo-bloom-100"}`}>
                {plan.name}
              </h3>
              {plan.icon}
            </div>
            
            <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
              {plan.price}
              <span className="ml-1 text-xl font-medium text-indigo-bloom-200">{plan.period}</span>
            </div>
            
            <p className={`mt-4 text-sm ${plan.highlight ? "text-indigo-bloom-100" : "text-indigo-bloom-200"}`}>
              {plan.description}
            </p>

            <ul className="mt-8 space-y-4 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className={`h-5 w-5 ${plan.highlight ? "text-white" : "text-indigo-bloom-400"}`} />
                  </div>
                  <p className={`ml-3 text-sm ${plan.highlight ? "text-white" : "text-indigo-bloom-100"}`}>
                    {feature}
                  </p>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading !== null}
              className={`mt-8 w-full py-4 text-sm font-bold rounded-xl transition-all ${
                plan.highlight
                  ? "bg-white text-indigo-bloom-900 hover:bg-indigo-bloom-50"
                  : "bg-indigo-bloom-500 text-white hover:bg-indigo-bloom-600"
              }`}
            >
              {loading === plan.id ? "Redirection..." : plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
