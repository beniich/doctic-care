import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/showcase/Navbar";
import Hero from "@/components/showcase/Hero";
import Features from "@/components/showcase/Features";
import Pricing from "@/components/showcase/Pricing";
import Footer from "@/components/showcase/Footer";

const Landing = () => {
    const { t } = useTranslation();
    return (
        <>
            <Helmet>
                <title>{t('app.title')} - {t('app.description')} | Gestion de Cabinet</title>
                <meta
                    name="description"
                    content={t('hero.subtitle')}
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
