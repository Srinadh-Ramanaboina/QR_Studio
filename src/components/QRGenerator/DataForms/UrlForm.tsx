import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  Lock,
  Unlock,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
  Clipboard,
  X,
  Zap,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatUrl } from '../../../utils/qrPayloads';

interface UrlFormProps {
  url: string;
  onChange: (val: string) => void;
}

interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  content: string;
}

export const UrlForm: React.FC<UrlFormProps> = ({ url, onChange }) => {
  const [showUtmBuilder, setShowUtmBuilder] = useState(false);
  const [copied, setCopied] = useState(false);
  const [utm, setUtm] = useState<UtmParams>({
    source: '',
    medium: '',
    campaign: '',
    content: ''
  });

  // Extract protocol and domain/path from the incoming URL
  const { protocol, pathAndQuery } = useMemo(() => {
    const trimmed = (url || '').trim();
    if (trimmed.startsWith('http://')) {
      return { protocol: 'http://', pathAndQuery: trimmed.slice(7) };
    }
    if (trimmed.startsWith('https://')) {
      return { protocol: 'https://', pathAndQuery: trimmed.slice(8) };
    }
    return { protocol: 'https://', pathAndQuery: trimmed };
  }, [url]);

  const isHttps = protocol === 'https://';
  const formatted = formatUrl(url);

  const quickPresets = [
    { label: 'www.', value: 'www.' },
    { label: 'GitHub', value: 'github.com/' },
    { label: 'LinkedIn', value: 'linkedin.com/in/' },
    { label: 'X (Twitter)', value: 'x.com/' },
    { label: 'Linktree', value: 'linktr.ee/' },
    { label: 'Cal.com', value: 'cal.com/' }
  ];

  const utmTemplates = [
    { name: 'Print Poster', source: 'poster', medium: 'print', campaign: 'store-display' },
    { name: 'Business Card', source: 'business-card', medium: 'offline', campaign: 'networking' },
    { name: 'Packaging', source: 'product-packaging', medium: 'physical', campaign: 'unboxing' },
    { name: 'Event Booth', source: 'conference', medium: 'booth-qr', campaign: 'expo' }
  ];

  // Sync UTM state from current URL
  useEffect(() => {
    try {
      if (!url) {
        setUtm({ source: '', medium: '', campaign: '', content: '' });
        return;
      }
      const parsedUrl = new URL(formatUrl(url));
      setUtm({
        source: parsedUrl.searchParams.get('utm_source') || '',
        medium: parsedUrl.searchParams.get('utm_medium') || '',
        campaign: parsedUrl.searchParams.get('utm_campaign') || '',
        content: parsedUrl.searchParams.get('utm_content') || ''
      });
    } catch {
      // Ignore URL parsing errors while user is typing
    }
  }, [url]);

  // Protocol toggle handler
  const handleToggleProtocol = () => {
    const nextProtocol = isHttps ? 'http://' : 'https://';
    onChange(`${nextProtocol}${pathAndQuery}`);
  };

  // Main input change handler (handles typing, pasting with protocol, etc.)
  const handleInputChange = (rawVal: string) => {
    let text = rawVal.trimStart();
    let detectedProtocol = protocol;

    if (text.startsWith('http://')) {
      detectedProtocol = 'http://';
      text = text.slice(7);
    } else if (text.startsWith('https://')) {
      detectedProtocol = 'https://';
      text = text.slice(8);
    }

    if (!text) {
      onChange('');
    } else {
      onChange(`${detectedProtocol}${text}`);
    }
  };

  // Paste from clipboard handler
  const handlePaste = async () => {
    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) handleInputChange(text);
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  // Copy live link to clipboard
  const handleCopy = async () => {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Preset chip click handler
  const handleApplyPreset = (presetValue: string) => {
    if (presetValue === 'www.') {
      if (!pathAndQuery.startsWith('www.')) {
        onChange(`${protocol}www.${pathAndQuery}`);
      }
    } else {
      onChange(`${protocol}${presetValue}`);
    }
  };

  // UTM parameters updating
  const handleUtmChange = (field: keyof UtmParams, value: string) => {
    const updated = { ...utm, [field]: value };
    setUtm(updated);
    applyUtmToUrl(updated);
  };

  const applyUtmTemplate = (template: typeof utmTemplates[0]) => {
    const updated: UtmParams = {
      source: template.source,
      medium: template.medium,
      campaign: template.campaign,
      content: utm.content
    };
    setUtm(updated);
    applyUtmToUrl(updated);
  };

  const clearUtm = () => {
    const reset = { source: '', medium: '', campaign: '', content: '' };
    setUtm(reset);
    applyUtmToUrl(reset);
  };

  const applyUtmToUrl = (params: UtmParams) => {
    try {
      const base = pathAndQuery.split('?')[0] || 'example.com';
      const urlObj = new URL(`${protocol}${base}`);

      if (params.source) urlObj.searchParams.set('utm_source', params.source);
      if (params.medium) urlObj.searchParams.set('utm_medium', params.medium);
      if (params.campaign) urlObj.searchParams.set('utm_campaign', params.campaign);
      if (params.content) urlObj.searchParams.set('utm_content', params.content);

      onChange(urlObj.toString());
    } catch {
      // Fallback
    }
  };

  // Extract hostname for live HUD
  let hostname = '';
  try {
    if (formatted) {
      hostname = new URL(formatted).hostname;
    }
  } catch {
    hostname = pathAndQuery.split('/')[0] || url;
  }

  // QR Density / scan speed calculation
  const charLength = (formatted || '').length;
  const isHighDensity = charLength > 120;
  const isOptimalDensity = charLength > 0 && charLength <= 55;

  return (
    <div className="space-y-5">
      {/* Aurora Header / Mode Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <Globe className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label htmlFor="url-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Destination Website / URL
            </label>
          </div>
        </div>

        {/* Security & Protocol Badge */}
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              isHttps
                ? 'border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]'
                : 'border-[#FBBF24]/40 bg-[#FBBF24]/10 text-[#FBBF24]'
            }`}
          >
            {isHttps ? (
              <>
                <ShieldCheck className="h-3 w-3" />
                <span>HTTPS Encrypted</span>
              </>
            ) : (
              <>
                <Unlock className="h-3 w-3" />
                <span>HTTP Standard</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Main Aurora URL Input Box */}
      <div className="relative group">
        {/* Subtle Aurora Ambient Glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100 group-focus-within:from-[#A78BFA] group-focus-within:via-[#60A5FA] group-focus-within:to-[#67E8F9]" />

        <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-1.5 shadow-xs transition-colors">
          {/* Protocol Toggle Button */}
          <button
            type="button"
            onClick={handleToggleProtocol}
            title={`Click to switch to ${isHttps ? 'http://' : 'https://'}`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#30324F] bg-slate-100 dark:bg-[#202341] px-3 py-2 text-xs font-mono font-semibold text-slate-700 dark:text-[#F1F5F9] hover:bg-slate-200 dark:hover:bg-[#202341]/80 hover:border-[#A78BFA] transition-all cursor-pointer select-none"
          >
            {isHttps ? (
              <Lock className="h-3.5 w-3.5 text-[#34D399]" />
            ) : (
              <Unlock className="h-3.5 w-3.5 text-[#FBBF24]" />
            )}
            <span>{protocol}</span>
          </button>

          {/* Core URL Domain & Path Input */}
          <input
            id="url-input"
            type="text"
            value={pathAndQuery}
            onChange={e => handleInputChange(e.target.value)}
            placeholder="example.com/landing or domain.org"
            className="w-full border-0 bg-transparent px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#A1A1C2]/60 focus:outline-hidden"
          />

          {/* Quick Actions (Paste / Clear) */}
          <div className="flex items-center gap-1 pr-1">
            {!pathAndQuery && (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="flex items-center gap-1 rounded-xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50 dark:bg-[#202341] px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-[#A1A1C2] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:border-[#60A5FA] transition-all cursor-pointer"
              >
                <Clipboard className="h-3 w-3 text-[#60A5FA]" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            )}

            {pathAndQuery && (
              <button
                type="button"
                onClick={() => onChange('')}
                title="Clear input"
                className="rounded-xl p-1.5 text-slate-400 dark:text-[#A1A1C2] hover:bg-slate-100 dark:hover:bg-[#202341] hover:text-slate-700 dark:hover:text-[#F1F5F9] transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Aurora Quick Presets / Platforms */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-[#A1A1C2] flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-[#A78BFA]" />
            Quick Presets & Platforms
          </span>
          <button
            type="button"
            onClick={() => setShowUtmBuilder(!showUtmBuilder)}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-[#A78BFA] hover:text-indigo-500 dark:hover:text-[#67E8F9] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>{showUtmBuilder ? 'Hide Campaign Builder' : 'UTM / Campaign Builder'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {quickPresets.map(preset => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleApplyPreset(preset.value)}
              className="rounded-xl border border-slate-200 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#202341]/80 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-[#A1A1C2] hover:border-[#A78BFA] hover:text-indigo-600 dark:hover:text-[#F1F5F9] hover:bg-white dark:hover:bg-[#202341] hover:shadow-[0_0_12px_rgba(167,139,250,0.18)] transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable UTM / Campaign Parameter Builder */}
      <AnimatePresence>
        {showUtmBuilder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-[#30324F] bg-slate-50/90 dark:bg-[#15162B] p-4 space-y-3.5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-[#30324F] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#A78BFA] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-[#F1F5F9]">
                    Campaign & UTM Tagging
                  </span>
                  <span className="rounded-md bg-[#A78BFA]/10 border border-[#A78BFA]/30 px-1.5 py-0.5 text-[10px] font-semibold text-[#A78BFA]">
                    Analytics Ready
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearUtm}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-[#A1A1C2] hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset Tags
                  </button>
                </div>
              </div>

              {/* UTM Quick Templates */}
              <div>
                <span className="text-[11px] text-slate-500 dark:text-[#A1A1C2]">One-click campaign templates:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {utmTemplates.map(tmpl => (
                    <button
                      key={tmpl.name}
                      type="button"
                      onClick={() => applyUtmTemplate(tmpl)}
                      className="rounded-lg border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-[#A1A1C2] hover:border-[#67E8F9] hover:text-[#67E8F9] transition-all cursor-pointer"
                    >
                      + {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* UTM Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#A1A1C2] mb-1">
                    utm_source <span className="text-rose-400">*</span> (e.g. poster, flyer)
                  </label>
                  <input
                    type="text"
                    value={utm.source}
                    onChange={e => handleUtmChange('source', e.target.value)}
                    placeholder="e.g. store-banner"
                    className="w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] px-3 py-1.5 text-xs text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#A1A1C2]/50 focus:border-[#A78BFA] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#A1A1C2] mb-1">
                    utm_medium <span className="text-rose-400">*</span> (e.g. qr, print)
                  </label>
                  <input
                    type="text"
                    value={utm.medium}
                    onChange={e => handleUtmChange('medium', e.target.value)}
                    placeholder="e.g. qr-code"
                    className="w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] px-3 py-1.5 text-xs text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#A1A1C2]/50 focus:border-[#60A5FA] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#A1A1C2] mb-1">
                    utm_campaign (e.g. spring-sale)
                  </label>
                  <input
                    type="text"
                    value={utm.campaign}
                    onChange={e => handleUtmChange('campaign', e.target.value)}
                    placeholder="e.g. launch-2026"
                    className="w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] px-3 py-1.5 text-xs text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#A1A1C2]/50 focus:border-[#67E8F9] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#A1A1C2] mb-1">
                    utm_content (e.g. logo-variant)
                  </label>
                  <input
                    type="text"
                    value={utm.content}
                    onChange={e => handleUtmChange('content', e.target.value)}
                    placeholder="e.g. front-counter"
                    className="w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] px-3 py-1.5 text-xs text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#A1A1C2]/50 focus:border-[#A78BFA] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Aurora Destination & Scannability HUD Card */}
      {formatted && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-[#30324F] bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#15162B] dark:via-[#191B33] dark:to-[#15162B] p-3.5 shadow-sm space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#67E8F9] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#67E8F9]" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-[#A1A1C2]">
                Target Destination:
              </span>
              {hostname && (
                <span className="rounded-md bg-slate-200/70 dark:bg-[#202341] border border-slate-300/60 dark:border-[#30324F] px-2 py-0.5 text-xs font-mono font-bold text-slate-800 dark:text-[#F1F5F9] truncate max-w-[180px] sm:max-w-[240px]">
                  {hostname}
                </span>
              )}
            </div>

            {/* Scannability Rating Meter */}
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                  isOptimalDensity
                    ? 'border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]'
                    : isHighDensity
                    ? 'border-[#FBBF24]/40 bg-[#FBBF24]/10 text-[#FBBF24]'
                    : 'border-[#60A5FA]/40 bg-[#60A5FA]/10 text-[#60A5FA]'
                }`}
              >
                <Zap className="h-2.5 w-2.5" />
                {isOptimalDensity
                  ? `Lightning Fast (${charLength} chars)`
                  : isHighDensity
                  ? `High Density (${charLength} chars)`
                  : `Optimal (${charLength} chars)`}
              </span>
            </div>
          </div>

          {/* Formatted URL String Display & Quick Actions */}
          <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-100/80 dark:bg-[#0F1020]/80 border border-slate-200 dark:border-[#30324F] px-3 py-2 text-xs">
            <span className="truncate font-mono text-[11px] text-slate-700 dark:text-[#F1F5F9] max-w-[260px] sm:max-w-[360px]">
              {formatted}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                title="Copy URL"
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-slate-600 dark:text-[#A1A1C2] hover:bg-slate-200 dark:hover:bg-[#202341] hover:text-slate-900 dark:hover:text-[#F1F5F9] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-[#34D399]" />
                    <span className="text-[11px] font-semibold text-[#34D399]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="text-[11px] hidden sm:inline">Copy</span>
                  </>
                )}
              </button>

              <a
                href={formatted}
                target="_blank"
                rel="noopener noreferrer"
                title="Open destination in new tab"
                className="flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-indigo-600 dark:text-[#A78BFA] hover:bg-indigo-50 dark:hover:bg-[#202341] transition-colors cursor-pointer"
              >
                <span className="text-[11px]">Visit</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
