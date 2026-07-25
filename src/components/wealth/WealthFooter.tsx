import { Link } from "react-router-dom";

export function WealthFooter() {
  const links = [
    { label: "Fonctionnalités", to: "/fonctionnalites" },
    { label: "Pour les praticiens", to: "/praticiens" },
    { label: "Notre mission", to: "/mission" },
    { label: "Contact", to: "/contact" },
  ];

  const legalLinks = [
    { label: "Mentions légales", to: "/terms" },
    { label: "Politique de confidentialité", to: "/privacy" },
    { label: "CGU", to: "/terms" },
  ];

  return (
    <footer style={{
      backgroundColor: "#12051f",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "4rem 2rem 2rem",
      color: "#cda7f1",
    }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "4rem" }}>
        
        {/* Left */}
        <div>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "1.5rem" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #FFA586, #B51A2B)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 600, color: "#f0f4f8" }}>
              Doctic
            </span>
          </Link>
          <p style={{ maxWidth: "20rem", lineHeight: 1.6, fontSize: "0.9375rem" }}>
            L'Operating System médical de demain. Une plateforme sécurisée, complète et intuitive pour les professionnels de santé.
          </p>
        </div>

        {/* Right - Links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ color: "#f0f4f8", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Plateforme</h4>
            {links.map(link => (
              <Link key={link.label} to={link.to} style={{
                color: "#cda7f1", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s"
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0f4f8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#cda7f1")}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ color: "#f0f4f8", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Légal</h4>
            {legalLinks.map(link => (
              <Link key={link.label} to={link.to} style={{
                color: "#cda7f1", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s"
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0f4f8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#cda7f1")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ 
        maxWidth: "80rem", margin: "0 auto", 
        borderTop: "1px solid rgba(255,255,255,0.05)", 
        paddingTop: "2rem", 
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "1rem"
      }}>
        <p style={{ margin: 0, fontSize: "0.875rem" }}>
          &copy; {new Date().getFullYear()} Doctic Medical OS. Tous droits réservés.
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {/* LinkedIn Icon */}
          <a href="#" style={{ color: "#cda7f1", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#f0f4f8")} onMouseLeave={e => (e.currentTarget.style.color = "#cda7f1")}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          {/* X/Twitter Icon */}
          <a href="#" style={{ color: "#cda7f1", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#f0f4f8")} onMouseLeave={e => (e.currentTarget.style.color = "#cda7f1")}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
