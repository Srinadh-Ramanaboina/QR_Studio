import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, ScanLine, Layers, History, Sparkles, Sun, Moon } from 'lucide-react';
import { UserMenu } from './Auth/UserMenu';

export type ActiveTab = 'generator' | 'scanner' | 'bulk' | 'history';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  historyCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  theme,
  onToggleTheme
}) => {
  const tabs = [
    { id: 'generator' as ActiveTab, label: 'Create', fullLabel: 'Generator', icon: QrCode },
    { id: 'scanner' as ActiveTab, label: 'Scan', fullLabel: 'Scanner', icon: ScanLine },
    { id: 'bulk' as ActiveTab, label: 'Bulk', fullLabel: 'Bulk Create', icon: Layers },
    { id: 'history' as ActiveTab, label: 'Saved', fullLabel: 'Saved Codes', icon: History, count: historyCount }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-[#30324F] bg-white/80 dark:bg-[#0F1020]/90 backdrop-blur-xl shadow-xs transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Brand with spring interaction */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('generator')}
          className="flex cursor-pointer items-center gap-2.5 sm:gap-3 transition-opacity shrink-0"
        >
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] text-[#0F1020] shadow-md shadow-indigo-500/25 ring-1 ring-white/30">
            <QrCode className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.4]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#67E8F9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34D399]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 dark:from-[#F1F5F9] dark:via-[#A78BFA] dark:to-[#67E8F9] bg-clip-text text-transparent">
                QR Studio
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-indigo-50/90 dark:bg-[#202341] px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-[#A78BFA] border border-indigo-100/80 dark:border-[#30324F]">
                <Sparkles className="h-3 w-3 text-indigo-500 dark:text-[#67E8F9]" /> Aurora AI
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 dark:text-[#A1A1C2] font-medium">
              Professional Vector & High-Res QR Creator
            </p>
          </div>
        </motion.div>

        {/* Navigation & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Dynamic Sliding Pill Navigation Tabs */}
          <nav className="relative flex items-center rounded-2xl bg-slate-100/80 dark:bg-[#15162B] p-1 border border-slate-200/60 dark:border-[#30324F] shadow-inner shrink-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-colors duration-200 ${
                    isActive
                      ? 'text-white dark:text-[#0F1020]'
                      : 'text-slate-600 dark:text-[#A1A1C2] hover:text-slate-900 dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  {/* Active Sliding Pill with signature Aurora Gradient */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 z-[-1] rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] shadow-sm shadow-indigo-600/30 dark:shadow-cyan-500/20"
                    />
                  )}

                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  <span>{tab.label}</span>

                  {/* Counter Badge with pop animation */}
                  {tab.count !== undefined && tab.count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`inline-flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full px-1 text-[10px] sm:text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-white dark:bg-[#0F1020] text-indigo-700 dark:text-[#A78BFA] shadow-xs'
                          : 'bg-slate-200 dark:bg-[#202341] text-slate-700 dark:text-[#A1A1C2]'
                      }`}
                    >
                      {tab.count}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Account Menu / Auth */}
          <UserMenu
            onNavigateSaved={() => setActiveTab('history')}
            savedCount={historyCount}
          />

          {/* Dark / Light Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, rotate: 180 }}
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-white dark:bg-[#191B33] text-slate-700 dark:text-[#67E8F9] shadow-xs hover:bg-slate-50 dark:hover:bg-[#202341] transition-colors shrink-0"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2] text-[#FBBF24]" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2] text-slate-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
