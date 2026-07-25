import { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { initCounterUp, cleanupJQueryEvents } from '@/lib/jquery.helpers';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function WealthStatsChart() {
  useEffect(() => {
    initCounterUp();
    return () => cleanupJQueryEvents();
  }, []);

  // Palette Indigo Bloom pour les graphiques
  const indigoBloom = {
    p500: '#8324db',
    p400: '#9b50e2',
    p300: '#b47bea',
    p200: '#cda7f1',
    p700: '#4e1584',
    p900: '#1a072c',
    coral: '#FFA586',
  };

  // 1. Line Chart Data (Évolution Consultations & Praticiens)
  const lineData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Consultations (en milliers)',
        data: [120, 145, 160, 185, 210, 240, 230, 255, 280, 310, 340, 390],
        borderColor: indigoBloom.p400,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(155, 80, 226, 0.4)');
          gradient.addColorStop(1, 'rgba(18, 5, 31, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: indigoBloom.coral,
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };

  // 2. Bar Chart Data (Gain de Temps par Mois - Heures Économisées)
  const barData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    datasets: [
      {
        label: 'Heures administratives économisées / semaine',
        data: [2.5, 3.2, 2.8, 3.5, 4.0, 1.8],
        backgroundColor: [
          indigoBloom.p700,
          indigoBloom.p600 || '#681daf',
          indigoBloom.p500,
          indigoBloom.p400,
          indigoBloom.coral,
          indigoBloom.p300,
        ],
        borderRadius: 8,
      },
    ],
  };

  // 3. Doughnut Data (Répartition des Spécialités)
  const doughnutData = {
    labels: ['Médecine Générale', 'Pédiatrie', 'Cardiologie', 'Dermatologie', 'Téléconsultation'],
    datasets: [
      {
        data: [40, 20, 15, 15, 10],
        backgroundColor: [
          indigoBloom.p500,
          indigoBloom.p400,
          indigoBloom.p300,
          indigoBloom.coral,
          indigoBloom.p200,
        ],
        borderColor: '#12051f',
        borderWidth: 2,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cda7f1',
          font: { family: 'Sora, sans-serif', size: 12 },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#cda7f1' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#cda7f1' },
      },
    },
  };

  return (
    <section style={{ padding: '6rem 2rem', maxWidth: '80rem', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ fontSize: '0.75rem', color: indigoBloom.coral, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
          Performance & Analytics
        </span>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', color: '#f0f4f8', marginTop: '0.5rem' }}>
          La donnée au cœur de <span style={{ fontStyle: 'italic', color: indigoBloom.p300 }}>votre pratique</span>
        </h2>
      </div>

      {/* Counter Cards jQuery integration */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {[
          { label: 'Consultations gérées', count: 2400000, suffix: '+', color: indigoBloom.p300 },
          { label: 'Heures économisées / an', count: 480, suffix: 'h', color: indigoBloom.coral },
          { label: 'Praticiens satisfaits', count: 12500, suffix: '', color: indigoBloom.p400 },
          { label: 'Taux de réponse SLA', count: 99.9, suffix: '%', color: '#10b981' },
        ].map((item, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div
              className="counter-value"
              data-count={item.count}
              data-suffix={item.suffix}
              style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: item.color }}
            >
              0
            </div>
            <div style={{ fontSize: '0.875rem', color: '#cda7f1', marginTop: '0.5rem' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Line Chart */}
        <div className="glass-card" style={{ padding: '2rem', height: '380px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#f0f4f8', marginBottom: '1rem', fontWeight: 600 }}>
            Croissance des Consultations
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={lineData} options={commonOptions as any} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card" style={{ padding: '2rem', height: '380px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#f0f4f8', marginBottom: '1rem', fontWeight: 600 }}>
            Gain de Temps Hebdomadaire
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={barData} options={commonOptions as any} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="glass-card" style={{ padding: '2rem', height: '380px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#f0f4f8', marginBottom: '1rem', fontWeight: 600 }}>
            Répartition par Spécialité
          </h3>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#cda7f1', font: { family: 'Sora, sans-serif' } },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
