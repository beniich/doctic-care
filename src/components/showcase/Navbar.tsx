import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    const navLinks = [
        { name: "Fonctionnalités", href: "#features" },
        { name: "Tarifs", href: "#pricing" },
        { name: "Blog", href: "#" },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "glass-card border-b py-3"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 group"
                >
                    <div className="p-2 rounded-xl gradient-bg">
                        <Stethoscope className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-foreground">Doctic Pro</span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDark(!isDark)}
                        className="rounded-full"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                    <Link to="/login">
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6">
                            Inscription
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden glass-card mt-2 mx-4 rounded-2xl p-6"
                >
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-foreground py-2 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDark(!isDark)}
                                className="rounded-full"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </Button>
                            <Link to="/login" className="flex-1">
                                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                                    Inscription
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
