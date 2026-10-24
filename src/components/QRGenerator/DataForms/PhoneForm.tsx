import React from 'react';
import { PhoneCall, Sparkles, Phone, ShieldCheck } from 'lucide-react';

interface PhoneFormProps {
  phone: string;
  onChange: (val: string) => void;
}

export const PhoneForm: React.FC<PhoneFormProps> = ({ phone, onChange }) => {
  const countryPresets = [
    { label: '+1 (US/CA)', code: '+1 ' },
    { label: '+44 (UK)', code: '+44 ' },
    { label: '+49 (DE)', code: '+49 ' },
    { label: '+91 (IN)', code: '+91 ' },
    { label: '+81 (JP)', code: '+81 ' },
    { label: '+61 (AU)', code: '+61 ' }
  ];

  const handleCountryPrefix = (code: string) => {
    // If phone starts with a +, replace it or prepend
    if (!phone) {
      onChange(code);
    } else if (phone.startsWith('+')) {
      const parts = phone.split(' ');
      parts[0] = code.trim();
      onChange(parts.join(' '));
    } else {
      onChange(`${code}${phone}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <PhoneCall className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label htmlFor="phone-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Instant Direct Phone Call
            </label>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]">
          One-Tap Dial
        </span>
      </div>

      {/* Main Phone Input */}
      <div>
        <label htmlFor="phone-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Phone Number with Country Code *
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100" />
          <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-1.5 shadow-xs transition-colors">
            <Phone className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
            <input
              id="phone-input"
              type="tel"
              value={phone}
              onChange={e => onChange(e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full bg-transparent py-1.5 text-sm font-semibold font-mono text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Country Code Quick Helpers */}
      <div>
        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Country Prefix Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          {countryPresets.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => handleCountryPrefix(c.code)}
              className="rounded-lg border border-slate-200 dark:border-[#30324F] bg-slate-100/70 dark:bg-[#202341] px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-[#F1F5F9] hover:border-[#A78BFA] hover:text-[#A78BFA] transition-all"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aurora Helper HUD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#191B33]/80 p-3.5 backdrop-blur-md">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">Instant Phone Dialer: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Scanning prompts the user with: <strong className="text-slate-700 dark:text-[#67E8F9]">"Call {phone || '...'}?"</strong>. Always include the international code prefix (+1, +44, etc.) for seamless connection anywhere in the world.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
