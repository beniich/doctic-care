import { WealthScrollToTop } from "@/components/wealth/WealthScrollToTop";
import { WealthHeader } from "@/components/wealth/WealthHeader";
import { WealthAboutUs } from "@/components/wealth/WealthAboutUs";
import { WealthFooter } from "@/components/wealth/WealthFooter";

export default function WealthAboutPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#12051f", color: "#f0f4f8", fontFamily: "Sora, sans-serif" }}>
      <WealthScrollToTop />
      <WealthHeader />
      <main style={{ flexGrow: 1, paddingTop: "6rem" }}>
        <WealthAboutUs />
      </main>
      <WealthFooter />
    </div>
  );
}
