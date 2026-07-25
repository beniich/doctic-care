import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function SpecialtyDonut() {
  const data = {
    labels: ['Suivi Régulier', 'Urgence', 'Téléconsultation', 'Bilan Annuel'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ['#8324db', '#9b50e2', '#FFA586', '#4e1584'],
        borderColor: '#12051f',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: '#8b9ab0', font: { family: 'Sora, sans-serif', size: 11 } },
      },
    },
  };

  return <Doughnut data={data} options={options as any} />;
}
