import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Cloud, ShieldCheck, Zap, Layers, ArrowRight, AlertCircle, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signIn, error, clearError } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with Aurora Glass Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-[#0F1020]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] p-6 sm:p-7 shadow-2xl z-10 transition-colors"
        >
          {/* Subtle Ambient Aurora Glow inside dialog */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-[#A78BFA]/30 to-[#67E8F9]/20 blur-2xl" />

          {/* Close button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 dark:text-[#A1A1C2] hover:bg-slate-100 dark:hover:bg-[#202341] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-md shadow-[#A78BFA]/30 mb-3">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0F1020]">
                <QrCode className="h-6 w-6 text-[#67E8F9]" />
              </div>
            </div>

            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-[#F1F5F9]">
              Sign in to QR Studio
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#A1A1C2]">
              Unlock cloud sync across devices and access your saved QR codes anywhere.
            </p>
          </div>

          {/* Benefits List */}
          <div className="mt-5 space-y-2.5 rounded-2xl border border-slate-100 dark:border-[#30324F] bg-slate-50/70 dark:bg-[#15162B] p-3.5">
            {[
              {
                icon: Cloud,
                title: 'Cross-Device Cloud Sync',
                desc: 'Auto-sync your designs, vCards, and links across phone & desktop'
              },
              {
                icon: ShieldCheck,
                title: 'Zero-Knowledge Privacy',
                desc: 'Client-side generation with private encrypted user storage'
              },
              {
                icon: Layers,
                title: 'Unlimited Custom Presets',
                desc: 'Save branded frames, logo placements, and color schemes'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-2.5 text-left">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-[#202341] text-indigo-600 dark:text-[#A78BFA]">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-[#F1F5F9] block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#A1A1C2] leading-tight block">
                      {item.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-between rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-2.5 text-xs text-rose-700 dark:text-rose-300"
            >
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={clearError}
                className="text-[10px] underline hover:opacity-80"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {/* Sign In Action Button */}
          <div className="mt-5 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={signIn}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] py-3.5 px-4 text-xs font-extrabold text-[#0F1020] shadow-lg shadow-indigo-500/20 transition-all hover:brightness-105 active:scale-98"
            >
              {/* Google Colored Icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </motion.button>

            <p className="text-center text-[10px] text-slate-400 dark:text-[#A1A1C2]/60 pt-1">
              By continuing, you agree to our local privacy-first terms. No spam or cloud tracking.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
