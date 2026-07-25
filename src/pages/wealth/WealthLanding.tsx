import { WealthScrollToTop } from "@/components/wealth/WealthScrollToTop";
import { WealthHeader } from "@/components/wealth/WealthHeader";
import { WealthHero } from "@/components/wealth/WealthHero";
import { WealthStatsChart } from "@/components/wealth/WealthStatsChart";
import { WealthForClients } from "@/components/wealth/WealthForClients";
import { WealthForCFPs } from "@/components/wealth/WealthForCFPs";
import { WealthFooter } from "@/components/wealth/WealthFooter";

export default function WealthLanding() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#12051f", color: "#f0f4f8", fontFamily: "Sora, sans-serif" }}>
      <WealthScrollToTop />
      <WealthHeader />
      <main style={{ flexGrow: 1, paddingTop: "6rem" }}>
        <WealthHero />
        <WealthStatsChart />
        <WealthForClients />
        <WealthForCFPs />
      </main>
      <WealthFooter />
    </div>
  );
}
