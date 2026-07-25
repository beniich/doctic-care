import { useState } from "react";
import { motion } from "framer-motion";

type FormStatus = "idle" | "loading" | "success" | "error";

export function WealthContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // Honeypot
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/wealth/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setFeedback(data.message || "Merci ! Votre message a été envoyé avec succès.");
        setFormData({ name: "", email: "", phone: "", message: "", website: "" });
      } else {
        setStatus("error");
        setFeedback(data.error || "Une erreur s'est produite lors de l'envoi.");
      }
    } catch {
      setStatus("error");
      setFeedback("Erreur de connexion. Veuillez réessayer plus tard.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "0.875rem 1rem",
    color: "#f0f4f8",
    transition: "border-color 0.2s, background-color 0.2s",
    boxSizing: "border-box" as const,
  };

  return (
    <section style={{ padding: "6rem 2rem", position: "relative", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: "48rem", margin: "0 auto", width: "100%" }}>
        
        <div style={{ textAlign: "center", marginBottom: "4rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{
            color: "#FFA586",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}>
            Contact
          </span>
          <h2 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            lineHeight: 1.15,
            marginBottom: "1.5rem",
            fontWeight: 400,
            color: "#f0f4f8",
          }}>
            Parlez-nous de votre{" "}
            <span style={{ fontStyle: "italic", color: "#FFA586" }}>cabinet</span>.
          </h2>
          <div style={{ width: "3rem", height: "2px", backgroundColor: "#B51A2B", marginBottom: "1.5rem" }} />
          <p style={{ color: "#8b9ab0", fontSize: "1.125rem", maxWidth: "32rem" }}>
            Que vous souhaitiez une démonstration ou que vous ayez une question spécifique, notre équipe vous répond en 24h.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "3rem",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Honeypot */}
            <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
              <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#f0f4f8" }}>
                  Nom complet <span style={{ color: "#FFA586" }}>*</span>
                </label>
                <input
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "#FFA586"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#f0f4f8" }}>
                  Email professionnel <span style={{ color: "#FFA586" }}>*</span>
                </label>
                <input
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "#FFA586"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#f0f4f8" }}>
                Téléphone <span style={{ fontWeight: 400, color: "#8b9ab0" }}>(optionnel)</span>
              </label>
              <input
                type="tel" name="phone"
                value={formData.phone} onChange={handleChange}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "#FFA586"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#f0f4f8" }}>
                Votre message <span style={{ color: "#FFA586" }}>*</span>
              </label>
              <textarea
                name="message" required rows={5}
                value={formData.message} onChange={handleChange}
                style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#FFA586"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
              />
              <div style={{ textAlign: "right", fontSize: "0.75rem", color: "#8b9ab0", fontVariantNumeric: "tabular-nums" }}>
                {formData.message.length} / 5000
              </div>
            </div>

            <div style={{
              background: "rgba(255,165,134,0.05)",
              border: "1px solid rgba(255,165,134,0.15)",
              borderRadius: "8px",
              padding: "1rem",
              fontSize: "0.8rem",
              color: "#8b9ab0",
              lineHeight: 1.6,
            }}>
              Vos données sont traitées de manière sécurisée et confidentielle. Nous ne les partageons jamais avec des tiers sans votre accord.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  backgroundColor: "#FFA586",
                  color: "#12051f",
                  padding: "14px 32px",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  border: "none",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  opacity: status === "loading" ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </div>

            {feedback && (
              <div style={{
                padding: "1rem",
                borderRadius: "8px",
                fontSize: "0.875rem",
                textAlign: "center",
                border: `1px solid ${status === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                backgroundColor: status === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                color: status === "success" ? "#10b981" : "#ef4444",
              }}>
                {feedback}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
