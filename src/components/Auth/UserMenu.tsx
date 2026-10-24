import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User as UserIcon,
  LogOut,
  Cloud,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
  onNavigateSaved?: () => void;
  savedCount?: number;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigateSaved, savedCount = 0 }) => {
  const { user, loading, openAuthModal, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-slate-100 dark:bg-[#191B33] animate-pulse border border-slate-200 dark:border-[#30324F]" />
    );
  }

  // Not signed in state
  if (!user) {
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={openAuthModal}
        className="flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-[#30324F] bg-[#191B33] px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-[#F1F5F9] hover:border-[#A78BFA] hover:shadow-md hover:shadow-[#A78BFA]/15 transition-all shadow-xs"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
          <UserIcon className="h-3 w-3 stroke-[2.5]" />
        </div>
        <span className="hidden sm:inline">Sign In</span>
      </motion.button>
    );
  }

  // Signed in state
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => setDropdownOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-white dark:bg-[#191B33] p-1.5 pr-2.5 sm:pr-3 text-xs font-bold text-slate-800 dark:text-[#F1F5F9] shadow-xs hover:border-[#A78BFA] transition-all"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            className="h-7 w-7 rounded-xl object-cover ring-1 ring-[#A78BFA]/40"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-[#A78BFA] to-[#67E8F9] text-[#0F1020] font-black text-xs shadow-xs">
            {initial}
          </div>
        )}
        <span className="hidden sm:inline-block max-w-[90px] truncate">{displayName}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 dark:text-[#A1A1C2] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white/95 dark:bg-[#191B33]/95 backdrop-blur-xl p-3 shadow-2xl z-50 transition-colors"
          >
            {/* User Details */}
            <div className="border-b border-slate-100 dark:border-[#30324F] pb-3 px-1">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-[#A78BFA]/50"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#A78BFA] to-[#67E8F9] text-[#0F1020] font-black text-sm">
                    {initial}
                  </div>
                )}
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] truncate block">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-[#A1A1C2] truncate block">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Cloud Sync Status */}
              <div className="mt-2.5 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[#202341] px-2.5 py-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-[#34D399] font-semibold">
                  <Cloud className="h-3.5 w-3.5" />
                  <span>Cloud Sync Active</span>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="py-2 space-y-1">
              {onNavigateSaved && (
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigateSaved();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#202341] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-indigo-500 dark:text-[#A78BFA]" />
                    <span>My Saved QR Codes</span>
                  </div>
                  <span className="rounded-full bg-slate-200 dark:bg-[#30324F] px-1.5 py-0.5 text-[10px] font-mono">
                    {savedCount}
                  </span>
                </button>
              )}

              <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-400 dark:text-[#A1A1C2]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
                <span>Zero-cloud leakage encryption</span>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="border-t border-slate-100 dark:border-[#30324F] pt-2">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  signOut();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
