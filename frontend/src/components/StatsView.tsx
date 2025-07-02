// frontend/src/components/StatsView.tsx
import React, { useEffect, useState } from 'react';
import { getBookStats } from '../api/booksApi';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StatsView: React.FC = () => {
  const [stats, setStats] = useState<{ [genre: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'bar' | 'pie'>('bar');

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

  // Generate colors for pie chart
  const generateColors = (count: number) => {
    const colors = [
      'rgba(102, 126, 234, 0.8)',   // Blue
      'rgba(39, 174, 96, 0.8)',     // Green
      'rgba(155, 89, 182, 0.8)',    // Purple
      'rgba(231, 76, 60, 0.8)',     // Red
      'rgba(243, 156, 18, 0.8)',    // Orange
      'rgba(52, 152, 219, 0.8)',    // Light Blue
      'rgba(46, 204, 113, 0.8)',    // Light Green
      'rgba(142, 68, 173, 0.8)',    // Dark Purple
      'rgba(230, 126, 34, 0.8)',    // Dark Orange
      'rgba(26, 188, 156, 0.8)',    // Teal
    ];
    
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  const labels = Object.keys(stats);
  const data = Object.values(stats);
  const colors = generateColors(labels.length);

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Number of Books',
        data,
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const pieChartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const barChartOptions = {
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

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Books Distribution by Genre',
        color: '#667eea',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} books (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="stats-header">
        <h2>Book Statistics</h2>
        <div className="chart-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'bar' ? 'active' : ''}`}
            onClick={() => setViewMode('bar')}
            title="Bar Chart View"
          >
            📊 Bar Chart
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'pie' ? 'active' : ''}`}
            onClick={() => setViewMode('pie')}
            title="Pie Chart View"
          >
            🥧 Pie Chart
          </button>
        </div>
      </div>
      
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        height: '400px',
        padding: '1rem'
      }}>
        {viewMode === 'bar' ? (
          <Bar data={barChartData} options={barChartOptions} />
        ) : (
          <Pie data={pieChartData} options={pieChartOptions} />
        )}
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
            Biggest Selection
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