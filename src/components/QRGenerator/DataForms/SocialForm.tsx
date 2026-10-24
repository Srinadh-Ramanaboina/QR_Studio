import React from 'react';
import { Share2, Sparkles, ExternalLink } from 'lucide-react';
import { SocialData } from '../../../types/qr';

interface SocialFormProps {
  data: SocialData;
  onChange: (data: SocialData) => void;
}

export const SocialForm: React.FC<SocialFormProps> = ({ data, onChange }) => {
  const platforms: { id: SocialData['platform']; label: string; prefix: string; placeholder: string }[] = [
    { id: 'instagram', label: 'Instagram', prefix: 'instagram.com/', placeholder: 'username' },
    { id: 'x', label: 'X (Twitter)', prefix: 'x.com/', placeholder: 'handle' },
    { id: 'linkedin', label: 'LinkedIn', prefix: 'linkedin.com/in/', placeholder: 'profile-slug' },
    { id: 'youtube', label: 'YouTube', prefix: 'youtube.com/@', placeholder: 'channel' },
    { id: 'whatsapp', label: 'WhatsApp', prefix: 'wa.me/', placeholder: '+15551234567' },
    { id: 'github', label: 'GitHub', prefix: 'github.com/', placeholder: 'username' },
    { id: 'tiktok', label: 'TikTok', prefix: 'tiktok.com/@', placeholder: 'username' },
    { id: 'spotify', label: 'Spotify', prefix: 'spotify.com/user/', placeholder: 'username' }
  ];

  const current = platforms.find(p => p.id === data.platform) || platforms[0];

  return (
    <div className="space-y-4">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <Share2 className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label htmlFor="social-username" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Social Media Profile Link
            </label>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]">
          Direct App Deep Link
        </span>
      </div>

      {/* Platform Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Choose Platform
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {platforms.map(p => {
            const isSelected = data.platform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ ...data, platform: p.id })}
                className={`rounded-xl border p-2.5 text-xs font-bold transition-all text-left ${
                  isSelected
                    ? 'border-[#A78BFA] bg-indigo-50/70 dark:bg-[#202341] text-indigo-950 dark:text-[#F1F5F9] shadow-sm ring-1 ring-[#A78BFA]/40'
                    : 'border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] text-slate-700 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]/60'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Username / Handle Input */}
      <div>
        <label htmlFor="social-username" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          {current.label} Username or Handle *
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100" />
          <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-1.5 shadow-xs transition-colors">
            <span className="font-mono text-xs text-indigo-600 dark:text-[#A78BFA] font-bold select-none pr-1">
              {current.prefix}
            </span>
            <input
              id="social-username"
              type="text"
              value={data.username}
              onChange={e => onChange({ ...data, username: e.target.value.replace(/^@/, '') })}
              placeholder={current.placeholder}
              className="w-full bg-transparent py-1.5 text-sm font-semibold font-mono text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Aurora Helper HUD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#191B33]/80 p-3.5 backdrop-blur-md">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">Native Profile Routing: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Generates a universal web link <strong className="text-slate-700 dark:text-[#67E8F9]">https://{current.prefix}{data.username || '...'}</strong> that automatically opens inside the native app (Instagram, TikTok, YouTube, etc.) with fallbacks for mobile browsers.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
