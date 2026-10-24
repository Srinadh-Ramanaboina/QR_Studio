import React from 'react';
import { MessageSquare, Sparkles, Phone } from 'lucide-react';
import { SmsData } from '../../../types/qr';

interface SmsFormProps {
  data: SmsData;
  onChange: (data: SmsData) => void;
}

export const SmsForm: React.FC<SmsFormProps> = ({ data, onChange }) => {
  const quickTemplates = [
    'RSVP YES',
    'JOIN VIP',
    'INFO PLEASE',
    'START',
    'CONFIRM #123'
  ];

  return (
    <div className="space-y-4">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <MessageSquare className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label htmlFor="sms-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              SMS Text Message
            </label>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]">
          Direct SMS App Launch
        </span>
      </div>

      {/* Phone Number Input */}
      <div>
        <label htmlFor="sms-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Recipient Phone Number *
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100" />
          <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-1.5 shadow-xs transition-colors">
            <Phone className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
            <input
              id="sms-phone"
              type="tel"
              value={data.phone}
              onChange={e => onChange({ ...data, phone: e.target.value })}
              placeholder="e.g. +1 (555) 012-3456"
              className="w-full bg-transparent py-1.5 text-sm font-semibold font-mono text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Pre-filled Message */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="sms-body" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
            Pre-filled Message Body
          </label>
          <span className="text-[11px] font-mono text-slate-400 dark:text-[#A1A1C2]">
            {data.message.length} chars
          </span>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
          <textarea
            id="sms-body"
            rows={3}
            value={data.message}
            onChange={e => onChange({ ...data, message: e.target.value })}
            placeholder="e.g. Please send me the menu and coupon code!"
            className="relative w-full rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-3 text-sm font-medium text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
          />
        </div>

        {/* Quick keywords chips */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {quickTemplates.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => onChange({ ...data, message: tag })}
              className="rounded-lg border border-slate-200 dark:border-[#30324F] bg-slate-100/70 dark:bg-[#202341] px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-[#F1F5F9] hover:border-[#A78BFA] hover:text-[#A78BFA] transition-all"
            >
              {tag}
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
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">Instant Text Dispatch: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Scanning opens the device's native SMS Messages app with both recipient and message drafted, ready for the user to hit Send.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
