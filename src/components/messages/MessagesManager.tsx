import React, { useState } from 'react';
import { 
  Inbox, Mail, MailOpen, Trash2, Reply, Send, CheckCircle2, 
  Search, Filter, Clock, User, AlertCircle, X, Check, Sparkles 
} from 'lucide-react';
import { Message } from '../../types';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export function MessagesManager() {
  const { messages, toggleMessageRead, deleteMessage, sendSimulatedMessage, isLiveSupabase } = useData();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Test Contact Form Simulator state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simName, setSimName] = useState('Tech Recruiter');
  const [simEmail, setSimEmail] = useState('recruiter@fortune500.com');
  const [simSubject, setSimSubject] = useState('Interview for Lead Solutions Architect');
  const [simMessage, setSimMessage] = useState('Hello Musfiq, we are thrilled with your background and would like to arrange an introductory chat.');
  const [isSendingSim, setIsSendingSim] = useState(false);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter = 
      filter === 'all' ? true : filter === 'unread' ? !msg.is_read : msg.is_read;
    
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleOpenMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      await toggleMessageRead(msg.id, true);
    }
  };

  const handleSendSimulator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName.trim() || !simEmail.trim() || !simMessage.trim()) {
      showToast('All fields are required', 'error');
      return;
    }

    setIsSendingSim(true);
    await sendSimulatedMessage({
      name: simName,
      email: simEmail,
      subject: simSubject,
      message: simMessage,
    });
    setIsSendingSim(false);
    setIsSimulatorOpen(false);
    showToast('New message arrived in inbox!', 'success');
  };

  const getMailtoUrl = (msg: Message) => {
    const subject = encodeURIComponent(`Re: ${msg.subject}`);
    const body = encodeURIComponent(
      `Hi ${msg.name},\n\nThank you for reaching out through my portfolio (musfiqrussell.netlify.app)!\n\nBest regards,\nMusfiq Russell`
    );
    return `mailto:${msg.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Contact Inquiries Inbox</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Submissions received from the contact form at <span className="text-emerald-400">musfiqrussell.netlify.app</span> ({messages.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Contact Form</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender, email, subject, or message content..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filter === 'unread' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === 'read' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages Table/List (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Inbound Messages</span>
            <span>{filteredMessages.length} results</span>
          </div>

          <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[600px]">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`p-4 transition-all cursor-pointer flex items-start gap-3.5 hover:bg-slate-800/40 ${
                    !msg.is_read ? 'bg-slate-800/20' : ''
                  } ${isSelected ? 'border-l-4 border-l-emerald-500 bg-slate-800/60' : ''}`}
                >
                  <div className="pt-0.5">
                    {!msg.is_read ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block ring-4 ring-emerald-500/20" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs truncate ${!msg.is_read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                        {msg.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 shrink-0 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <p className={`text-xs truncate mt-0.5 ${!msg.is_read ? 'text-emerald-300 font-medium' : 'text-slate-400'}`}>
                      {msg.subject}
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleMessageRead(msg.id, !msg.is_read)}
                      className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                      title={msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {msg.is_read ? <Mail className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(msg.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredMessages.length === 0 && (
              <div className="py-16 text-center text-slate-500 text-xs">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No messages match your search or filter.
              </div>
            )}
          </div>
        </div>

        {/* Selected Message Detail Panel (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base leading-snug">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-medium text-slate-200">{selectedMessage.name}</span>
                    <span>&bull;</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-emerald-400 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Received: {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-slate-500 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message Body */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[160px]">
                {selectedMessage.message}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMessageRead(selectedMessage.id, !selectedMessage.is_read)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    {selectedMessage.is_read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(selectedMessage.id)}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <a
                  href={getMailtoUrl(selectedMessage)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-slate-500 p-8">
              <Mail className="w-10 h-10 mb-3 text-slate-600 stroke-[1.5]" />
              <h4 className="font-semibold text-slate-300 text-sm">No Message Selected</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Select an inquiry from the inbox on the left to read full details and reply.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Simulator Modal */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Test Contact Submission</h3>
              </div>
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendSimulator} className="p-6 space-y-3.5">
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulates a visitor filling out the contact form on <code className="text-emerald-300">musfiqrussell.netlify.app</code> via Supabase public RLS insert policy.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Visitor Name *</label>
                <input
                  type="text"
                  required
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={simSubject}
                  onChange={(e) => setSimSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Message Content *</label>
                <textarea
                  rows={3}
                  required
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingSim}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingSim ? 'Submitting to Supabase...' : 'Submit Inquiry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-white text-base">Delete Message?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this contact inquiry?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteMessage(deleteConfirmId);
                  if (selectedMessage?.id === deleteConfirmId) {
                    setSelectedMessage(null);
                  }
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
