import React, { useState } from 'react';
import { Database, Key, Check, AlertCircle, RefreshCw, X, ExternalLink } from 'lucide-react';
import { getSupabaseConfig, saveCustomSupabaseConfig, resetSupabaseConfig } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export function SupabaseConfigModal({ isOpen, onClose, onConfigSaved }: Props) {
  const { showToast } = useToast();
  const currentConfig = getSupabaseConfig();
  
  const [url, setUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || '');
  const [isTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Both Supabase URL and Anon Key are required.' });
      return;
    }

    if (!url.startsWith('https://')) {
      setStatusMessage({ type: 'error', text: 'Supabase URL must start with https://' });
      return;
    }

    saveCustomSupabaseConfig(url, anonKey);
    showToast('Supabase configuration saved!', 'success');
    setStatusMessage({ type: 'success', text: 'Saved! Reloading connection...' });
    setTimeout(() => {
      onConfigSaved();
      onClose();
    }, 800);
  };

  const handleReset = () => {
    resetSupabaseConfig();
    setUrl('');
    setAnonKey('');
    showToast('Reset to default configuration', 'info');
    onConfigSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#16181D] border border-[#262A33] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#262A33] bg-[#16181D]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Supabase Connection Settings</h3>
              <p className="text-xs text-slate-400">Configure your project credentials for live syncing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-[#0F1115] p-3.5 rounded-lg border border-[#262A33] text-xs text-slate-300 flex items-start gap-2.5">
            <ExternalLink className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
            <span>
              Find these in your Supabase dashboard under <strong>Project Settings → API</strong>.
              Keys can also be defined in <code className="bg-[#16181D] px-1 py-0.5 rounded text-rose-300">.env</code> as <code className="text-slate-200">VITE_SUPABASE_URL</code> and <code className="text-slate-200">VITE_SUPABASE_ANON_KEY</code>.
            </span>
          </div>

          {statusMessage && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' : 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
            }`}>
              {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {statusMessage.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" /> Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2.5 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" /> Anon / Public API Key
            </label>
            <textarea
              rows={3}
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48] transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear / Reset
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-[#1F222A] hover:bg-[#262A33] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isTesting}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-900/30"
              >
                <Check className="w-3.5 h-3.5" /> Save & Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
