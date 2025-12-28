import { motion } from "framer-motion";
import { Stethoscope, Twitter, Linkedin, Github, Mail } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: "Fonctionnalités", href: "#features" },
            { name: "Tarifs", href: "#pricing" },
            { name: "Intégrations", href: "#" },
            { name: "Mises à jour", href: "#" },
        ],
        company: [
            { name: "À propos", href: "#" },
            { name: "Blog", href: "#" },
            { name: "Carrières", href: "#" },
            { name: "Presse", href: "#" },
        ],
        legal: [
            { name: "Confidentialité", href: "#" },
            { name: "CGU", href: "#" },
            { name: "RGPD", href: "#" },
            { name: "Sécurité", href: "#" },
        ],
    };

    const socialLinks = [
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Github, href: "#", label: "GitHub" },
        { icon: Mail, href: "#", label: "Email" },
    ];

    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <motion.a
                            href="#"
                            className="flex items-center gap-2 mb-4"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="p-2 rounded-xl gradient-bg">
                                <Stethoscope className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold gradient-text">Doctic Pro</span>
                        </motion.a>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                            La plateforme médicale nouvelle génération qui révolutionne
                            la gestion de votre cabinet. Propulsée par l'IA.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="p-2.5 rounded-full bg-muted hover:bg-primary/10 transition-colors"
                                >
                                    <social.icon className="w-4 h-4 text-muted-foreground" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Produit</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Entreprise</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Légal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {currentYear} Doctic Pro. Tous droits réservés.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Fait avec 💙 pour les professionnels de santé
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
