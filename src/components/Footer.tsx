import { Stethoscope, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

const currentYear = new Date().getFullYear();

const getFooterLinks = (t: TFunction) => ({
    product: [
        { name: t("footer.features"), href: "#features" },
        { name: t("footer.pricing"), href: "/pricing" },
        { name: t("footer.testimonials"), href: "#" },
        { name: t("footer.roadmap"), href: "#" },
    ],
    company: [
        { name: t("footer.about"), href: "#" },
        { name: t("footer.careers"), href: "#" },
        { name: t("footer.blog"), href: "#" },
        { name: t("footer.contact"), href: "#" },
    ],
    legal: [
        { name: t("footer.privacy"), href: "/privacy" },
        { name: t("footer.terms"), href: "/terms" },
        { name: t("footer.mentions"), href: "#" },
        { name: t("footer.security"), href: "#" },
    ],
});

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "#", label: "Email" },
];

const Footer = () => {
    const { t } = useTranslation();
    const footerLinks = getFooterLinks(t);

    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link
                            to="/"
                            className="flex items-center gap-2 mb-4 group"
                        >
                            <div className="flex items-center justify-center w-10 h-10 group-hover:scale-105 transition-transform">
                                <img src="/logo.png" alt={t("app.title")} className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t("app.title")}</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                            {t("footer.description")}
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
                                    <social.icon className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">{t("footer.product")}</h4>
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
                        <h4 className="font-semibold text-foreground mb-4">{t("footer.company")}</h4>
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
                        <h4 className="font-semibold text-foreground mb-4">{t("footer.legal")}</h4>
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
                        © {currentYear} {t("app.title")}. {t("footer.rights")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                        {t("footer.made_with")}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
