import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import DashboardHome from './views/DashboardHome';
import TransactionsView from './views/TransactionsView';
import ContactsView from './views/ContactsView';
import TasksView from './views/TasksView';
import MessagesView from './views/MessagesView';
import PipelineView from './views/PipelineView';
import TeamView from './views/TeamView';
import IDXView from './views/IDXView';

export default function Dashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock task count for the red badge — in production comes from Supabase
  const taskCount = 7;

  const views = {
    home: <DashboardHome user={user} setActiveView={setActiveView} taskCount={taskCount} />,
    transactions: <TransactionsView user={user} />,
    contacts: <ContactsView user={user} />,
    tasks: <TasksView user={user} />,
    messages: <MessagesView user={user} />,
    pipeline: <PipelineView user={user} />,
    team: <TeamView user={user} />,
    idx: <IDXView user={user} />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#080808' }}>
      <Sidebar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        taskCount={taskCount}
        open={sidebarOpen}
        onLogout={onLogout}
      />
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
        />
        <main style={{
          flex: 1, overflow: 'auto',
          padding: '28px 32px',
          background: '#080808',
        }}>
          {views[activeView] || views['home']}
        </main>
      </div>
    </div>
  );
}
