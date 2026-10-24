import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Printer, X, Sparkles } from 'lucide-react';
import { QRDesignConfig, QRDataType } from '../types/qr';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: string;
  type: QRDataType;
  design: QRDesignConfig;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  payload,
  type,
  design
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const [headline, setHeadline] = useState(
    type === 'wifi'
      ? 'Connect to Guest Wi-Fi'
      : type === 'vcard'
      ? 'Scan for Contact Information'
      : type === 'social'
      ? 'Follow Our Official Channel'
      : 'Scan with Your Smartphone'
  );

  const [subheading, setSubheading] = useState(
    'Point your mobile camera at the QR code below to access instantly.'
  );

  const themeColor = design.foregroundColor || '#0f172a';

  useEffect(() => {
    if (!isOpen || !qrRef.current) return;
    qrRef.current.innerHTML = '';
    const qr = new QRCodeStyling({
      width: 200,
      height: 200,
      data: payload || 'https://qrstudio.app',
      margin: design.margin,
      qrOptions: { errorCorrectionLevel: design.errorCorrectionLevel },
      dotsOptions: {
        type: design.dotType,
        color: design.foregroundColor
      },
      cornersSquareOptions: {
        type: design.cornerSquareType,
        color: design.customEyeColor ? design.cornerSquareColor : design.foregroundColor
      },
      cornersDotOptions: {
        type: design.cornerDotType,
        color: design.customEyeColor ? design.cornerDotColor : design.foregroundColor
      },
      backgroundOptions: {
        color: '#ffffff'
      }
    });
    qr.append(qrRef.current);
  }, [isOpen, payload, design]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#191B33] shadow-2xl border border-slate-200 dark:border-[#30324F] overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Header - Hidden in Print */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30324F] px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-indigo-600 dark:text-[#A78BFA]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F1F5F9]">Print Display Card Template</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 dark:text-[#A1A1C2] hover:bg-slate-100 dark:hover:bg-[#202341] hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Customization Controls - Hidden in Print */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-[#30324F] bg-slate-50/70 dark:bg-[#15162B] p-4 print:hidden">
          <div>
            <label htmlFor="print-headline" className="block text-xs font-semibold text-slate-600 dark:text-[#A1A1C2]">
              Display Headline
            </label>
            <input
              id="print-headline"
              type="text"
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#202341] px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-[#F1F5F9] focus:outline-hidden"
            />
          </div>
          <div>
            <label htmlFor="print-subheading" className="block text-xs font-semibold text-slate-600 dark:text-[#A1A1C2]">
              Instructions Subtitle
            </label>
            <input
              id="print-subheading"
              type="text"
              value={subheading}
              onChange={e => setSubheading(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#202341] px-3 py-1.5 text-xs text-slate-700 dark:text-[#F1F5F9] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Printable Area - always crisp white background for physical paper clarity */}
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white print:p-12 print:m-auto">
          <div
            className="w-full max-w-md rounded-3xl border-2 p-8 shadow-sm print:border-slate-800 print:shadow-none"
            style={{ borderColor: themeColor }}
          >
            <h2
              className="text-2xl font-black tracking-tight"
              style={{ color: themeColor }}
            >
              {headline}
            </h2>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {subheading}
            </p>

            {/* Local QR Visual */}
            <div className="my-6 flex justify-center">
              <div className="rounded-2xl border border-slate-100 p-3 shadow-xs bg-white">
                <div ref={qrRef} className="flex items-center justify-center" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Powered by QR Studio
            </div>
          </div>
        </div>

        {/* Footer Actions - Hidden in Print */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-[#30324F] bg-slate-50 dark:bg-[#15162B] px-6 py-4 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#202341] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#202341]/80"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] px-5 py-2 text-xs font-bold text-white dark:text-[#0F1020] shadow-md shadow-indigo-600/30 dark:shadow-[#A78BFA]/30 hover:brightness-105 active:scale-98 transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Print Display Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};

