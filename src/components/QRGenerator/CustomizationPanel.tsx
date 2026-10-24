import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Shapes,
  Maximize2,
  Image as ImageIcon,
  SquareCheck,
  Sparkles,
  Sliders,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import {
  QRDesignConfig,
  DotType,
  CornerSquareType,
  CornerDotType,
  FrameType,
  ErrorCorrectionLevel
} from '../../types/qr';
import { STYLE_PRESETS, POPULAR_LOGOS, svgToDataUri } from '../../utils/qrPresets';
import { evaluateScannability } from '../../utils/contrast';

interface CustomizationPanelProps {
  design: QRDesignConfig;
  onChange: (patch: Partial<QRDesignConfig>) => void;
  onApplyPreset: (presetDesign: Partial<QRDesignConfig>) => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  design,
  onChange,
  onApplyPreset
}) => {
  const [activeSection, setActiveSection] = useState<'presets' | 'style' | 'colors' | 'logo' | 'frame' | 'advanced'>('presets');

  const scannability = evaluateScannability(
    design.gradient.type !== 'none' ? design.gradient.color1 : design.foregroundColor,
    design.backgroundColor,
    design.errorCorrectionLevel,
    Boolean(design.logoUrl)
  );

  const dotTypes: { id: DotType; label: string }[] = [
    { id: 'rounded', label: 'Rounded' },
    { id: 'extra-rounded', label: 'Extra Soft' },
    { id: 'dots', label: 'Dots / Circles' },
    { id: 'classy', label: 'Classy' },
    { id: 'classy-rounded', label: 'Smooth Classy' },
    { id: 'square', label: 'Sharp Square' }
  ];

  const cornerSquareTypes: { id: CornerSquareType; label: string }[] = [
    { id: 'extra-rounded', label: 'Soft Pill' },
    { id: 'square', label: 'Square' },
    { id: 'dot', label: 'Circle' }
  ];

  const cornerDotTypes: { id: CornerDotType; label: string }[] = [
    { id: 'dot', label: 'Circle' },
    { id: 'square', label: 'Square' }
  ];

  const frameTypes: { id: FrameType; label: string }[] = [
    { id: 'none', label: 'No Frame' },
    { id: 'bottom-badge', label: 'Bottom "SCAN ME"' },
    { id: 'top-badge', label: 'Top Header' },
    { id: 'rounded-card', label: 'Card Border' },
    { id: 'phone-frame', label: 'Modern Phone' },
    { id: 'minimal-border', label: 'Minimal Edge' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose a smaller logo image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          onChange({
            logoUrl: event.target.result as string,
            errorCorrectionLevel: 'H'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const navSections = [
    { id: 'presets', label: 'Presets', icon: Sparkles },
    { id: 'style', label: 'Dots & Eyes', icon: Shapes },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'logo', label: 'Logo', icon: ImageIcon },
    { id: 'frame', label: 'Frame & CTA', icon: SquareCheck },
    { id: 'advanced', label: 'Quality', icon: Sliders }
  ];

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-[#30324F] bg-white/90 dark:bg-[#191B33]/90 backdrop-blur-xl p-5 shadow-sm sm:p-6 transition-colors">
      {/* Sliding Tab Header */}
      <div className="relative flex flex-wrap gap-1 rounded-2xl bg-slate-100/80 dark:bg-[#15162B] p-1 border border-slate-200/60 dark:border-[#30324F] shadow-inner">
        {navSections.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold transition-all ${
                isActive
                  ? 'text-white dark:text-[#0F1020]'
                  : 'text-slate-600 dark:text-[#A1A1C2] hover:text-slate-900 dark:hover:text-[#F1F5F9]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="customizer-subtab-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 z-[-1] rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] shadow-xs"
                />
              )}
              <Icon className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels with crossfade animations */}
      <AnimatePresence mode="wait">
        {activeSection === 'presets' && (
          <motion.div
            key="presets"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="pt-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
                Curated Color & Shape Palettes
              </h4>
              <span className="text-xs text-indigo-600 dark:text-[#A78BFA] font-semibold">1-click apply</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {STYLE_PRESETS.map(preset => (
                <motion.button
                  key={preset.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onApplyPreset(preset.design)}
                  className="group relative flex flex-col items-start rounded-2xl border border-slate-200/80 dark:border-[#30324F] p-3.5 text-left transition-all hover:border-[#A78BFA] hover:shadow-md bg-white dark:bg-[#202341] hover:bg-indigo-50/10 dark:hover:bg-[#202341]/80 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full border border-slate-300 dark:border-[#30324F] shadow-xs"
                      style={{
                        backgroundColor:
                          preset.design.gradient?.type === 'linear'
                            ? preset.design.gradient.color1
                            : preset.design.foregroundColor || '#000'
                      }}
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-[#F1F5F9] group-hover:text-indigo-600 dark:group-hover:text-[#A78BFA] transition-colors">
                      {preset.name}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-[#A1A1C2] line-clamp-1 leading-tight">
                    {preset.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'style' && (
          <motion.div
            key="style"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="pt-5 space-y-5"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
                QR Dot Pattern Geometry
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {dotTypes.map(d => (
                  <motion.button
                    key={d.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onChange({ dotType: d.id })}
                    className={`rounded-2xl border p-2.5 text-xs font-medium transition-all ${
                      design.dotType === d.id
                        ? 'border-indigo-600 dark:border-[#A78BFA] bg-indigo-50/80 dark:bg-[#202341] text-indigo-950 dark:text-[#A78BFA] font-bold ring-1 ring-indigo-500 dark:ring-[#A78BFA] shadow-xs'
                        : 'border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] text-slate-600 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]'
                    }`}
                  >
                    {d.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
                Corner Eye Outer Frame
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {cornerSquareTypes.map(cs => (
                  <motion.button
                    key={cs.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onChange({ cornerSquareType: cs.id })}
                    className={`rounded-2xl border p-2.5 text-xs font-medium transition-all ${
                      design.cornerSquareType === cs.id
                        ? 'border-indigo-600 dark:border-[#A78BFA] bg-indigo-50/80 dark:bg-[#202341] text-indigo-950 dark:text-[#A78BFA] font-bold ring-1 ring-indigo-500 dark:ring-[#A78BFA] shadow-xs'
                        : 'border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] text-slate-600 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]'
                    }`}
                  >
                    {cs.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
                Corner Eye Inner Center
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {cornerDotTypes.map(cd => (
                  <motion.button
                    key={cd.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onChange({ cornerDotType: cd.id })}
                    className={`rounded-2xl border p-2.5 text-xs font-medium transition-all ${
                      design.cornerDotType === cd.id
                        ? 'border-indigo-600 dark:border-[#A78BFA] bg-indigo-50/80 dark:bg-[#202341] text-indigo-950 dark:text-[#A78BFA] font-bold ring-1 ring-indigo-500 dark:ring-[#A78BFA] shadow-xs'
                        : 'border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] text-slate-600 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]'
                    }`}
                  >
                    {cd.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'colors' && (
          <motion.div
            key="colors"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="pt-5 space-y-4"
          >
            {/* Scannability Warning & Contrast Indicator */}
            <div
              className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs transition-colors ${
                scannability.status === 'excellent'
                  ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
                  : scannability.status === 'good'
                  ? 'border-blue-200 bg-blue-50/80 text-blue-900'
                  : scannability.status === 'warning'
                  ? 'border-amber-200 bg-amber-50/80 text-amber-900'
                  : 'border-rose-200 bg-rose-50/80 text-rose-900'
              }`}
            >
              {scannability.status === 'excellent' || scannability.status === 'good' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              )}
              <div>
                <span className="font-extrabold">
                  WCAG Contrast: {scannability.contrastRatio}:1 (Rating: {scannability.score}/100)
                </span>
                <p className="mt-0.5 opacity-90">{scannability.message}</p>
              </div>
            </div>

            {/* Fill Mode Switcher */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
                Color Treatment
              </label>
              <div className="mt-1.5 flex gap-2">
                {[
                  { id: 'none', label: 'Solid Color' },
                  { id: 'linear', label: 'Linear Gradient' },
                  { id: 'radial', label: 'Radial Gradient' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        gradient: { ...design.gradient, type: f.id as any }
                      })
                    }
                    className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-all ${
                      design.gradient.type === f.id
                        ? 'border-indigo-600 dark:border-[#A78BFA] bg-indigo-50/80 dark:bg-[#202341] text-indigo-900 dark:text-[#A78BFA] shadow-xs'
                        : 'border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] text-slate-600 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="color-primary" className="block text-xs font-semibold text-slate-600 dark:text-[#A1A1C2]">
                  {design.gradient.type === 'none' ? 'QR Code Color' : 'Gradient Start'}
                </label>
                <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-2 shadow-xs">
                  <input
                    id="color-primary"
                    type="color"
                    value={
                      design.gradient.type === 'none'
                        ? design.foregroundColor
                        : design.gradient.color1
                    }
                    onChange={e => {
                      const val = e.target.value;
                      if (design.gradient.type === 'none') {
                        onChange({ foregroundColor: val });
                      } else {
                        onChange({
                          gradient: { ...design.gradient, color1: val }
                        });
                      }
                    }}
                    className="h-8 w-8 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={
                      design.gradient.type === 'none'
                        ? design.foregroundColor
                        : design.gradient.color1
                    }
                    onChange={e => {
                      const val = e.target.value;
                      if (design.gradient.type === 'none') {
                        onChange({ foregroundColor: val });
                      } else {
                        onChange({
                          gradient: { ...design.gradient, color1: val }
                        });
                      }
                    }}
                    className="w-20 font-mono text-xs uppercase font-bold text-slate-800 dark:text-[#F1F5F9] bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              {design.gradient.type !== 'none' ? (
                <div>
                  <label htmlFor="color-grad2" className="block text-xs font-semibold text-slate-600 dark:text-[#A1A1C2]">
                    Gradient End
                  </label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-2 shadow-xs">
                    <input
                      id="color-grad2"
                      type="color"
                      value={design.gradient.color2}
                      onChange={e =>
                        onChange({
                          gradient: { ...design.gradient, color2: e.target.value }
                        })
                      }
                      className="h-8 w-8 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={design.gradient.color2}
                      onChange={e =>
                        onChange({
                          gradient: { ...design.gradient, color2: e.target.value }
                        })
                      }
                      className="w-20 font-mono text-xs uppercase font-bold text-slate-800 dark:text-[#F1F5F9] bg-transparent focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="color-bg" className="block text-xs font-semibold text-slate-600 dark:text-[#A1A1C2]">
                    Background Color
                  </label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-2 shadow-xs">
                    <input
                      id="color-bg"
                      type="color"
                      disabled={design.transparentBackground}
                      value={design.backgroundColor}
                      onChange={e => onChange({ backgroundColor: e.target.value })}
                      className="h-8 w-8 cursor-pointer rounded-xl border-0 bg-transparent p-0 disabled:opacity-30"
                    />
                    <input
                      type="text"
                      disabled={design.transparentBackground}
                      value={design.transparentBackground ? 'Transparent' : design.backgroundColor}
                      onChange={e => onChange({ backgroundColor: e.target.value })}
                      className="w-24 font-mono text-xs uppercase font-bold text-slate-800 dark:text-[#F1F5F9] bg-transparent focus:outline-hidden disabled:text-slate-400 dark:disabled:text-[#A1A1C2]/40"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gradient Rotation slider */}
            {design.gradient.type === 'linear' && (
              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-[#A1A1C2] font-semibold">
                  <span>Gradient Direction Angle</span>
                  <span className="font-mono text-indigo-600 dark:text-[#A78BFA]">{design.gradient.rotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={design.gradient.rotation}
                  onChange={e =>
                    onChange({
                      gradient: { ...design.gradient, rotation: parseInt(e.target.value) }
                    })
                  }
                  className="mt-1.5 w-full accent-[#A78BFA] cursor-pointer"
                />
              </div>
            )}

            {/* Transparent Background Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={design.transparentBackground}
                  onChange={e => onChange({ transparentBackground: e.target.checked })}
                  className="h-4 w-4 rounded-md border-slate-300 dark:border-[#30324F] text-[#A78BFA] focus:ring-[#A78BFA]"
                />
                <span className="text-xs text-slate-700 dark:text-[#F1F5F9] font-semibold">
                  Transparent Background (PNG/SVG vector cutout)
                </span>
              </label>
            </div>

            {/* Separate Corner Eye Colors */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#30324F]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={design.customEyeColor}
                  onChange={e => onChange({ customEyeColor: e.target.checked })}
                  className="h-4 w-4 rounded-md border-slate-300 dark:border-[#30324F] text-[#A78BFA] focus:ring-[#A78BFA]"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-[#F1F5F9]">
                  Custom Corner Eye Colors
                </span>
              </label>

              {design.customEyeColor && (
                <div className="mt-3 grid grid-cols-2 gap-3 pl-6">
                  <div>
                    <label htmlFor="eye-outer-color" className="block text-xs font-medium text-slate-600 dark:text-[#A1A1C2]">
                      Outer Eye Frame
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-1.5 shadow-xs">
                      <input
                        id="eye-outer-color"
                        type="color"
                        value={design.cornerSquareColor}
                        onChange={e => onChange({ cornerSquareColor: e.target.value })}
                        className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={design.cornerSquareColor}
                        onChange={e => onChange({ cornerSquareColor: e.target.value })}
                        className="w-16 font-mono text-xs uppercase text-slate-800 dark:text-[#F1F5F9] bg-transparent focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="eye-inner-color" className="block text-xs font-medium text-slate-600 dark:text-[#A1A1C2]">
                      Inner Eye Dot
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-1.5 shadow-xs">
                      <input
                        id="eye-inner-color"
                        type="color"
                        value={design.cornerDotColor}
                        onChange={e => onChange({ cornerDotColor: e.target.value })}
                        className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={design.cornerDotColor}
                        onChange={e => onChange({ cornerDotColor: e.target.value })}
                        className="w-16 font-mono text-xs uppercase text-slate-800 dark:text-[#F1F5F9] bg-transparent focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeSection === 'logo' && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="pt-5 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
                Center Brand Icon / Logo
              </label>
              <p className="text-xs text-slate-500 dark:text-[#A1A1C2]">
                Center logos establish instant brand trust and recognition.
              </p>
            </div>

            {design.logoUrl ? (
              <div className="flex items-center justify-between rounded-2xl border border-indigo-200 dark:border-[#30324F] bg-indigo-50/70 dark:bg-[#202341] p-3.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={design.logoUrl}
                    alt="Logo preview"
                    className="h-10 w-10 rounded-xl border border-indigo-300 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-1 object-contain shadow-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-indigo-950 dark:text-[#F1F5F9]">Active Logo Applied</span>
                    <p className="text-[11px] text-indigo-700 dark:text-[#A78BFA]">Error correction set to High (30%)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ logoUrl: undefined })}
                  className="flex items-center gap-1 rounded-xl border border-red-200 dark:border-rose-900 bg-white dark:bg-[#15162B] px-3 py-1.5 text-xs font-bold text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 transition-colors shadow-xs"
                >
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            ) : (
              <div>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-[#30324F] bg-slate-50/60 dark:bg-[#15162B] p-5 transition-all hover:border-[#A78BFA] hover:bg-indigo-50/30 dark:hover:bg-[#202341]/40">
                  <Upload className="h-6 w-6 text-indigo-600 dark:text-[#A78BFA]" />
                  <span className="mt-1.5 text-xs font-bold text-slate-800 dark:text-[#F1F5F9]">
                    Upload Custom Logo (PNG, SVG, JPG)
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-[#A1A1C2]">Max size 2MB, transparent PNG or SVG works best</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            <div>
              <span className="text-xs font-bold text-slate-600 dark:text-[#A1A1C2]">Quick preset brand icons:</span>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {POPULAR_LOGOS.map(item => (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() =>
                      onChange({
                        logoUrl: svgToDataUri(item.svg),
                        errorCorrectionLevel: 'H'
                      })
                    }
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-2.5 hover:border-[#A78BFA] hover:shadow-xs transition-all"
                  >
                    <div
                      className="h-5 w-5"
                      dangerouslySetInnerHTML={{ __html: item.svg }}
                    />
                    <span className="mt-1 text-[11px] font-semibold text-slate-700 dark:text-[#F1F5F9]">
                      {item.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {design.logoUrl && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#30324F]">
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-[#A1A1C2] font-semibold">
                    <span>Logo Scale</span>
                    <span className="font-mono text-indigo-600 dark:text-[#A78BFA]">{Math.round(design.logoSize * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.38"
                    step="0.02"
                    value={design.logoSize}
                    onChange={e => onChange({ logoSize: parseFloat(e.target.value) })}
                    className="mt-1 w-full accent-[#A78BFA]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-[#A1A1C2] font-semibold">
                    <span>Logo Margin Padding</span>
                    <span className="font-mono text-indigo-600 dark:text-[#A78BFA]">{design.logoMargin}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    step="2"
                    value={design.logoMargin}
                    onChange={e => onChange({ logoMargin: parseInt(e.target.value) })}
                    className="mt-1 w-full accent-[#A78BFA]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={design.hideBackgroundDots}
                      onChange={e => onChange({ hideBackgroundDots: e.target.checked })}
                      className="h-4 w-4 rounded-md border-slate-300 dark:border-[#30324F] text-[#A78BFA] focus:ring-[#A78BFA]"
                    />
                    <span className="text-xs text-slate-700 dark:text-[#F1F5F9] font-semibold">
                      Clear QR dots directly behind logo
                    </span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeSection === 'frame' && (
          <motion.div
            key="frame"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="pt-5 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
                Frame & Call-To-Action Wrapper
              </label>
              <p className="text-xs text-slate-500 dark:text-[#A1A1C2]">
                Framed QR codes provide instructions like "SCAN ME" and drive higher interaction.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {frameTypes.map(f => (
                <motion.button
                  key={f.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onChange({ frameType: f.id })}
                  className={`rounded-2xl border p-2.5 text-xs font-bold text-left transition-all ${
                    design.frameType === f.id
                      ? 'border-indigo-600 dark:border-[#A78BFA] bg-indigo-50/80 dark:bg-[#202341] text-indigo-950 dark:text-[#A78BFA] ring-1 ring-indigo-500 dark:ring-[#A78BFA] shadow-xs'
                      : 'border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] text-slate-600 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]'
                  }`}
                >
                  {f.label}
                </motion.button>
              ))}
            </div>

            {design.frameType !== 'none' && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#30324F]">
                <div>
                  <label htmlFor="frame-cta-text" className="block text-xs font-semibold text-slate-600 dark:text-[#A1A1C2]">
                    Call-To-Action Text
                  </label>
                  <input
                    id="frame-cta-text"
                    type="text"
                    value={design.frameText}
                    onChange={e => onChange({ frameText: e.target.value })}
                    placeholder="SCAN ME"
                    className="mt-1 w-full rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-2 text-sm text-slate-900 dark:text-[#F1F5F9] uppercase font-black tracking-wide shadow-xs focus:border-[#A78BFA] focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {['SCAN ME', 'VIEW MENU', 'CONNECT WI-FI', 'VISIT WEBSITE', 'PAY HERE', 'GET INFO'].map(cta => (
                    <button
                      key={cta}
                      type="button"
                      onClick={() => onChange({ frameText: cta })}
                      className="rounded-lg border border-slate-200 dark:border-[#30324F] bg-slate-50 dark:bg-[#202341] px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-[#A1A1C2] hover:bg-indigo-50 dark:hover:bg-[#202341]/80 hover:border-[#A78BFA] hover:text-indigo-700 dark:hover:text-[#A78BFA] transition-colors"
                    >
                      {cta}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="frame-bg-color" className="block text-xs font-semibold text-slate-600 dark:text-[#A1A1C2]">
                      Frame Color
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-1.5 shadow-xs">
                      <input
                        id="frame-bg-color"
                        type="color"
                        value={design.frameColor}
                        onChange={e => onChange({ frameColor: e.target.value })}
                        className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={design.frameColor}
                        onChange={e => onChange({ frameColor: e.target.value })}
                        className="w-16 font-mono text-xs uppercase text-slate-800 dark:text-[#F1F5F9] bg-transparent focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="frame-text-color" className="block text-xs font-semibold text-slate-600 dark:text-[#A1A1C2]">
                      Text Color
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-1.5 shadow-xs">
                      <input
                        id="frame-text-color"
                        type="color"
                        value={design.frameTextColor}
                        onChange={e => onChange({ frameTextColor: e.target.value })}
                        className="h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={design.frameTextColor}
                        onChange={e => onChange({ frameTextColor: e.target.value })}
                        className="w-16 font-mono text-xs uppercase text-slate-800 dark:text-[#F1F5F9] bg-transparent focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeSection === 'advanced' && (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="pt-5 space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
                Reed-Solomon Error Correction Level
              </label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[
                  { id: 'L', label: 'Low', percent: '7%' },
                  { id: 'M', label: 'Medium', percent: '15%' },
                  { id: 'Q', label: 'Quartile', percent: '25%' },
                  { id: 'H', label: 'High', percent: '30%' }
                ].map(ec => (
                  <motion.button
                    key={ec.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onChange({ errorCorrectionLevel: ec.id as ErrorCorrectionLevel })}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-2 text-center transition-all ${
                      design.errorCorrectionLevel === ec.id
                        ? 'border-indigo-600 dark:border-[#A78BFA] bg-indigo-50/80 dark:bg-[#202341] text-indigo-950 dark:text-[#A78BFA] font-bold ring-1 ring-indigo-500 dark:ring-[#A78BFA] shadow-xs'
                        : 'border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] text-slate-600 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]'
                    }`}
                  >
                    <span className="text-xs font-bold">{ec.label}</span>
                    <span className="text-[11px] text-slate-400 dark:text-[#A1A1C2]">{ec.percent}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-[#A1A1C2] font-semibold">
                <span>Quiet Zone Margin</span>
                <span className="font-mono text-indigo-600 dark:text-[#A78BFA]">{design.margin}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="2"
                value={design.margin}
                onChange={e => onChange({ margin: parseInt(e.target.value) })}
                className="mt-1 w-full accent-[#A78BFA]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
