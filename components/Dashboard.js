import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import useIsMobile from '../lib/useIsMobile';
import { supabase } from '../lib/supabase';
import DashboardHome from './views/DashboardHome';
import TransactionsView from './views/TransactionsView';
import ContactsView from './views/ContactsView';
import TasksView from './views/TasksView';
import MessagesView from './views/MessagesView';
import PipelineView from './views/PipelineView';
import TeamView from './views/TeamView';
import IDXView from './views/IDXView';

export default function Dashboard({ user, onLogout }) {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar starts open on desktop, closed on mobile (drawer mode).
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Live open-task count for the red badge
  const [taskCount, setTaskCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { count } = await supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('completed', false);
      if (!cancelled) setTaskCount(count || 0);
    })();
    return () => { cancelled = true; };
  }, []);

  const views = {
    home: <DashboardHome user={user} setActiveView={setActiveView} taskCount={taskCount} isMobile={isMobile} />,
    transactions: <TransactionsView user={user} isMobile={isMobile} />,
    contacts: <ContactsView user={user} isMobile={isMobile} />,
    tasks: <TasksView user={user} isMobile={isMobile} />,
    messages: <MessagesView user={user} isMobile={isMobile} />,
    pipeline: <PipelineView user={user} isMobile={isMobile} />,
    team: <TeamView user={user} isMobile={isMobile} />,
    idx: <IDXView user={user} isMobile={isMobile} />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#080808' }}>
      <Sidebar
        user={user}
        activeView={activeView}
        setActiveView={(v) => { setActiveView(v); if (isMobile) setSidebarOpen(false); }}
        taskCount={taskCount}
        open={sidebarOpen}
        onLogout={onLogout}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Mobile backdrop for the drawer */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 900,
          }}
        />
      )}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', transition: 'margin-left 0.3s',
      }}>
        <TopBar
          user={user}
          activeView={activeView}
          taskCount={taskCount}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          setActiveView={setActiveView}
          isMobile={isMobile}
        />
        <main style={{
          flex: 1, overflow: 'auto',
          padding: isMobile ? '16px' : '28px 32px',
          background: '#080808',
        }}>
          {views[activeView] || views['home']}
        </main>
      </div>
    </div>
  );
}
