import { WealthScrollToTop } from "@/components/wealth/WealthScrollToTop";
import { WealthHeader } from "@/components/wealth/WealthHeader";
import { WealthContactForm } from "@/components/wealth/WealthContactForm";
import { WealthFooter } from "@/components/wealth/WealthFooter";

export default function WealthContactPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#12051f", color: "#f0f4f8", fontFamily: "Sora, sans-serif" }}>
      <WealthScrollToTop />
      <WealthHeader />
      <main style={{ flexGrow: 1, paddingTop: "8rem" }}>
        <WealthContactForm />
      </main>
      <WealthFooter />
    </div>
  );
}
