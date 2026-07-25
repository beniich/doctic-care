import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const STATS = [
  { value: "12 000+", label: "Praticiens actifs" },
  { value: "2.4M", label: "Consultations / mois" },
  { value: "99.9%", label: "Disponibilité SLA" },
  { value: "< 2s", label: "Temps de réponse" },
];

export function WealthHero() {
  return (
    <section style={{
      minHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "5rem 2rem 4rem",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
    }}>
      {/* BG glows */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse, rgba(255,165,134,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "15%",
        width: 300, height: 300,
        background: "radial-gradient(ellipse, rgba(181,26,43,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,165,134,0.08)", border: "0.5px solid rgba(255,165,134,0.2)",
          borderRadius: 20, padding: "6px 16px", marginBottom: "2rem",
        }}
      >
        <span className="neon-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFA586", display: "block" }} />
        <span style={{ fontSize: 12, color: "#FFA586", fontWeight: 500, letterSpacing: "0.08em" }}>
          PLATEFORME MÉDICALE · CERTIFIÉE RGPD & HIPAA
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
          fontWeight: 400, lineHeight: 1.08,
          letterSpacing: "-0.02em",
          maxWidth: 820,
          marginBottom: "1.5rem",
          color: "#f0f4f8"
        }}
      >
        La médecine moderne
        <br />
        <em style={{ color: "#FFA586", fontStyle: "italic" }}>mérite un OS moderne.</em>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontSize: 18, color: "#cda7f1", lineHeight: 1.7,
          maxWidth: 580, marginBottom: "2.5rem", fontWeight: 300,
        }}
      >
        Une plateforme complète, intuitive et sécurisée pour les professionnels
        de santé qui veulent se concentrer sur ce qui compte : leurs patients.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}
      >
        <Link to="/signup" style={{
          padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 500,
          background: "#FFA586", color: "#12051f",
          textDecoration: "none",
          transition: "opacity 0.2s"
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Démarrer l'essai gratuit →
        </Link>
        <a href="#fonctionnalites" style={{
          padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 500,
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
          color: "#f0f4f8", textDecoration: "none",
          transition: "background 0.2s"
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
        >
          Voir la démo
        </a>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "3rem",
          paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.05)", width: "100%", maxWidth: 900
        }}
      >
        {STATS.map(stat => (
          <div key={stat.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: "2rem", fontWeight: 600, fontFamily: "Playfair Display, serif", color: "#f0f4f8" }}>{stat.value}</span>
            <span style={{ fontSize: 13, color: "#cda7f1", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
