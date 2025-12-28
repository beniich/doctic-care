import { Helmet } from "react-helmet-async";
import Navbar from "@/components/showcase/Navbar";
import Hero from "@/components/showcase/Hero";
import Features from "@/components/showcase/Features";
import Pricing from "@/components/showcase/Pricing";
import Footer from "@/components/showcase/Footer";

const Landing = () => {
    return (
        <>
            <Helmet>
                <title>Doctic Pro - L'OS Médical du Futur | Gestion de Cabinet</title>
                <meta
                    name="description"
                    content="Doctic Pro est la plateforme médicale nouvelle génération. Gérez patients, rendez-vous, dossiers médicaux et facturation avec l'intelligence artificielle."
                />
                <meta
                    name="keywords"
                    content="logiciel médical, gestion cabinet, dossier patient, rendez-vous médecin, facturation médicale, IA santé"
                />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Navbar />
                <main>
                    <Hero />
                    <Features />
                    <Pricing />
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Landing;
