import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/fonctionnalites", label: "Fonctionnalités" },
  { to: "/praticiens", label: "Pour les praticiens" },
  { to: "/mission", label: "Notre mission" },
  { to: "/contact", label: "Contact" },
];

export function WealthHeader() {
  const location = useLocation();

  const getLinkStyle = (path: string) => ({
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "color 0.15s",
    color: location.pathname === path ? "#f0f4f8" : "#cda7f1",
    textDecoration: "none",
  } as React.CSSProperties);

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: "4rem",
      background: "rgba(18, 5, 31, 0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "0.5px solid rgba(255,255,255,0.07)",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo Doctic */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #FFA586, #B51A2B)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 600, color: "#f0f4f8" }}>
            Doctic
          </span>
          <span style={{
            background: "rgba(255,165,134,0.12)", color: "#FFA586",
            border: "0.5px solid rgba(255,165,134,0.25)",
            fontSize: 10, padding: "2px 7px", borderRadius: 10,
            fontWeight: 500, letterSpacing: "0.06em",
          }}>
            Medical OS
          </span>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} style={getLinkStyle(to)}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0f4f8")}
              onMouseLeave={e => (e.currentTarget.style.color = location.pathname === to ? "#f0f4f8" : "#cda7f1")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/login" style={{
            padding: "9px 18px", borderRadius: 10, fontSize: "0.875rem", fontWeight: 500,
            color: "#cda7f1",
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            textDecoration: "none",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "#f0f4f8";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = "#cda7f1";
          }}
          >
            Connexion
          </Link>
          <Link to="/signup" style={{
            padding: "9px 20px", borderRadius: 10, fontSize: "0.875rem", fontWeight: 500,
            background: "#FFA586", color: "#12051f",
            textDecoration: "none",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Essai gratuit 14j →
          </Link>
        </div>
      </div>
    </header>
  );
}
