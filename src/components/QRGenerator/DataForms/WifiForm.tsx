import React, { useState } from 'react';
import { Wifi, Eye, EyeOff, ShieldCheck, Lock, Unlock, Sparkles, Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { WifiData } from '../../../types/qr';

interface WifiFormProps {
  data: WifiData;
  onChange: (data: WifiData) => void;
}

export const WifiForm: React.FC<WifiFormProps> = ({ data, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (patch: Partial<WifiData>) => {
    onChange({ ...data, ...patch });
  };

  const encTypes: { id: WifiData['encryption']; label: string; desc: string }[] = [
    { id: 'WPA', label: 'WPA / WPA2 / WPA3', desc: 'Standard secure' },
    { id: 'WEP', label: 'WEP Legacy', desc: 'Older networks' },
    { id: 'nopass', label: 'Open Network', desc: 'No password' }
  ];

  const handleCopySSID = () => {
    if (!data.ssid) return;
    navigator.clipboard.writeText(data.ssid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <Wifi className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label htmlFor="wifi-ssid" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Wi-Fi Network Configuration
            </label>
          </div>
        </div>

        {/* Security Badge */}
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
            data.encryption === 'nopass'
              ? 'border-[#FBBF24]/40 bg-[#FBBF24]/10 text-[#FBBF24]'
              : 'border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]'
          }`}
        >
          {data.encryption === 'nopass' ? (
            <>
              <Unlock className="h-3 w-3" />
              <span>Open Network</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3 w-3" />
              <span>{data.encryption} Protected</span>
            </>
          )}
        </span>
      </div>

      {/* Network Name (SSID) Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="wifi-ssid" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
            Network Name (SSID) *
          </label>
          {data.ssid && (
            <button
              type="button"
              onClick={handleCopySSID}
              className="text-[11px] font-medium text-indigo-600 dark:text-[#A78BFA] hover:underline flex items-center gap-1"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy SSID'}</span>
            </button>
          )}
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100 group-focus-within:from-[#A78BFA] group-focus-within:via-[#60A5FA] group-focus-within:to-[#67E8F9]" />
          <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-1.5 shadow-xs transition-colors">
            <Wifi className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
            <input
              id="wifi-ssid"
              type="text"
              value={data.ssid}
              onChange={e => update({ ssid: e.target.value })}
              placeholder="e.g. CoffeeHouse_Guest_5G or Office-WiFi"
              className="w-full bg-transparent py-1.5 text-sm font-medium text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Security / Encryption Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Security Protocol
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {encTypes.map(opt => {
            const isSelected = data.encryption === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => update({ encryption: opt.id })}
                className={`flex flex-col text-left rounded-xl p-3 border transition-all ${
                  isSelected
                    ? 'border-[#A78BFA] bg-indigo-50/70 dark:bg-[#202341] text-indigo-950 dark:text-[#F1F5F9] shadow-sm ring-1 ring-[#A78BFA]/40'
                    : 'border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] text-slate-700 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]/60'
                }`}
              >
                <span className="text-xs font-bold">{opt.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-[#A1A1C2]/70 mt-0.5">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Password Field (conditionally rendered for secured networks) */}
      {data.encryption !== 'nopass' && (
        <div>
          <label htmlFor="wifi-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
            Network Password *
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100 group-focus-within:from-[#A78BFA] group-focus-within:via-[#60A5FA] group-focus-within:to-[#67E8F9]" />
            <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-1.5 shadow-xs transition-colors">
              <Lock className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
              <input
                id="wifi-password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={e => update({ password: e.target.value })}
                placeholder="Enter password..."
                className="w-full bg-transparent py-1.5 text-sm font-medium font-mono text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="ml-2 rounded-lg p-1 text-slate-400 dark:text-[#A1A1C2] hover:bg-slate-100 dark:hover:bg-[#202341] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden SSID Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200/90 dark:border-[#30324F] bg-slate-50/70 dark:bg-[#15162B] p-3 transition-colors">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-[#F1F5F9]">Hidden Network (Unbroadcast SSID)</span>
          <p className="text-[11px] text-slate-500 dark:text-[#A1A1C2]">Enable if this network does not announce its SSID publicly.</p>
        </div>
        <input
          type="checkbox"
          id="wifi-hidden"
          checked={data.hidden}
          onChange={e => update({ hidden: e.target.checked })}
          className="h-4 w-4 rounded accent-[#A78BFA] cursor-pointer"
        />
      </div>

      {/* Aurora Helper HUD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#191B33]/80 p-3.5 backdrop-blur-md">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">Zero-Friction Guest Join: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Scanning on any iPhone, iPad, or Android prompts the user: <strong className="text-slate-700 dark:text-[#67E8F9]">"Join Network {data.ssid || '...'}"</strong> with instant one-tap connection.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
