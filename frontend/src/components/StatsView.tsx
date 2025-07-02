// frontend/src/components/StatsView.tsx
import React, { useEffect, useState } from 'react';
import { getBookStats } from '../api/booksApi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatsView: React.FC = () => {
  const [stats, setStats] = useState<{ [genre: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getBookStats();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch book stats.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="container">
      <div className="loading">Loading stats...</div>
    </div>
  );
  
  if (error) return (
    <div className="container">
      <div className="error">Error: {error}</div>
    </div>
  );
  
  if (Object.keys(stats).length === 0) return (
    <div className="container">
      <h2>Book Statistics</h2>
      <p>No stats available. Add some books!</p>
    </div>
  );

  const chartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Number of Books',
        data: Object.values(stats),
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
              title: {
          display: true,
          text: 'Number of Books per Genre',
          color: '#667eea',
          font: {
            size: 18,
            weight: 'bold' as const,
          },
        },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="container">
      <h2>Book Statistics</h2>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        height: '400px',
        padding: '1rem'
      }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <div style={{
          background: 'rgba(102, 126, 234, 0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid rgba(102, 126, 234, 0.2)'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
            Total Genres
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {Object.keys(stats).length}
          </p>
        </div>
        
        <div style={{
          background: 'rgba(39, 174, 96, 0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid rgba(39, 174, 96, 0.2)'
        }}>
          <h3 style={{ color: '#27ae60', marginBottom: '0.5rem' }}>
            Total Books
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {Object.values(stats).reduce((sum, count) => sum + count, 0)}
          </p>
        </div>
        
        <div style={{
          background: 'rgba(155, 89, 182, 0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid rgba(155, 89, 182, 0.2)'
        }}>
          <h3 style={{ color: '#9b59b6', marginBottom: '0.5rem' }}>
            Most Popular
          </h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
            {Object.keys(stats).reduce((a, b) => stats[a] > stats[b] ? a : b, '')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsView;