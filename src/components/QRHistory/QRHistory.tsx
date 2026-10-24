import React, { useState } from 'react';
import {
  History,
  Trash2,
  Download,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileJson,
  Upload,
  Cloud,
  CheckCircle2,
  RefreshCw,
  LogIn
} from 'lucide-react';
import { QRItemHistory, QRDataType, QRDesignConfig } from '../../types/qr';
import { clearHistory, deleteHistoryItem, saveHistoryItem } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import { saveCloudQRCode, deleteCloudQRCode, fetchUserCloudQRCodes } from '../../services/firebase';

interface QRHistoryProps {
  history: QRItemHistory[];
  onHistoryUpdated: (updated: QRItemHistory[]) => void;
  onRestoreItem: (item: QRItemHistory) => void;
}

export const QRHistory: React.FC<QRHistoryProps> = ({
  history,
  onHistoryUpdated,
  onRestoreItem
}) => {
  const { user, openAuthModal } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDelete = async (id: string) => {
    const updated = deleteHistoryItem(id);
    onHistoryUpdated(updated);
    if (user) {
      try {
        await deleteCloudQRCode(user.uid, id);
      } catch (e) {
        console.warn('Could not delete from cloud:', e);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved QR codes from this device?')) {
      clearHistory();
      onHistoryUpdated([]);
    }
  };

  // Sync with Firestore Cloud
  const handleCloudSync = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    setIsSyncing(true);
    try {
      // 1. Upload local items to cloud
      for (const item of history) {
        await saveCloudQRCode(user.uid, item);
      }

      // 2. Fetch all cloud items
      const cloudCodes = await fetchUserCloudQRCodes(user.uid);
      if (cloudCodes && cloudCodes.length > 0) {
        // Merge with local storage
        localStorage.setItem('qr_studio_history_v1', JSON.stringify(cloudCodes));
        onHistoryUpdated(cloudCodes);
      }
    } catch (err) {
      console.error('Cloud sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Export JSON backup
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `qr-studio-history-${Date.now()}.json`);
    dl.click();
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (Array.isArray(parsed)) {
            localStorage.setItem('qr_studio_history_v1', JSON.stringify(parsed));
            onHistoryUpdated(parsed);
          }
        } catch {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F1F5F9] sm:text-3xl">
            Saved QR Codes & History
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#A1A1C2]">
            Stored locally on your browser and synced with your secure account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              type="button"
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 rounded-xl border border-[#34D399]/40 bg-[#34D399]/10 px-3 py-2 text-xs font-semibold text-[#34D399] hover:bg-[#34D399]/20 transition-all shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync with Cloud'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="flex items-center gap-1.5 rounded-xl border border-[#A78BFA]/50 bg-[#191B33] px-3.5 py-2 text-xs font-bold text-[#F1F5F9] hover:border-[#A78BFA] hover:shadow-md hover:shadow-[#A78BFA]/20 transition-all shadow-xs"
            >
              <Cloud className="h-3.5 w-3.5 text-[#67E8F9]" />
              <span>Enable Cloud Backup</span>
            </button>
          )}

          {history.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#202341] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-[#F1F5F9] hover:bg-slate-50 dark:hover:bg-[#202341]/80 shadow-xs"
              >
                <FileJson className="h-3.5 w-3.5 text-indigo-600 dark:text-[#A78BFA]" />
                <span>Backup</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/70 shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cloud Account Status Banner */}
      {user ? (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-[#15162B] p-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-[#34D399]">
              <Cloud className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-900 dark:text-[#F1F5F9]">
                Cloud Account Connected
              </span>
              <p className="text-emerald-700 dark:text-[#A1A1C2]">
                Signed in as <strong className="text-slate-800 dark:text-[#67E8F9]">{user.email}</strong>. Your QR codes sync across your devices.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-[#202341] px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-[#34D399]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Active</span>
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-[#30324F] bg-gradient-to-r from-indigo-50/50 via-slate-50 to-indigo-50/30 dark:from-[#191B33] dark:via-[#15162B] dark:to-[#191B33] p-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
              <Sparkles className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-[#F1F5F9]">
                Backup & Sync With Your Free Account
              </span>
              <p className="text-slate-500 dark:text-[#A1A1C2]">
                Sign in with Google to preserve your saved QR designs, logo configurations, and custom frames forever.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openAuthModal}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] px-3.5 py-1.5 text-xs font-bold text-[#0F1020] hover:brightness-105 transition-all shadow-xs"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* History Grid */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-[#30324F] bg-white dark:bg-[#191B33] p-12 text-center shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-[#202341] text-indigo-600 dark:text-[#A78BFA] mb-3">
            <History className="h-8 w-8" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-[#F1F5F9]">No saved QR codes yet</h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-[#A1A1C2] max-w-sm">
            Generate and customize any QR code in the Generator tab, then click "Save" to keep it stored here.
          </p>
          <div className="mt-4 flex gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#202341] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-[#F1F5F9] hover:bg-slate-50 dark:hover:bg-[#202341]/80">
              <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-[#A78BFA]" />
              <span>Import JSON Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {history.map(item => (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] p-4 shadow-xs transition-all hover:border-[#A78BFA] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 dark:bg-[#202341] px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:text-[#A78BFA] uppercase">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-[#A1A1C2]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Thumbnail Preview */}
                <div className="my-3 flex justify-center">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-36 w-36 rounded-xl object-contain border border-slate-100 dark:border-[#30324F] bg-white p-1"
                    />
                  ) : (
                    <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-slate-50 dark:bg-[#15162B] text-slate-300 dark:text-slate-600">
                      <History className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] line-clamp-1">
                  {item.title}
                </h4>
                <p className="mt-0.5 font-mono text-[10px] text-slate-400 dark:text-[#A1A1C2] line-clamp-1 break-all">
                  {item.payload}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-[#30324F] pt-3">
                <button
                  type="button"
                  onClick={() => onRestoreItem(item)}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-[#202341] px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-[#A78BFA] hover:bg-indigo-100 dark:hover:bg-[#202341]/80 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Load in Studio</span>
                </button>

                <div className="flex items-center gap-1">
                  {item.thumbnail && (
                    <a
                      href={item.thumbnail}
                      download={`qr-${item.title.replace(/[^a-z0-9_-]/gi, '_')}.png`}
                      aria-label="Download QR"
                      className="rounded-lg p-1.5 text-slate-400 dark:text-[#A1A1C2] hover:bg-slate-100 dark:hover:bg-[#202341] hover:text-slate-700 dark:hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label="Delete saved QR"
                    className="rounded-lg p-1.5 text-slate-400 dark:text-[#A1A1C2] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
