import { motion } from "framer-motion";

export function WealthAboutUs() {
  return (
    <section id="mission" style={{ padding: "8rem 2rem", maxWidth: "80rem", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
        
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative" }}
        >
          <div style={{
            position: "relative",
            aspectRatio: "4/5",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          }}>
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
              alt="Médecin en consultation"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(18,5,31,0.9), transparent)",
            }} />
            
            <div style={{ position: "absolute", bottom: "3rem", left: "2.5rem", right: "2.5rem" }}>
              <p style={{
                fontFamily: "Playfair Display, serif",
                color: "#f0f4f8",
                fontStyle: "italic",
                fontSize: "2rem",
                lineHeight: 1.2,
                margin: 0,
              }}>
                « Libérer les soignants,
              </p>
              <p style={{ color: "#FFA586", marginTop: "0.5rem", marginLeft: "2rem", fontSize: "1.125rem", fontWeight: 500 }}>
                pour qu'ils se consacrent à l'essentiel. »
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <span style={{
              fontSize: "0.75rem",
              color: "#FFA586",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 600,
            }}>
              Notre Mission
            </span>
            <h2 style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              color: "#f0f4f8",
              lineHeight: 1.1,
              margin: 0,
            }}>
              Technologie au service du soin,{" "}
              <span style={{ fontStyle: "italic", color: "#FFA586" }}>pas l'inverse.</span>
            </h2>
            <div style={{ width: "3rem", height: "2px", backgroundColor: "#B51A2B", marginTop: "1rem" }} />
          </div>

          <div style={{ color: "#8b9ab0", fontSize: "1.125rem", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <p>
              Nous avons fondé Doctic avec une conviction simple : le temps d'un praticien est trop précieux pour être perdu en tâches administratives répétitives et sur des logiciels obsolètes.
            </p>
            <p>
              Notre équipe d'ingénieurs, épaulée par un comité médical, développe l'Operating System médical de demain. Une plateforme où l'intelligence artificielle, l'automatisation et un design centré sur l'utilisateur se rencontrent pour redéfinir l'expérience du soin.
            </p>
            
            <div style={{ 
              marginTop: "1rem", 
              padding: "2rem", 
              background: "rgba(255,255,255,0.03)", 
              borderLeft: "3px solid #FFA586",
              borderRadius: "0 12px 12px 0"
            }}>
              <h4 style={{ color: "#f0f4f8", fontSize: "1.1rem", fontWeight: 600, margin: "0 0 1rem 0" }}>Nos engagements</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.8rem", color: "#8b9ab0" }}>
                <li>Sécurité absolue et souveraineté des données (HDS)</li>
                <li>Design intuitif nécessitant zéro formation</li>
                <li>Innovation continue guidée par vos retours</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
