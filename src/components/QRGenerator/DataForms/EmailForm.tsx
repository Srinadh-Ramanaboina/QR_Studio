import React from 'react';
import { Mail, Sparkles, Send, AtSign, FileText } from 'lucide-react';
import { EmailData } from '../../../types/qr';

interface EmailFormProps {
  data: EmailData;
  onChange: (data: EmailData) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ data, onChange }) => {
  const update = (patch: Partial<EmailData>) => {
    onChange({ ...data, ...patch });
  };

  const subjectPresets = [
    'General Inquiry',
    'Customer Support',
    'Quote Request',
    'Feedback & Suggestions',
    'Partnership'
  ];

  return (
    <div className="space-y-4">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <Mail className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label htmlFor="email-to" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Pre-Composed Email
            </label>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]">
          Mailto Client Ready
        </span>
      </div>

      {/* Recipient Field */}
      <div>
        <label htmlFor="email-to" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Recipient Email Address *
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100" />
          <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-1.5 shadow-xs transition-colors">
            <AtSign className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
            <input
              id="email-to"
              type="email"
              value={data.to}
              onChange={e => update({ to: e.target.value })}
              placeholder="contact@yourdomain.com"
              className="w-full bg-transparent py-1 text-sm font-medium text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Subject Line & Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="email-subject" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
            Subject Line
          </label>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
          <input
            id="email-subject"
            type="text"
            value={data.subject}
            onChange={e => update({ subject: e.target.value })}
            placeholder="e.g. Project Inquiry"
            className="relative w-full rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
          />
        </div>

        {/* Quick Presets */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {subjectPresets.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => update({ subject: preset })}
              className="rounded-lg border border-slate-200 dark:border-[#30324F] bg-slate-100/70 dark:bg-[#202341] px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-[#A1A1C2] hover:border-[#A78BFA] hover:text-[#A78BFA] transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Email Body */}
      <div>
        <label htmlFor="email-body" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Pre-filled Message Body
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
          <textarea
            id="email-body"
            rows={4}
            value={data.body}
            onChange={e => update({ body: e.target.value })}
            placeholder="Hello team, I would like to..."
            className="relative w-full rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-3 text-sm font-medium text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Aurora Helper HUD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#191B33]/80 p-3.5 backdrop-blur-md">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">Native Mail App Launch: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Scanning automatically opens Apple Mail, Gmail, or Outlook with the recipient and subject pre-populated.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
