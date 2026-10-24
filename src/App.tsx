import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QRGenerator } from './components/QRGenerator/QRGenerator';
import { QRScanner } from './components/QRScanner/QRScanner';
import { BulkGenerator } from './components/QRBulk/BulkGenerator';
import { QRHistory } from './components/QRHistory/QRHistory';
import { AuthModal } from './components/Auth/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QRItemHistory, QRDataType, QRDesignConfig } from './types/qr';
import { getHistory } from './utils/storage';
import { DEFAULT_DESIGN } from './utils/qrPresets';
import { ShieldCheck, Heart, Sparkles, QrCode } from 'lucide-react';
import { fetchUserCloudQRCodes } from './services/firebase';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [history, setHistory] = useState<QRItemHistory[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const { user } = useAuth();

  // Dark / Light Theme state with persistence (defaults to dark for Aurora theme)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('qr_studio_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'dark'; // Aurora Gradient Theme default is dark
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('qr_studio_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Studio restore state
  const [generatorKey, setGeneratorKey] = useState<number>(1);
  const [initialPayload, setInitialPayload] = useState<string>('https://google.com');
  const [initialType, setInitialType] = useState<QRDataType>('url');
  const [initialDesign, setInitialDesign] = useState<QRDesignConfig>(DEFAULT_DESIGN);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // When user authenticates, sync their cloud codes into history
  useEffect(() => {
    if (user) {
      fetchUserCloudQRCodes(user.uid)
        .then(cloudCodes => {
          if (cloudCodes && cloudCodes.length > 0) {
            setHistory(prev => {
              // Merge cloud codes with local items (unique by ID)
              const existingIds = new Set(prev.map(i => i.id));
              const newItems = cloudCodes.filter(c => !existingIds.has(c.id));
              const merged = [...prev, ...newItems].sort((a, b) => b.createdAt - a.createdAt);
              localStorage.setItem('qr_studio_history_v1', JSON.stringify(merged));
              return merged;
            });
            showToast(`Synced ${cloudCodes.length} cloud QR codes`);
          }
        })
        .catch(err => {
          console.warn('Could not fetch cloud QR codes:', err);
        });
    }
  }, [user]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Restore item from History
  const handleRestoreFromHistory = (item: QRItemHistory) => {
    setInitialPayload(item.payload);
    setInitialType(item.type);
    setInitialDesign(item.design || DEFAULT_DESIGN);
    setGeneratorKey(prev => prev + 1);
    setActiveTab('generator');
    showToast(`Loaded "${item.title}" into Studio`);
  };

  // Restore item from Scanner
  const handleRestoreFromScanner = (payload: string, type: QRDataType) => {
    setInitialPayload(payload);
    setInitialType(type);
    setInitialDesign(DEFAULT_DESIGN);
    setGeneratorKey(prev => prev + 1);
    setActiveTab('generator');
    showToast(`Loaded scanned ${type.toUpperCase()} data into Studio`);
  };

  const handleScrollToPresets = () => {
    const el = document.getElementById('customization-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col font-sans antialiased selection:bg-[#A78BFA] selection:text-[#0F1020] overflow-x-hidden transition-colors duration-200 ${
      theme === 'dark' ? 'dark bg-[#0F1020] text-[#F1F5F9]' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {/* Subtle Ambient Aurora Background Gradient Blurs */}
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden opacity-50 dark:opacity-30">
        <div className="absolute -top-[15%] left-[20%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#A78BFA]/35 via-[#60A5FA]/25 to-transparent blur-3xl animate-pulse" />
        <div className="absolute top-[35%] -right-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-[#60A5FA]/30 via-[#67E8F9]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-[10%] left-[10%] h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-[#67E8F9]/30 via-[#A78BFA]/20 to-transparent blur-3xl" />
      </div>

      {/* Floating Animated Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="fixed top-16 right-4 z-50 flex items-center gap-2.5 rounded-2xl border border-[#30324F] bg-[#191B33]/95 backdrop-blur-md px-4 py-3 text-xs font-bold text-[#F1F5F9] shadow-2xl shadow-black/50"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#A78BFA] to-[#67E8F9] text-[#0F1020] shadow-xs">
              <Sparkles className="h-3 w-3 stroke-[2.5]" />
            </div>
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal />

      {/* Navigation with Theme Toggle and User Auth */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Area with Tab Transition */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'generator' && (
            <motion.div
              key="tab-generator"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {/* Aurora SaaS Hero Section */}
              <HeroSection
                onNavigateTab={setActiveTab}
                onScrollToPresets={handleScrollToPresets}
                historyCount={history.length}
              />

              <QRGenerator
                key={generatorKey}
                initialPayload={initialPayload}
                initialType={initialType}
                initialDesign={initialDesign}
                onHistoryUpdated={setHistory}
              />
            </motion.div>
          )}

          {activeTab === 'scanner' && (
            <motion.div
              key="tab-scanner"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <QRScanner onLoadIntoGenerator={handleRestoreFromScanner} />
            </motion.div>
          )}

          {activeTab === 'bulk' && (
            <motion.div
              key="tab-bulk"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <BulkGenerator design={initialDesign} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="tab-history"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <QRHistory
                history={history}
                onHistoryUpdated={setHistory}
                onRestoreItem={handleRestoreFromHistory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Trust & Privacy Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-[#30324F] bg-white/70 dark:bg-[#0F1020]/90 backdrop-blur-md py-6 transition-colors">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 dark:text-[#A1A1C2] sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-[#34D399]" />
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">100% Client-Side Privacy:</span>
            <span>Your QR data and Wi-Fi passwords are computed exclusively on your device. Zero cloud storage or tracking.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-400 dark:text-[#A1A1C2]/70">QR Studio • Aurora AI Vector & High-Res Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
