import React, { useState } from 'react';
import { 
  User, Mail, Globe, Github, Linkedin, Twitter, Facebook, 
  FileText, Upload, Save, ExternalLink, Sparkles, Download 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export function ProfileManager() {
  const { profile, updateProfile, uploadAsset } = useData();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(profile.full_name || 'Musfiq Russell');
  const [designation, setDesignation] = useState(profile.designation || 'Senior Full-Stack Software Engineer');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [resumeUrl, setResumeUrl] = useState(profile.resume_url || '');

  // Social Links
  const [github, setGithub] = useState(profile.social_links?.github || 'https://github.com/musfiq');
  const [linkedin, setLinkedin] = useState(profile.social_links?.linkedin || 'https://linkedin.com/in/musfiqrussell');
  const [twitter, setTwitter] = useState(profile.social_links?.twitter || 'https://twitter.com/musfiqrussell');
  const [facebook, setFacebook] = useState(profile.social_links?.facebook || 'https://facebook.com/musfiq.russell');
  const [website, setWebsite] = useState(profile.social_links?.website || 'https://musfiqrussell.netlify.app');
  const [email, setEmail] = useState(profile.social_links?.email || 'musfiqrussell@gmail.com');

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Avatar must be an image (PNG/JPG/WEBP)', 'error');
      return;
    }

    setIsUploadingAvatar(true);
    const url = await uploadAsset(file, 'avatars');
    setIsUploadingAvatar(false);

    if (url) {
      setAvatarUrl(url);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      showToast('Resume must be a PDF file', 'error');
      return;
    }

    setIsUploadingResume(true);
    const url = await uploadAsset(file, 'resumes');
    setIsUploadingResume(false);

    if (url) {
      setResumeUrl(url);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    await updateProfile({
      full_name: fullName,
      designation,
      bio,
      avatar_url: avatarUrl || null,
      resume_url: resumeUrl || null,
      social_links: {
        github,
        linkedin,
        twitter,
        facebook,
        website,
        email,
      },
    });

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Profile & Contact Information</h2>
          <p className="text-xs text-slate-400 mt-1">
            Updates profile metadata on <span className="text-[#E11D48] font-medium">musfiqrussell.netlify.app</span> and Supabase <code className="text-slate-300">profiles</code> table
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-rose-900/30 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving to Supabase...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Main Info Box */}
          <div className="bg-[#16181D] border border-[#262A33] rounded-xl p-6 space-y-4 shadow-md">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 pb-3 border-b border-[#262A33]">
              <User className="w-4 h-4 text-[#E11D48]" />
              <span>Personal Identity & Headline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Professional Designation *
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Professional Bio / Summary
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a concise overview of your architectural expertise, projects, and strengths..."
                className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48] leading-relaxed"
              />
            </div>
          </div>

          {/* Media Assets (Avatar & Resume) */}
          <div className="bg-[#16181D] border border-[#262A33] rounded-xl p-6 space-y-5 shadow-md">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 pb-3 border-b border-[#262A33]">
              <FileText className="w-4 h-4 text-[#E11D48]" />
              <span>Media Assets & Documents (Supabase Storage)</span>
            </h3>

            {/* Avatar uploader */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#0F1115] border border-[#262A33] rounded-lg">
              <div className="relative">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#E11D48]/50 shadow-md"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-xs font-semibold text-white">Profile Avatar</div>
                <div className="text-[11px] text-slate-400">
                  PNG, JPG, or WebP. Uploaded directly to <code className="text-rose-300">portfolio-assets/avatars/</code>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1F222A] hover:bg-[#262A33] text-slate-200 rounded-md text-xs font-medium border border-[#2E333F] transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#E11D48]" />
                    <span>{isUploadingAvatar ? 'Uploading...' : 'Upload New Avatar'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Or enter image URL directly"
                    className="flex-1 min-w-[200px] px-2.5 py-1.5 bg-[#16181D] border border-[#262A33] rounded text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>
            </div>

            {/* Resume PDF uploader */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-[#0F1115] border border-[#262A33] rounded-lg">
              <div className="w-20 h-20 rounded-xl bg-[#16181D] border border-[#262A33] flex items-center justify-center text-[#E11D48] shrink-0">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-xs font-semibold text-white">Curriculum Vitae / Resume PDF</div>
                <div className="text-[11px] text-slate-400">
                  Uploaded to Supabase Storage <code className="text-rose-300">portfolio-assets/resumes/</code>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1F222A] hover:bg-[#262A33] text-slate-200 rounded-md text-xs font-medium border border-[#2E333F] transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#E11D48]" />
                    <span>{isUploadingResume ? 'Uploading PDF...' : 'Upload Resume PDF'}</span>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleResumeUpload}
                      disabled={isUploadingResume}
                      className="hidden"
                    />
                  </label>
                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/30 rounded-md text-xs font-medium hover:bg-[#E11D48]/20 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View Current PDF</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://.../resume.pdf"
                  className="w-full px-2.5 py-1.5 bg-[#16181D] border border-[#262A33] rounded text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>
          </div>

          {/* Social Links Box */}
          <div className="bg-[#16181D] border border-[#262A33] rounded-xl p-6 space-y-4 shadow-md">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 pb-3 border-b border-[#262A33]">
              <Globe className="w-4 h-4 text-[#E11D48]" />
              <span>Social & Contact Channels (JSONB: social_links)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-400" /> GitHub Profile
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/musfiq"
                  className="w-full px-3 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" /> LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/musfiqrussell"
                  className="w-full px-3 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-sky-400" /> Twitter / X Profile
                </label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://twitter.com/musfiqrussell"
                  className="w-full px-3 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-400" /> Facebook Profile
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/musfiq.russell"
                  className="w-full px-3 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#E11D48]" /> Portfolio Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://musfiqrussell.netlify.app"
                  className="w-full px-3 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="musfiqrussell@gmail.com"
                  className="w-full px-3 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Column: Live Portfolio Preview Card */}
        <div className="space-y-4">
          <div className="bg-[#16181D] border border-[#262A33] rounded-xl p-6 shadow-xl sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#262A33] mb-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" /> Live Preview
              </span>
              <span className="text-[11px] text-[#E11D48] font-mono">musfiqrussell.netlify.app</span>
            </div>

            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#E11D48] shadow-lg shadow-rose-950/40"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#16181D]" title="Available for projects" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">{fullName}</h4>
                <p className="text-xs text-[#E11D48] font-medium mt-0.5">{designation}</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                {bio || 'Building scalable web applications, distributed systems, and modern interactive user experiences.'}
              </p>

              {/* Social links row */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {github && (
                  <a href={github} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0F1115] hover:bg-[#1F222A] text-slate-300 hover:text-white border border-[#262A33] transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0F1115] hover:bg-[#1F222A] text-slate-300 hover:text-sky-400 border border-[#262A33] transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0F1115] hover:bg-[#1F222A] text-slate-300 hover:text-sky-400 border border-[#262A33] transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#0F1115] hover:bg-[#1F222A] text-slate-300 hover:text-blue-400 border border-[#262A33] transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="p-2 rounded-lg bg-[#0F1115] hover:bg-[#1F222A] text-slate-300 hover:text-[#E11D48] border border-[#262A33] transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>

              {resumeUrl && (
                <div className="pt-3">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs rounded-lg transition-all inline-flex items-center justify-center gap-2 shadow-md shadow-rose-900/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Curriculum Vitae</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
