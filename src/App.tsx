import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AdminLogin } from './components/auth/AdminLogin';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ProjectsManager } from './components/projects/ProjectsManager';
import { SkillsManager } from './components/skills/SkillsManager';
import { ProfileManager } from './components/profile/ProfileManager';
import { MessagesManager } from './components/messages/MessagesManager';
import { SqlSchemaViewer } from './components/setup/SqlSchemaViewer';
import { SupabaseConfigModal } from './components/setup/SupabaseConfigModal';
import { ShieldCheck } from 'lucide-react';

function ProtectedAdminApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'projects', 'skills', 'profile', 'messages', 'schema'].includes(hash)) {
        return hash;
      }
    }
    return 'overview';
  });

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Sync active tab to url hash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-xs font-mono text-slate-500">Checking Supabase Admin Session...</p>
      </div>
    );
  }

  // Route guard: if unauthenticated, show dedicated admin login
  if (!user) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'overview' && (
        <DashboardOverview
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenConfig={() => setIsConfigModalOpen(true)}
        />
      )}

      {activeTab === 'projects' && <ProjectsManager />}

      {activeTab === 'skills' && <SkillsManager />}

      {activeTab === 'profile' && <ProfileManager />}

      {activeTab === 'messages' && <MessagesManager />}

      {activeTab === 'schema' && <SqlSchemaViewer />}

      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onConfigSaved={() => {}}
      />
    </AdminLayout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <ProtectedAdminApp />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
