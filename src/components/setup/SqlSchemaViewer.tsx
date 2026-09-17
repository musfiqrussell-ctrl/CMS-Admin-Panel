import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, Database, Code2, Layers } from 'lucide-react';
import { SUPABASE_SQL_MIGRATION, FRONTEND_INTEGRATION_SNIPPET } from '../../data/sqlMigration';
import { useToast } from '../../context/ToastContext';

export function SqlSchemaViewer() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'sql' | 'frontend' | 'guide'>('sql');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedJs, setCopiedJs] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
    setCopiedSql(true);
    showToast('SQL Migration copied to clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleCopyJs = () => {
    navigator.clipboard.writeText(FRONTEND_INTEGRATION_SNIPPET);
    setCopiedJs(true);
    showToast('Frontend client code copied!', 'success');
    setTimeout(() => setCopiedJs(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#16181D] border border-[#262A33] p-6 rounded-xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-[#E11D48] font-semibold text-xs uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" /> Supabase Architecture & Setup
          </div>
          <h2 className="text-xl font-bold text-white">Database Migration & Client Integration</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Complete SQL schema for <code className="text-rose-300 bg-[#0F1115] px-1.5 py-0.5 rounded border border-[#262A33]">musfiqrussell.netlify.app</code> including PostgreSQL tables, Row Level Security (RLS) policies, and Supabase Storage bucket configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'sql' && (
            <button
              onClick={handleCopySql}
              className="px-4 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-rose-900/30"
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy Complete SQL'}</span>
            </button>
          )}

          {activeTab === 'frontend' && (
            <button
              onClick={handleCopyJs}
              className="px-4 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-rose-900/30"
            >
              {copiedJs ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedJs ? 'Copied Client Code!' : 'Copy Frontend Code'}</span>
            </button>
          )}

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 bg-[#1F222A] hover:bg-[#262A33] text-slate-300 font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 border border-[#2E333F]"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#262A33] gap-2">
        <button
          onClick={() => setActiveTab('sql')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'sql'
              ? 'border-[#E11D48] text-[#E11D48]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>1. Supabase SQL Migration</span>
        </button>

        <button
          onClick={() => setActiveTab('frontend')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'frontend'
              ? 'border-[#E11D48] text-[#E11D48]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>2. Portfolio Frontend Code Snippets</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 ${
            activeTab === 'guide'
              ? 'border-[#E11D48] text-[#E11D48]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Step-by-Step Setup Guide</span>
        </button>
      </div>

      {/* Tab 1: SQL Code */}
      {activeTab === 'sql' && (
        <div className="bg-[#16181D] border border-[#262A33] rounded-xl overflow-hidden shadow-xl">
          <div className="bg-[#0F1115] px-4 py-3 border-b border-[#262A33] flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[#E11D48]">supabase_migration_portfolio.sql</span>
            <span>Paste directly into Supabase SQL Editor</span>
          </div>
          <div className="p-4 bg-[#090A0C] font-mono text-xs text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed">
            <pre>{SUPABASE_SQL_MIGRATION}</pre>
          </div>
        </div>
      )}

      {/* Tab 2: Frontend Code */}
      {activeTab === 'frontend' && (
        <div className="bg-[#16181D] border border-[#262A33] rounded-xl overflow-hidden shadow-xl">
          <div className="bg-[#0F1115] px-4 py-3 border-b border-[#262A33] flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[#E11D48]">musfiqrussell.netlify.app/src/lib/supabaseClient.js</span>
            <span>Client functions for your public portfolio</span>
          </div>
          <div className="p-4 bg-[#090A0C] font-mono text-xs text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed">
            <pre>{FRONTEND_INTEGRATION_SNIPPET}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Step-by-step Setup Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-[#16181D] border border-[#262A33] p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48] flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-base">Create your Supabase Project</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-[#E11D48] hover:underline">supabase.com/dashboard</a> and create a new project (e.g. named <code className="text-rose-300">musfiq-portfolio</code>). Pick the closest region.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#16181D] border border-[#262A33] p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48] flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-base">Run the SQL Migration in Supabase</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click on the <strong>SQL Editor</strong> in the left sidebar of your Supabase dashboard &rarr; click <strong>New Query</strong> &rarr; copy and paste the full script from tab <strong>1. Supabase SQL Migration</strong> above &rarr; click <strong>Run</strong>.
                </p>
                <div className="bg-[#0F1115] p-3 rounded-lg border border-[#262A33] text-xs text-slate-300 space-y-1">
                  <div className="text-[#E11D48] font-semibold">What this script creates:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li><code className="text-slate-200">profiles</code> table with RLS (public read, admin write).</li>
                    <li><code className="text-slate-200">projects</code> table with RLS (public read, admin write).</li>
                    <li><code className="text-slate-200">skills</code> table with categories & proficiencies.</li>
                    <li><code className="text-slate-200">messages</code> table with public insert (contact form submissions) and admin-only read/write.</li>
                    <li><code className="text-slate-200">portfolio-assets</code> storage bucket with public read and authenticated upload policies.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#16181D] border border-[#262A33] p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48] flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-base">Create your Admin Auth User</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In Supabase Dashboard &rarr; <strong>Authentication &rarr; Users &rarr; Add User</strong> &rarr; <strong>Create User</strong>:
                </p>
                <div className="bg-[#0F1115] p-3 rounded-lg border border-[#262A33] text-xs text-slate-300">
                  <div><strong>Email:</strong> <code className="text-rose-300">musfiqrussell@gmail.com</code> (or your chosen email)</div>
                  <div className="mt-1"><strong>Password:</strong> Your strong admin password</div>
                  <div className="mt-1 text-slate-400">Toggle &quot;Auto Confirm User&quot; so you can log in right away without email verification.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#16181D] border border-[#262A33] p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48] flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-base">Connect musfiqrussell.netlify.app</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  On your portfolio repository deployed on Netlify, install <code className="text-rose-300">@supabase/supabase-js</code> and configure the environment variables in Netlify site settings:
                </p>
                <div className="bg-[#0F1115] p-3 rounded-lg border border-[#262A33] font-mono text-xs text-slate-300 space-y-1">
                  <div>VITE_SUPABASE_URL = &quot;https://your-project.supabase.co&quot;</div>
                  <div>VITE_SUPABASE_ANON_KEY = &quot;your-anon-public-key&quot;</div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Then simply call <code className="text-rose-300">getProjects()</code>, <code className="text-rose-300">getSkills()</code>, and <code className="text-rose-300">getProfile()</code> to dynamically render your projects and personal info!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
