import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ConsultationsChartProps {
  dataPoints?: number[];
}

export function ConsultationsChart({ dataPoints }: ConsultationsChartProps) {
  const defaultData = [45, 52, 58, 65, 72, 68, 85, 92, 88, 95, 102, 110];

  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Consultations 2024',
        data: dataPoints || defaultData,
        borderColor: '#9b50e2',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, 'rgba(155, 80, 226, 0.35)');
          gradient.addColorStop(1, 'rgba(18, 5, 31, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FFA586',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a072c',
        titleColor: '#f0f4f8',
        bodyColor: '#b47bea',
        borderColor: 'rgba(155, 80, 226, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8b9ab0' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8b9ab0' } },
    },
  };

  return <Line data={data} options={options as any} />;
}
