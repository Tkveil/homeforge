import { useState } from 'react';

const INITIAL_TASKS = [
  { id: 1, title: 'Request HOA docs — 142 Maple St', due: '2026-10-14', priority: 'urgent', type: 'doc', transaction: '142 Maple St', assignee: 'Jordan Lee', completed: false },
  { id: 2, title: 'Send disclosures — Johnson file', due: '2026-10-14', priority: 'urgent', type: 'doc', transaction: '89 Oak Ave', assignee: 'Jordan Lee', completed: false },
  { id: 3, title: 'Follow up: lender approval — Martinez', due: '2026-10-15', priority: 'high', type: 'call', transaction: '310 Cedar Ln', assignee: 'Chris Vega', completed: false },
  { id: 4, title: 'Schedule inspection — 89 Oak Ave', due: '2026-10-15', priority: 'high', type: 'schedule', transaction: '89 Oak Ave', assignee: 'Jordan Lee', completed: false },
  { id: 5, title: 'Review counter offer — Williams', due: '2026-10-16', priority: 'medium', type: 'review', transaction: '55 Birch Ct', assignee: 'Sarah Mills', completed: false },
  { id: 6, title: 'Upload executed contract — Chen file', due: '2026-10-17', priority: 'medium', type: 'doc', transaction: '89 Oak Ave', assignee: 'Jordan Lee', completed: false },
  { id: 7, title: 'Commission disbursement — 3 closes', due: '2026-10-18', priority: 'low', type: 'form', transaction: 'Multiple', assignee: 'Tommy Kunkel', completed: false },
];

export default function TasksView({ user }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', due: '', priority: 'medium', type: 'doc' });
  const [filter, setFilter] = useState('active');

  const toggleComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (!newTask.title) return;
    setTasks(prev => [...prev, {
      id: Date.now(), ...newTask,
      transaction: 'General', assignee: user.name, completed: false,
    }]);
    setNewTask({ title: '', due: '', priority: 'medium', type: 'doc' });
    setShowAdd(false);
  };

  const filtered = tasks.filter(t =>
    filter === 'active' ? !t.completed :
    filter === 'completed' ? t.completed : true
  );

  const grouped = {
    urgent: filtered.filter(t => t.priority === 'urgent'),
    high: filtered.filter(t => t.priority === 'high'),
    medium: filtered.filter(t => t.priority === 'medium'),
    low: filtered.filter(t => t.priority === 'low'),
  };

  const PRIORITY_CONFIG = {
    urgent: { color: '#e53e3e', label: 'Urgent' },
    high: { color: '#c9a84c', label: 'High' },
    medium: { color: '#4a90d9', label: 'Medium' },
    low: { color: '#4a4845', label: 'Low' },
  };

  const TYPE_ICONS = { doc: '⬚', call: '◎', schedule: '◷', review: '◈', form: '▦' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
            Tasks
          </h1>
          {tasks.filter(t => !t.completed).length > 0 && (
            <span style={{
              background: '#e53e3e', color: 'white',
              borderRadius: '50%', width: '26px', height: '26px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '700',
              boxShadow: '0 0 14px rgba(229,62,62,0.5)',
              animation: 'pulse-red 2s ease-in-out infinite',
            }}>
              {tasks.filter(t => !t.completed).length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            padding: '10px 20px',
            background: showAdd ? '#1a1a1a' : 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
            border: showAdd ? '1px solid #242424' : 'none',
            borderRadius: '8px',
            color: showAdd ? '#f0ede8' : '#080808',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          {showAdd ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {/* Add task form */}
      {showAdd && (
        <div style={{
          background: '#0f0f0f', border: '1px solid #242424',
          borderRadius: '12px', padding: '24px', marginBottom: '20px',
        }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#f0ede8', marginBottom: '16px' }}>New Task</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Task</label>
              <input
                value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                placeholder="Describe the task..."
                style={{
                  width: '100%', padding: '10px 14px',
                  background: '#141414', border: '1px solid #242424',
                  borderRadius: '8px', color: '#f0ede8', fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Due</label>
              <input
                type="date"
                value={newTask.due}
                onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))}
                style={{
                  padding: '10px 14px',
                  background: '#141414', border: '1px solid #242424',
                  borderRadius: '8px', color: '#f0ede8', fontSize: '14px',
                  colorScheme: 'dark',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Priority</label>
              <select
                value={newTask.priority}
                onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
                style={{
                  padding: '10px 14px',
                  background: '#141414', border: '1px solid #242424',
                  borderRadius: '8px', color: '#f0ede8', fontSize: '13px',
                }}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button
              onClick={addTask}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
                border: 'none', borderRadius: '8px',
                color: '#080808', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}
            >Add</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['active', 'completed', 'all'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              background: filter === f ? '#1a1a1a' : 'none',
              border: `1px solid ${filter === f ? '#242424' : '#1a1a1a'}`,
              borderRadius: '20px',
              color: filter === f ? '#f0ede8' : '#8a8580',
              fontSize: '12px', fontFamily: 'DM Mono, monospace',
              cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'capitalize',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Grouped by priority */}
      {Object.entries(grouped).map(([priority, items]) => {
        if (!items.length) return null;
        const cfg = PRIORITY_CONFIG[priority];
        return (
          <div key={priority} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, boxShadow: `0 0 8px ${cfg.color}66` }} />
              <span style={{ fontSize: '12px', color: cfg.color, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {cfg.label}
              </span>
              <span style={{ fontSize: '11px', color: '#4a4845' }}>({items.length})</span>
            </div>

            <div style={{
              background: '#0f0f0f', border: '1px solid #1a1a1a',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              {items.map((task, i) => (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 20px',
                  borderBottom: i < items.length - 1 ? '1px solid #141414' : 'none',
                  opacity: task.completed ? 0.5 : 1,
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <button
                    onClick={() => toggleComplete(task.id)}
                    style={{
                      width: '20px', height: '20px', flexShrink: 0,
                      border: `1.5px solid ${task.completed ? '#38a169' : cfg.color}`,
                      borderRadius: '4px',
                      background: task.completed ? '#38a16933' : 'transparent',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: '#38a169',
                    }}
                  >
                    {task.completed ? '✓' : ''}
                  </button>

                  <span style={{ fontSize: '16px', opacity: 0.6 }}>{TYPE_ICONS[task.type] || '○'}</span>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px', color: '#f0ede8',
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}>{task.title}</div>
                    <div style={{ fontSize: '12px', color: '#4a4845', marginTop: '2px' }}>
                      {task.transaction} · {task.assignee}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: '#8a8580' }}>
                    {task.due ? new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
