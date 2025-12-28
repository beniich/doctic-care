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

const features = [
  {
    icon: Users,
    title: "Gestion des Patients",
    description:
      "Centralisez toutes les informations patients avec un dossier médical électronique complet et sécurisé.",
  },
  {
    icon: Calendar,
    title: "Agenda Intelligent",
    description:
      "Planifiez vos rendez-vous avec un calendrier optimisé par l'IA qui réduit les temps morts.",
  },
  {
    icon: FileText,
    title: "Dossiers Médicaux",
    description:
      "Accédez instantanément aux historiques, ordonnances et résultats d'examens de vos patients.",
  },
  {
    icon: CreditCard,
    title: "Facturation Automatisée",
    description:
      "Générez factures et tiers-payant automatiquement avec notre système de télétransmission.",
  },
  {
    icon: Brain,
    title: "Assistant IA",
    description:
      "Bénéficiez d'une aide au diagnostic, transcription vocale et génération de comptes-rendus.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité Maximale",
    description:
      "Vos données sont protégées avec un chiffrement de bout en bout et conformité RGPD / HIPAA.",
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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Features() {
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
            Fonctionnalités puissantes
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-5">
            Tout ce dont vous avez besoin pour{" "}
            <span className="gradient-text">
              gérer votre clinique
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Une plateforme complète, intuitive et sécurisée pour les professionnels de santé modernes.
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
