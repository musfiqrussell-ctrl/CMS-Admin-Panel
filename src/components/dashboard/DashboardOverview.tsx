import React from 'react';
import { 
  FolderGit2, Wrench, Mail, Star, Plus, ArrowRight, UserCheck, 
  Database, ExternalLink, Clock, CheckCircle2, Terminal 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onNavigate: (tab: string) => void;
  onOpenConfig: () => void;
}

export function DashboardOverview({ onNavigate, onOpenConfig }: Props) {
  const { profile, projects, skills, messages } = useData();
  const { isConfigured } = useAuth();

  const unreadMessages = messages.filter((m) => !m.is_read);
  const featuredProjects = projects.filter((p) => p.is_featured);

  return (
    <div className="space-y-7 selection:bg-[#E11D48] selection:text-white">
      {/* Top Banner / Welcome Card with Glassmorphism */}
      <div className="relative bg-[#12141A]/75 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E11D48]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E11D48]/40 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/30 flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
                Musfiq Russell Portfolio CMS
              </span>
              {isConfigured ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                  Supabase Live Sync Active
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 backdrop-blur-md">
                  Interactive Demo Mode
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Welcome back, {profile.full_name || 'Musfiq Russell'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Managing content, portfolio projects, engineering skills, and incoming inquiries for{' '}
              <a
                href="https://musfiqrussell.netlify.app"
                target="_blank"
                rel="noreferrer"
                className="text-[#E11D48] hover:underline font-medium inline-flex items-center gap-1 transition-colors"
              >
                musfiqrussell.netlify.app <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('projects')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] text-white font-semibold text-xs rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#E11D48]/30 hover:shadow-[#E11D48]/50 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#E11D48]" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => onNavigate('schema')}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-medium text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              title="Supabase SQL & Setup Guide"
            >
              <Terminal className="w-4 h-4 text-[#E11D48]" />
              <span>SQL Migration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid / Main Dashboard Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="relative bg-[#12141A]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-[#E11D48]/50 hover:bg-[#12141A]/90 hover:scale-[1.025] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 ease-out cursor-pointer group shadow-lg hover:shadow-[0_14px_35px_rgba(225,29,72,0.16)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Projects
            </span>
            <div className="p-2.5 rounded-xl bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/20 group-hover:scale-110 group-hover:bg-[#E11D48]/20 transition-all duration-300">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">{projects.length}</span>
            <span className="text-xs text-[#E11D48] flex items-center gap-1 font-medium">
              {featuredProjects.length} featured <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </div>
        </div>

        {/* Total Skills */}
        <div
          onClick={() => onNavigate('skills')}
          className="relative bg-[#12141A]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-[#E11D48]/50 hover:bg-[#12141A]/90 hover:scale-[1.025] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 ease-out cursor-pointer group shadow-lg hover:shadow-[0_14px_35px_rgba(225,29,72,0.16)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Technical Skills
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-300">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">{skills.length}</span>
            <span className="text-xs text-rose-400 flex items-center gap-1 font-medium">
              5 categories <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </div>
        </div>

        {/* Unread Inquiries */}
        <div
          onClick={() => onNavigate('messages')}
          className="relative bg-[#12141A]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-[#E11D48]/50 hover:bg-[#12141A]/90 hover:scale-[1.025] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 ease-out cursor-pointer group shadow-lg hover:shadow-[0_14px_35px_rgba(225,29,72,0.16)] overflow-hidden"
        >
          {unreadMessages.length > 0 && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#E11D48]/15 rounded-bl-full pointer-events-none blur-sm" />
          )}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Contact Inquiries
            </span>
            <div className="p-2.5 rounded-xl bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/30 group-hover:scale-110 group-hover:bg-[#E11D48]/25 transition-all duration-300">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">{messages.length}</span>
            <span className={`text-xs font-semibold flex items-center gap-1 ${unreadMessages.length > 0 ? 'text-[#E11D48]' : 'text-slate-500'}`}>
              {unreadMessages.length} unread <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </div>
        </div>

        {/* Featured Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="relative bg-[#12141A]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-[#E11D48]/50 hover:bg-[#12141A]/90 hover:scale-[1.025] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 ease-out cursor-pointer group shadow-lg hover:shadow-[0_14px_35px_rgba(225,29,72,0.16)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Featured Showcase
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white font-mono tracking-tight">{featuredProjects.length}</span>
            <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
              Top portfolio tier <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Inquiries & Featured Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Messages (7 cols) */}
        <div className="lg:col-span-7 bg-[#12141A]/75 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base tracking-tight">Recent Contact Inquiries</h3>
            </div>
            <button
              onClick={() => onNavigate('messages')}
              className="text-xs text-[#E11D48] hover:text-[#F43F5E] flex items-center gap-1 font-semibold transition-colors"
            >
              <span>View All Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                onClick={() => onNavigate('messages')}
                className={`p-4 rounded-2xl border transition-all duration-200 ease-out cursor-pointer hover:border-white/20 hover:scale-[1.015] hover:-translate-y-0.5 active:scale-[0.99] ${
                  !msg.is_read
                    ? 'bg-[#181B24]/80 border-[#E11D48]/35 shadow-sm hover:border-[#E11D48]/60 hover:shadow-[0_4px_20px_rgba(225,29,72,0.12)]'
                    : 'bg-[#0B0C10]/60 border-white/5 hover:bg-[#12141A]/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-[#E11D48] shrink-0 animate-pulse" />}
                    {msg.name}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="text-xs text-rose-300 font-medium mt-1.5 truncate">
                  {msg.subject}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {msg.message}
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-500">
                No inquiries submitted yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Supabase Connection Card & Featured Projects (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Supabase Connection Status */}
          <div className="bg-[#12141A]/75 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm tracking-tight">Supabase Sync Status</h3>
              </div>
              <button
                onClick={onOpenConfig}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Configure
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090A0E]/80 border border-white/5 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database & RLS:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 4 Tables Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Storage Bucket:</span>
                <span className="text-[#E11D48] font-mono text-[11px] font-semibold">portfolio-assets</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Auth Guard:</span>
                <span className="text-slate-200">Email & Password</span>
              </div>
            </div>

            <button
              onClick={onOpenConfig}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-[#E11D48]/40"
            >
              <Database className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>{isConfigured ? 'Manage Supabase Keys' : 'Connect Live Supabase Project'}</span>
            </button>
          </div>

          {/* Featured Projects Highlight */}
          <div className="bg-[#12141A]/75 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm tracking-tight">Top Featured Works</h3>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="space-y-2.5">
              {featuredProjects.slice(0, 3).map((proj) => (
                <div 
                  key={proj.id} 
                  onClick={() => onNavigate('projects')}
                  className="flex items-center gap-3 p-2.5 bg-[#090A0E]/80 rounded-xl border border-white/5 hover:border-[#E11D48]/35 hover:bg-[#12141A]/90 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer group"
                >
                  <img
                    src={proj.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100'}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover bg-black shrink-0 transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate group-hover:text-rose-200 transition-colors">{proj.title}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {proj.tech_stack.slice(0, 3).join(' • ')}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">#{proj.display_order}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
