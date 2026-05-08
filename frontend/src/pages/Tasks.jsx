import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { Plus } from 'lucide-react';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', priority: 'MEDIUM' });

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      if (projectsRes.data.length > 0) {
        setNewTask(prev => ({ ...prev, projectId: projectsRes.data[0].id }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setNewTask({ title: '', description: '', projectId: projects[0]?.id || '', priority: 'MEDIUM' });
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  const canCreate = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  // Group tasks by status for a Kanban-like view
  const columns = [
    { id: 'TODO', title: 'To Do', color: 'var(--text-secondary)' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'var(--warning)' },
    { id: 'DONE', title: 'Done', color: 'var(--success)' },
  ];

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Tasks Board</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage progress.</p>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Task
          </button>
        )}
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0, overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map(col => (
          <div key={col.id} className="glass-panel" style={{ flex: '1', minWidth: '320px', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC', borderTop: `4px solid ${col.color}` }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: col.color }}></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.02em' }}>{col.title}</h3>
              <span style={{ marginLeft: 'auto', backgroundColor: '#E2E8F0', padding: '0.125rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="glass-panel" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'}}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{task.project?.name}</div>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>{task.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <select 
                      value={task.status} 
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      style={{ backgroundColor: '#F1F5F9', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '0.375rem', padding: '0.4rem 0.5rem', fontSize: '0.8rem', fontFamily: 'Manrope', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input type="text" className="input-field" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="input-field" rows="3" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <select className="input-field" style={{ backgroundColor: 'var(--surface-color-solid)' }} value={newTask.projectId} onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })} required>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={projects.length === 0}>Create Task</button>
              </div>
              {projects.length === 0 && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '1rem' }}>You need to create a project first.</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
