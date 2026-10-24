import React from 'react';
import { AlignLeft, Sparkles, Copy, Trash2, Check } from 'lucide-react';

interface TextFormProps {
  text: string;
  onChange: (val: string) => void;
}

export const TextForm: React.FC<TextFormProps> = ({ text, onChange }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = text.length;
  const isHighDensity = charCount > 300;

  return (
    <div className="space-y-4">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <AlignLeft className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label htmlFor="text-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Plain Text / Raw Content
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full border ${
            isHighDensity
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
              : 'border-[#30324F] bg-slate-100 dark:bg-[#202341] text-slate-600 dark:text-[#A1A1C2]'
          }`}>
            {charCount} chars
          </span>
          {text && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea with Ambient Glow */}
      <div className="relative group">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100 group-focus-within:from-[#A78BFA] group-focus-within:via-[#60A5FA] group-focus-within:to-[#67E8F9]" />
        <div className="relative rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-3 shadow-xs transition-colors">
          <textarea
            id="text-input"
            rows={5}
            value={text}
            onChange={e => onChange(e.target.value)}
            placeholder="Type or paste any notes, instructions, crypto phrases, serial keys, or message..."
            className="w-full resize-y border-0 bg-transparent p-1 text-sm font-medium text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
          />

          <div className="mt-2 flex items-center justify-between border-t border-slate-100 dark:border-[#30324F]/70 pt-2 text-xs">
            <span className="text-[11px] text-slate-400 dark:text-[#A1A1C2]/80">
              Unicode & multilingual text fully supported.
            </span>
            {text && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-[#A78BFA] hover:underline"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scannability Note HUD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#191B33]/80 p-3.5 backdrop-blur-md">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">High-Speed Scanning: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Shorter text strings (under 120 characters) generate cleaner module grids, allowing phone cameras to read them at longer distances and in dim lighting.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
