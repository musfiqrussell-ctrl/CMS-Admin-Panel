import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface Props {
  onSuccess?: () => void;
}

export function AdminLogin({ onSuccess }: Props) {
  const { signIn } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState(() => {
    return localStorage.getItem('portfolio_saved_email') || 'musfiqrussell@gmail.com';
  });
  const [password, setPassword] = useState('portfolioadmin2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    const saved = localStorage.getItem('portfolio_remember_me');
    return saved !== null ? saved === 'true' : true;
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMessage(null);
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('portfolio_saved_email', email);
        localStorage.setItem('portfolio_remember_me', 'true');
      } else {
        localStorage.removeItem('portfolio_saved_email');
        localStorage.setItem('portfolio_remember_me', 'false');
      }

      const { error } = await signIn(email, password, rememberMe);

      if (error) {
        setErrorMessage(error.message);
        showToast(error.message, 'error');
        
        // Trigger card shake animation
        setIsShaking(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsShaking(true);
          });
        });
      } else {
        showToast('Logged into Portfolio Admin', 'success');
        if (onSuccess) onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090A0C] px-4 py-12 relative overflow-hidden selection:bg-[#E11D48] selection:text-white">
      {/* Background ambient lighting & glass orb reflections */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-gradient-to-tr from-[#E11D48]/15 via-rose-600/10 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#E11D48]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-950/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle background radial dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative w-full max-w-[450px] z-10">
        {/* Header Branding with Bengali Typography */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/15 backdrop-blur-xl mb-5 shadow-[0_8px_30px_rgba(225,29,72,0.25)] group transition-transform duration-300 hover:scale-105">
            <ShieldCheck className="w-8 h-8 text-[#E11D48] drop-shadow-[0_2px_12px_rgba(225,29,72,0.6)]" />
          </div>
          
          <h1 className="whitespace-nowrap text-[17px] min-[380px]:text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug flex items-center justify-center">
            <span className="font-bengali font-semibold text-white">
              মুশফিক রাসেল
            </span>
            <span className="text-slate-400 font-light mx-1.5 sm:mx-2.5">-</span>
            <span className="font-sans font-bold text-white">
              Musfiq Russell
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide mt-2">
            Musfiq Russell Portfolio CMS
          </p>
        </motion.div>

        {/* Sleek Glassmorphic Login Card with Framer Motion Entrance & Error Shake Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          onAnimationEnd={() => setIsShaking(false)}
          className={`relative bg-[#12141A]/75 backdrop-blur-2xl border rounded-3xl p-8 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden transition-[border-color,box-shadow] duration-300 ${
            isShaking 
              ? 'animate-shake border-[#E11D48]/70 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(225,29,72,0.35)]' 
              : 'border-white/10'
          }`}
        >
          {/* Subtle top edge glowing hairline */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E11D48]/60 to-transparent" />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#E11D48]/20 rounded-full blur-2xl pointer-events-none" />

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/50 border border-[#E11D48]/40 text-rose-200 text-xs leading-relaxed backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-[#E11D48] absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@musfiqrussell.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#090A0E]/80 border border-white/10 hover:border-white/20 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/15 focus:shadow-[0_0_20px_rgba(225,29,72,0.2)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field with Interactive Visibility Toggle */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-[#E11D48] absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-[#090A0E]/80 border border-white/10 hover:border-white/20 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/15 focus:shadow-[0_0_20px_rgba(225,29,72,0.2)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                />
                
                {/* Visibility Toggle Button with Micro-interaction */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 disabled:opacity-40 disabled:cursor-not-allowed group/eye"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <div className="relative w-4 h-4 flex items-center justify-center">
                    <Eye
                      className={`w-4 h-4 absolute inset-0 transition-all duration-300 ease-out transform ${
                        showPassword
                          ? 'opacity-0 scale-75 rotate-45 pointer-events-none'
                          : 'opacity-100 scale-100 rotate-0 group-hover/eye:text-slate-200'
                      }`}
                    />
                    <EyeOff
                      className={`w-4 h-4 absolute inset-0 transition-all duration-300 ease-out transform ${
                        showPassword
                          ? 'opacity-100 scale-100 rotate-0 text-[#E11D48]'
                          : 'opacity-0 scale-75 -rotate-45 pointer-events-none'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox to persist user session */}
            <div className="flex items-center justify-between pt-0.5">
              <label 
                htmlFor="remember-me"
                className={`inline-flex items-center gap-2.5 cursor-pointer group select-none ${
                  loading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    disabled={loading}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-md border transition-all duration-200 flex items-center justify-center shadow-inner ${
                      rememberMe
                        ? 'bg-[#E11D48] border-[#E11D48] shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                        : 'bg-[#090A0E]/90 border-white/20 group-hover:border-white/40'
                    }`}
                  >
                    <Check
                      className={`w-3 h-3 text-white transition-all duration-150 ${
                        rememberMe ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                      }`}
                      strokeWidth={3}
                    />
                  </div>
                </div>
                <span className="text-xs text-slate-300 group-hover:text-slate-100 font-medium transition-colors">
                  Remember me
                </span>
              </label>

              <span className="text-[11px] text-slate-400 select-none">
                Persist session
              </span>
            </div>

            {/* Submit Button with Loading Spinner and Disabled Prevention */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full mt-3 py-3.5 px-6 bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#E11D48] bg-[length:200%_auto] hover:bg-right text-white font-semibold rounded-xl text-sm transition-[background-position,transform,box-shadow,opacity] duration-500 ease-out flex items-center justify-center gap-2.5 shadow-[0_8px_25px_rgba(225,29,72,0.35)] hover:shadow-[0_12px_32px_rgba(225,29,72,0.55)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_25px_rgba(225,29,72,0.35)] group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
