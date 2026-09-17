import React, { useState } from 'react';
import { 
  LayoutDashboard, FolderGit2, Wrench, User, Mail, Database, 
  LogOut, ExternalLink, Menu, X, ShieldCheck, Terminal, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SupabaseConfigModal } from '../setup/SupabaseConfigModal';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export function AdminLayout({ activeTab, onSelectTab, children }: Props) {
  const { user, signOut, isConfigured } = useAuth();
  const { profile, messages, refreshAllData } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const unreadMessagesCount = messages.filter((m) => !m.is_read).length;

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects Manager', icon: FolderGit2 },
    { id: 'skills', label: 'Skills & Proficiencies', icon: Wrench },
    { id: 'profile', label: 'Profile & Contact Info', icon: User },
    { id: 'messages', label: 'Inquiries Inbox', icon: Mail, badge: unreadMessagesCount },
    { id: 'schema', label: 'Supabase SQL & Guide', icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-[#090A0C] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#16181D] border-b border-[#262A33] z-30 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48] flex items-center justify-center font-bold shadow-inner">
            <ShieldCheck className="w-5 h-5 text-[#E11D48]" />
          </div>
          <div>
            <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-bengali font-semibold">মুশফিক রাসেল</span>
              <span className="text-slate-500">-</span>
              <span className="font-sans">Musfiq Russell</span>
            </div>
            <div className="text-[10px] text-slate-400">Musfiq Russell Portfolio CMS</div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#16181D] border-r border-[#262A33] flex flex-col justify-between z-40 transition-transform duration-200 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-5 border-b border-[#262A33] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48] flex items-center justify-center font-bold shadow-inner shadow-rose-950/40">
                <ShieldCheck className="w-5 h-5 text-[#E11D48]" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-[13px] leading-snug font-bengali truncate">
                  মুশফিক রাসেল
                </div>
                <div className="text-[11px] font-semibold text-slate-300">
                  Musfiq Russell
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Portfolio CMS
                </div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#E11D48] text-white font-bold shadow-lg shadow-rose-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#1F222A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white text-[#E11D48]' : 'bg-[#E11D48] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom user profile & Supabase status */}
          <div className="p-3 border-t border-[#262A33] bg-[#0F1115]/50 space-y-2">
            {/* Supabase connection indicator button */}
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="w-full p-2.5 rounded-xl bg-[#0F1115] border border-[#262A33] hover:border-[#E11D48]/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <div>
                  <div className="text-[11px] font-semibold text-white">
                    {isConfigured ? 'Supabase Connected' : 'Demo Sandbox'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isConfigured ? 'PostgreSQL & Storage' : 'Click to configure keys'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
            </button>

            {/* User row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-[#E11D48]/50 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {profile.full_name || 'Musfiq Russell'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {user?.email || 'admin@musfiqrussell.com'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#1F222A] rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#16181D]/80 border-b border-[#262A33] backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Admin</span>
            <span className="text-slate-600">/</span>
            <span className="text-[#E11D48] font-semibold capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://musfiqrussell.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-[#1F222A] hover:bg-[#262A33] text-slate-200 border border-[#2E333F] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3 h-3 text-[#E11D48]" />
            </a>

            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-3 py-1.5 bg-[#E11D48]/10 hover:bg-[#E11D48]/20 text-[#E11D48] border border-[#E11D48]/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isConfigured ? 'Supabase Settings' : 'Connect Supabase'}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Backdrop for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Supabase Config Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onConfigSaved={() => {
          refreshAllData();
        }}
      />
    </div>
  );
}
