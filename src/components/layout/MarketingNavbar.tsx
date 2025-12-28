import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MarketingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Fonctionnalités", href: "#features" },
        { name: "Tarifs", href: "/pricing" },
        { name: "Blog", href: "#blog" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-blue-500/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                            <span className="relative text-white font-bold text-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.28 3.6-2.34 3.6-4.44C22.6 7.33 21.05 5.5 19.33 5.5c-1.38 0-2.63.83-3.33 2.05C15.3 6.33 14.05 5.5 12.67 5.5c-1.72 0-3.33 1.83-3.33 4.06 0 2.1 2.11 3.16 3.6 4.44 1.49 1.28 2.6 1.95 2.6 1.95s1.11-.67 2.6-1.95z"></path></svg>
                            </span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">Doctic Pro</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-base font-medium text-white/90 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login">
                            <Button className="rounded-full bg-white text-blue-600 hover:bg-white/90 font-bold px-6 shadow-lg">
                                Inscription
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-blue-600 border-b border-white/10"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="block text-base font-medium text-white hover:text-white/80"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-3">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full justify-center rounded-full bg-white text-blue-600 font-bold">
                                        Inscription
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
