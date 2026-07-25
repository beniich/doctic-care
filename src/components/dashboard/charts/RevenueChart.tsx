import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function RevenueChart() {
  const data = {
    labels: ['T1', 'T2', 'T3', 'T4'],
    datasets: [
      {
        label: 'Consultations Présentielles (€)',
        data: [18500, 22400, 21000, 26800],
        backgroundColor: '#681daf',
        borderRadius: 6,
      },
      {
        label: 'Téléconsultations (€)',
        data: [6200, 8400, 9100, 11500],
        backgroundColor: '#FFA586',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#cda7f1', font: { family: 'Sora, sans-serif', size: 11 } },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#cda7f1' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#cda7f1' } },
    },
  };

  return <Bar data={data} options={options as any} />;
}
