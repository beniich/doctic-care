import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
      </svg>
    ),
    title: 'Agenda Intelligent',
    desc: 'Calendrier optimisé par IA qui réduit les temps morts et maximise vos consultations.',
    color: '#10b981',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2m-4-2h4a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" />
      </svg>
    ),
    title: 'Dossiers Médicaux',
    desc: 'Accédez instantanément aux historiques, ordonnances et résultats de vos patients.',
    color: '#3b82f6',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3M9 3h6v4H9zM9 12h6M9 16h4" />
      </svg>
    ),
    title: 'Facturation Automatisée',
    desc: 'Générez factures et tiers-payant automatiquement avec télétransmission intégrée.',
    color: '#d4a843',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Assistant IA',
    desc: 'Aide au diagnostic, transcription vocale et génération automatique de comptes-rendus.',
    color: '#a855f7',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Sécurité Maximale',
    desc: 'Chiffrement bout-en-bout, conformité RGPD & HIPAA. Vos données restent vôtres.',
    color: '#ef4444',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
      </svg>
    ),
    title: 'Téléconsultation',
    desc: 'Consultations vidéo HD intégrées, partage de documents et ordonnances numériques.',
    color: '#06b6d4',
  },
];

export function WealthForClients() {
  return (
    <section id="fonctionnalites" style={{ padding: "8rem 2rem", maxWidth: "80rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: "0.75rem",
            color: "#FFA586",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 600,
          }}
        >
          Fonctionnalités
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
            color: "#f0f4f8",
            lineHeight: 1.1,
            margin: "1rem 0",
          }}
        >
          Tout ce dont vous avez besoin, <br />
          <span style={{ fontStyle: "italic", color: "#FFA586" }}>au même endroit.</span>
        </motion.h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2rem",
      }}>
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              padding: "2.5rem",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.3s, background 0.3s",
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              const glow = e.currentTarget.querySelector('.feature-glow') as HTMLElement;
              if (glow) glow.style.opacity = "1";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
              const glow = e.currentTarget.querySelector('.feature-glow') as HTMLElement;
              if (glow) glow.style.opacity = "0";
            }}
          >
            {/* Hover Glow */}
            <div
              className="feature-glow"
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "150px",
                height: "150px",
                background: `radial-gradient(circle, ${feature.color}40 0%, transparent 70%)`,
                opacity: 0,
                transition: "opacity 0.3s",
                pointerEvents: "none",
              }}
            />

            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${feature.color}15`,
              color: feature.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}>
              {feature.icon}
            </div>

            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#f0f4f8",
              marginBottom: "1rem",
              fontFamily: "Sora, sans-serif"
            }}>
              {feature.title}
            </h3>

            <p style={{
              color: "#8b9ab0",
              lineHeight: 1.6,
              fontSize: "1rem",
              margin: 0,
            }}>
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
