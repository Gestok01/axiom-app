import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
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

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ projects: 0, tasks: 0, completedTasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks')
        ]);
        
        const tasks = tasksRes.data;
        const completed = tasks.filter(t => t.status === 'DONE').length;

        setStats({
          projects: projectsRes.data.length,
          tasks: tasks.length,
          completedTasks: completed
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['Total Projects', 'Total Tasks', 'Completed Tasks'],
    datasets: [
      {
        label: 'Axiom Analytics',
        data: [stats.projects, stats.tasks, stats.completedTasks],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#0F172A', font: { family: 'Manrope', weight: 'bold' } } },
    },
    scales: {
      y: { ticks: { color: '#64748B' }, grid: { color: '#E2E8F0' } },
      x: { ticks: { color: '#64748B' }, grid: { display: false } }
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, {user?.name}!</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here's what's happening in your workspace today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Projects</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{stats.projects}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Tasks</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--warning)' }}>{stats.tasks}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Completed Tasks</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)' }}>{stats.completedTasks}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Overview</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
