import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PILLARS = [
  {
    title: "Gain de temps",
    desc: "Automatisez vos tâches administratives et récupérez jusqu'à 2 heures par jour pour vos patients.",
  },
  {
    title: "Sécurité des données",
    desc: "Infrastructure souveraine et certifiée hébergeur de données de santé (HDS).",
  },
  {
    title: "Croissance du cabinet",
    desc: "Optimisez votre planning, réduisez les no-shows et développez votre patientèle.",
  },
];

export function WealthForCFPs() {
  return (
    <section id="praticiens" style={{ 
      padding: "8rem 2rem", 
      position: "relative",
      backgroundColor: "rgba(18, 5, 31, 0.4)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
        
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span style={{
            fontSize: "0.75rem",
            color: "#FFA586",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 600,
          }}>
            Pour les praticiens
          </span>
          <h2 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
            color: "#f0f4f8",
            lineHeight: 1.1,
            margin: "1.5rem 0",
          }}>
            Votre expertise. <br />
            <span style={{ fontStyle: "italic", color: "#FFA586" }}>Notre plateforme.</span>
          </h2>
          <p style={{ color: "#cda7f1", fontSize: "1.125rem", lineHeight: 1.7, marginBottom: "3rem" }}>
            Ensemble, révolutionnons les soins. Nous avons conçu Doctic pour répondre aux défis quotidiens des professionnels de santé modernes.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
              >
                <div style={{ 
                  width: 24, height: 24, 
                  borderRadius: "50%", 
                  background: "rgba(255,165,134,0.15)", 
                  color: "#FFA586",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 4
                }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ color: "#f0f4f8", fontWeight: 600, marginBottom: "0.25rem", fontSize: "1.1rem" }}>{pillar.title}</h4>
                  <p style={{ color: "#cda7f1", margin: 0, lineHeight: 1.6 }}>{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "3rem", flexWrap: "wrap" }}>
            <Link to="/dashboard" style={{
              padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 500,
              background: "#FFA586", color: "#12051f",
              textDecoration: "none",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Démarrer l'essai gratuit
            </Link>
            <Link to="/contact" style={{
              padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 500,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#f0f4f8", textDecoration: "none",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
            >
              Contacter l'équipe
            </Link>
          </div>
        </motion.div>

        {/* Right: Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ position: "relative" }}
        >
          {/* Medical Glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "120%", height: "120%",
            background: "radial-gradient(circle, rgba(181,26,43,0.15) 0%, transparent 60%)",
            pointerEvents: "none",
            zIndex: 0,
          }} />
          
          <div style={{
            position: "relative",
            zIndex: 1,
            aspectRatio: "4/3",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(18, 5, 31, 0.8)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
             {/* Mock UI or Medical Image representation */}
             <div style={{
                position: "absolute", inset: 0,
                background: "url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.6,
                mixBlendMode: "luminosity"
             }} />
             <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(18,5,31,0.8), rgba(18,5,31,0.4))" }} />
             
             {/* Overlay UI element */}
             <div style={{
                position: "relative", zIndex: 2,
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "16px",
                padding: "2rem",
                display: "flex", flexDirection: "column", gap: "1rem"
             }}>
                <div style={{ width: 120, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.2)" }} />
                <div style={{ width: 200, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)" }} />
                <div style={{ width: 160, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)" }} />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                   <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,165,134,0.4)" }} />
                   <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                   <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
