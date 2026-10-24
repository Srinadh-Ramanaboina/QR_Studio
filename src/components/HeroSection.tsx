import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  QrCode,
  ScanLine,
  Layers,
  History,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface HeroSectionProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onScrollToPresets: () => void;
  historyCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateTab,
  onScrollToPresets,
  historyCount
}) => {
  return (
    <div className="relative overflow-hidden pt-6 pb-8 sm:pt-10 sm:pb-12">
      {/* Background Aurora Mesh Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[280px] w-[600px] rounded-full bg-gradient-to-r from-[#A78BFA]/20 via-[#60A5FA]/20 to-[#67E8F9]/15 blur-3xl opacity-70" />
      </div>

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-[#30324F] bg-white/80 dark:bg-[#191B33]/80 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-[#A78BFA] backdrop-blur-md shadow-sm mb-4"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#67E8F9] animate-ping" />
          <span>Aurora Studio v2.0 • Pro AI-Inspired Architecture</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-black tracking-tight text-slate-900 dark:text-[#F1F5F9] sm:text-5xl lg:text-6xl"
        >
          Create QR Codes That{' '}
          <span className="bg-gradient-to-r from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] bg-clip-text text-transparent">
            Stand Out
          </span>
        </motion.h1>

        {/* Supporting Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-[#A1A1C2] sm:text-base leading-relaxed"
        >
          Generate, customize, and download beautiful QR codes for your links, business, and everyday needs. 100% client-side privacy with instant vector SVG and high-res exports.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onNavigateTab('generator')}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] px-6 py-3 text-sm font-extrabold text-[#0F1020] shadow-lg shadow-indigo-500/20 transition-all hover:brightness-105"
          >
            <QrCode className="h-4 w-4 stroke-[2.4]" />
            <span>Create QR Code</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onScrollToPresets}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33]/90 px-5 py-3 text-sm font-bold text-slate-800 dark:text-[#F1F5F9] hover:bg-slate-50 dark:hover:bg-[#202341] hover:border-[#60A5FA]/40 transition-all shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-[#A78BFA]" />
            <span>Explore Templates</span>
          </motion.button>
        </motion.div>

        {/* Dashboard Quick Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-4xl mx-auto"
        >
          {[
            {
              tab: 'generator' as ActiveTab,
              title: 'Create QR Code',
              desc: '11 Data Formats & Vectors',
              icon: QrCode,
              accent: 'from-[#A78BFA]/20 to-transparent'
            },
            {
              tab: 'scanner' as ActiveTab,
              title: 'QR Scanner',
              desc: 'Live Camera & File Drop',
              icon: ScanLine,
              accent: 'from-[#60A5FA]/20 to-transparent'
            },
            {
              tab: 'bulk' as ActiveTab,
              title: 'Bulk Generator',
              desc: 'CSV Import & ZIP Export',
              icon: Layers,
              accent: 'from-[#67E8F9]/20 to-transparent'
            },
            {
              tab: 'history' as ActiveTab,
              title: 'My QR Codes',
              desc: `${historyCount} Saved Locally`,
              icon: History,
              accent: 'from-[#34D399]/20 to-transparent'
            }
          ].map(card => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateTab(card.tab)}
                className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33]/80 p-3.5 text-left transition-all hover:border-[#60A5FA]/50 hover:bg-slate-50 dark:hover:bg-[#202341] shadow-xs relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${card.accent} rounded-full blur-xl pointer-events-none`} />
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#202341] text-indigo-600 dark:text-[#A78BFA] group-hover:text-[#67E8F9] transition-colors mb-2 border border-slate-200 dark:border-[#30324F]">
                  <Icon className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-[#F1F5F9] group-hover:text-indigo-600 dark:group-hover:text-[#67E8F9] transition-colors">
                  {card.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-[#A1A1C2] mt-0.5 line-clamp-1">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
