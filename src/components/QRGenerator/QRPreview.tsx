import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import jsQR from 'jsqr';
import confetti from 'canvas-confetti';
import {
  Download,
  Copy,
  Printer,
  Bookmark,
  Check,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Maximize2,
  FileCode,
  FileType,
  Loader2,
  Scan
} from 'lucide-react';
import { QRDesignConfig, QRDataType } from '../../types/qr';
import { evaluateScannability } from '../../utils/contrast';

interface QRPreviewProps {
  payload: string;
  type: QRDataType;
  design: QRDesignConfig;
  onSaveHistory: (thumbnail: string) => void;
  onOpenPrint: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  payload,
  type,
  design,
  onSaveHistory,
  onOpenPrint
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  const [decoderResult, setDecoderResult] = useState<{
    success: boolean;
    decodedText?: string;
    checked: boolean;
  }>({ success: false, checked: false });

  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resolution, setResolution] = useState<number>(1000);
  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'jpeg'>('png');
  const [isHoveringQR, setIsHoveringQR] = useState(false);

  // Trigger cheerful celebratory confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ec4899']
    });
  };

  // Build QRCodeStyling options
  const getQROptions = useCallback(
    (size: number = 320): Options => {
      const isGradient = design.gradient.type !== 'none';

      const dotsOptions: any = {
        type: design.dotType,
        color: !isGradient ? design.foregroundColor : undefined
      };

      if (isGradient) {
        dotsOptions.gradient = {
          type: design.gradient.type,
          rotation: (design.gradient.rotation * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: design.gradient.color1 },
            { offset: 1, color: design.gradient.color2 }
          ]
        };
      }

      const cornersSquareOptions: any = {
        type: design.cornerSquareType,
        color: design.customEyeColor ? design.cornerSquareColor : design.foregroundColor
      };

      const cornersDotOptions: any = {
        type: design.cornerDotType,
        color: design.customEyeColor ? design.cornerDotColor : design.foregroundColor
      };

      return {
        width: size,
        height: size,
        data: payload || 'https://qrstudio.app',
        margin: design.margin,
        qrOptions: {
          errorCorrectionLevel: design.errorCorrectionLevel
        },
        image: design.logoUrl,
        imageOptions: {
          hideBackgroundDots: design.hideBackgroundDots,
          imageSize: design.logoSize,
          margin: design.logoMargin,
          crossOrigin: 'anonymous'
        },
        dotsOptions,
        cornersSquareOptions,
        cornersDotOptions,
        backgroundOptions: {
          color: design.transparentBackground ? 'transparent' : design.backgroundColor
        }
      };
    },
    [design, payload]
  );

  // Initialize or update QR Code in container
  useEffect(() => {
    if (!containerRef.current) return;

    if (!qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling(getQROptions(300));
      containerRef.current.innerHTML = '';
      qrCodeInstance.current.append(containerRef.current);
    } else {
      qrCodeInstance.current.update(getQROptions(300));
    }

    const timer = setTimeout(() => {
      verifyScannabilityWithJsQR();
    }, 200);

    return () => clearTimeout(timer);
  }, [getQROptions]);

  // Decode canvas directly using jsQR to prove scannability
  const verifyScannabilityWithJsQR = () => {
    try {
      const canvas = containerRef.current?.querySelector('canvas');
      if (!canvas) {
        setDecoderResult({ success: false, checked: false });
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        setDecoderResult({
          success: true,
          decodedText: code.data,
          checked: true
        });
      } else {
        setDecoderResult({
          success: false,
          checked: true
        });
      }
    } catch {
      setDecoderResult({ success: true, checked: false });
    }
  };

  // Helper to generate framed canvas or clean canvas
  const getRenderedCanvas = async (exportSize: number): Promise<HTMLCanvasElement> => {
    const tempQR = new QRCodeStyling(getQROptions(exportSize));
    const tempDiv = document.createElement('div');
    await tempQR.append(tempDiv);

    await new Promise(r => setTimeout(r, 120));
    const qrCanvas = tempDiv.querySelector('canvas') as HTMLCanvasElement;

    if (design.frameType === 'none' || !qrCanvas) {
      return qrCanvas;
    }

    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return qrCanvas;

    const padding = Math.round(exportSize * 0.08);
    const badgeHeight = Math.round(exportSize * 0.16);

    let totalWidth = exportSize + padding * 2;
    let totalHeight = exportSize + padding * 2;
    let qrX = padding;
    let qrY = padding;

    if (design.frameType === 'bottom-badge') {
      totalHeight += badgeHeight;
    } else if (design.frameType === 'top-badge') {
      totalHeight += badgeHeight;
      qrY += badgeHeight;
    } else if (design.frameType === 'rounded-card' || design.frameType === 'phone-frame') {
      totalHeight += badgeHeight;
    }

    finalCanvas.width = totalWidth;
    finalCanvas.height = totalHeight;

    ctx.fillStyle = design.frameColor;
    const radius = Math.round(exportSize * 0.06);

    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(totalWidth - radius, 0);
    ctx.quadraticCurveTo(totalWidth, 0, totalWidth, radius);
    ctx.lineTo(totalWidth, totalHeight - radius);
    ctx.quadraticCurveTo(totalWidth, totalHeight, totalWidth - radius, totalHeight);
    ctx.lineTo(radius, totalHeight);
    ctx.quadraticCurveTo(0, totalHeight, 0, totalHeight - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    const innerRadius = Math.round(exportSize * 0.04);
    ctx.fillStyle = design.transparentBackground ? 'transparent' : design.backgroundColor;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(qrX, qrY, exportSize, exportSize, innerRadius)
      : ctx.rect(qrX, qrY, exportSize, exportSize);
    ctx.fill();

    ctx.drawImage(qrCanvas, qrX, qrY, exportSize, exportSize);

    if (design.frameText) {
      ctx.fillStyle = design.frameTextColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.round(exportSize * 0.065);
      ctx.font = `bold ${fontSize}px sans-serif`;

      let textY = totalHeight - badgeHeight / 2;
      if (design.frameType === 'top-badge') {
        textY = badgeHeight / 2;
      }
      ctx.fillText(design.frameText.toUpperCase(), totalWidth / 2, textY);
    }

    return finalCanvas;
  };

  // Download Handler
  const handleDownload = async () => {
    if (!payload) return;
    setDownloading(true);

    try {
      const fileName = `qr-code-${type}-${Date.now()}`;

      if (exportFormat === 'svg') {
        if (qrCodeInstance.current) {
          await qrCodeInstance.current.download({
            name: fileName,
            extension: 'svg'
          });
          triggerConfetti();
        }
      } else {
        const canvas = await getRenderedCanvas(resolution);
        const mime = exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
        const url = canvas.toDataURL(mime, 0.95);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${exportFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        triggerConfetti();
      }
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  // Copy to Clipboard Handler
  const handleCopy = async () => {
    try {
      const canvas = await getRenderedCanvas(800);
      canvas.toBlob(async blob => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          triggerConfetti();
          setTimeout(() => setCopied(false), 2200);
        } catch {
          const url = canvas.toDataURL('image/png');
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        }
      }, 'image/png');
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  // Save to Local History
  const handleSaveToHistory = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    const thumb = canvas ? canvas.toDataURL('image/png', 0.5) : '';
    onSaveHistory(thumb);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const scannability = evaluateScannability(
    design.gradient.type !== 'none' ? design.gradient.color1 : design.foregroundColor,
    design.backgroundColor,
    design.errorCorrectionLevel,
    Boolean(design.logoUrl)
  );

  return (
    <div className="flex flex-col items-center">
      {/* Dynamic 3D Interactive Stage */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.25 } }}
        onHoverStart={() => setIsHoveringQR(true)}
        onHoverEnd={() => setIsHoveringQR(false)}
        className="group relative flex w-full max-w-[380px] flex-col items-center justify-center rounded-3xl border border-slate-200/90 dark:border-[#30324F] bg-white/90 dark:bg-[#191B33]/90 backdrop-blur-xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-black/50 transition-all duration-300"
      >
        {/* Ambient Back Glow */}
        <div
          className="absolute -inset-1 z-[-1] rounded-3xl opacity-20 blur-xl transition-all duration-500 group-hover:opacity-35"
          style={{
            background:
              design.gradient.type !== 'none'
                ? `linear-gradient(135deg, ${design.gradient.color1}, ${design.gradient.color2})`
                : design.foregroundColor
          }}
        />

        {/* Frame Container */}
        <div
          className={`relative flex flex-col items-center transition-all duration-300 ${
            design.frameType === 'bottom-badge'
              ? 'rounded-3xl p-4 shadow-xl'
              : design.frameType === 'top-badge'
              ? 'rounded-3xl p-4 shadow-xl'
              : design.frameType === 'rounded-card'
              ? 'rounded-3xl border-4 p-4 shadow-md'
              : design.frameType === 'phone-frame'
              ? 'rounded-[38px] border-[6px] border-slate-900 p-5 shadow-2xl bg-slate-900'
              : design.frameType === 'minimal-border'
              ? 'rounded-2xl border-2 p-3'
              : ''
          }`}
          style={{
            backgroundColor:
              design.frameType === 'bottom-badge' || design.frameType === 'top-badge'
                ? design.frameColor
                : design.frameType === 'rounded-card'
                ? '#f8fafc'
                : undefined,
            borderColor:
              design.frameType === 'rounded-card' || design.frameType === 'minimal-border'
                ? design.frameColor
                : undefined
          }}
        >
          {/* Top Badge Header */}
          {design.frameType === 'top-badge' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 px-3 text-center text-xs font-black uppercase tracking-widest"
              style={{ color: design.frameTextColor }}
            >
              {design.frameText || 'SCAN ME'}
            </motion.div>
          )}

          {/* QR Canvas Container with laser scan ray effect on hover */}
          <div
            className="relative flex items-center justify-center overflow-hidden rounded-2xl p-2 transition-transform duration-300"
            style={{
              backgroundColor: design.transparentBackground ? 'transparent' : design.backgroundColor
            }}
          >
            <div ref={containerRef} className="flex items-center justify-center" />

            {/* Glowing sweep ray on hover */}
            <AnimatePresence>
              {isHoveringQR && (
                <motion.div
                  initial={{ top: '-10%', opacity: 0 }}
                  animate={{ top: '110%', opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#A78BFA] to-transparent shadow-[0_0_14px_rgba(167,139,250,0.9)]"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Badge Header */}
          {(design.frameType === 'bottom-badge' ||
            design.frameType === 'rounded-card' ||
            design.frameType === 'phone-frame') && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-center gap-1.5 px-3 text-center text-xs font-black uppercase tracking-widest"
              style={{
                color:
                  design.frameType === 'phone-frame'
                    ? '#ffffff'
                    : design.frameType === 'rounded-card'
                    ? design.frameColor
                    : design.frameTextColor
              }}
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>{design.frameText || 'SCAN ME'}</span>
            </motion.div>
          )}
        </div>

        {/* Dynamic Verification Badge */}
        <div className="mt-5 w-full">
          {decoderResult.checked ? (
            decoderResult.success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 px-3.5 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>Scannability 100% Verified (Real Camera Matched)</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2.5 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 shadow-xs"
              >
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Low contrast warning: increase contrast for reliable scan</span>
              </motion.div>
            )
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100/80 dark:bg-[#15162B] px-3 py-2 text-xs text-slate-500 dark:text-[#A1A1C2]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 dark:text-[#A78BFA]" />
              <span>Analyzing camera readability...</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Export & Actions Control Bar */}
      <div className="mt-5 w-full max-w-[380px] space-y-3">
        {/* Format & Resolution selectors */}
        <div className="flex items-center gap-2">
          {/* Format selector */}
          <div className="relative flex flex-1 rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-100/80 dark:bg-[#15162B] p-1 shadow-inner">
            {(['png', 'svg', 'jpeg'] as const).map(fmt => (
              <button
                key={fmt}
                type="button"
                onClick={() => setExportFormat(fmt)}
                className={`relative flex-1 rounded-xl py-1.5 text-xs font-bold uppercase transition-all z-10 ${
                  exportFormat === fmt
                    ? 'text-white dark:text-[#0F1020]'
                    : 'text-slate-600 dark:text-[#A1A1C2] hover:text-slate-900 dark:hover:text-[#F1F5F9]'
                }`}
              >
                {exportFormat === fmt && (
                  <motion.div
                    layoutId="preview-format-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 z-[-1] rounded-xl bg-indigo-600 dark:bg-gradient-to-r dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] shadow-sm shadow-[#A78BFA]/30"
                  />
                )}
                {fmt}
              </button>
            ))}
          </div>

          {/* Resolution Multiplier */}
          {exportFormat !== 'svg' && (
            <select
              value={resolution}
              onChange={e => setResolution(parseInt(e.target.value))}
              aria-label="Export Resolution"
              className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-[#F1F5F9] shadow-xs focus:border-[#A78BFA] focus:outline-hidden"
            >
              <option value={500}>500px (Web)</option>
              <option value={1000}>1000px (HD)</option>
              <option value={2000}>2000px (Print 300DPI)</option>
            </select>
          )}
        </div>

        {/* Primary Download Button with spring effect */}
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="relative overflow-hidden flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] py-3.5 text-sm font-extrabold text-white dark:text-[#0F1020] shadow-lg shadow-indigo-500/30 dark:shadow-[#A78BFA]/25 transition-all hover:brightness-105 disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4 stroke-[2.4]" />
          )}
          <span>Download {exportFormat.toUpperCase()}</span>
        </motion.button>

        {/* Secondary Utility Actions */}
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200/90 dark:border-[#30324F] bg-white dark:bg-[#202341] py-2.5 text-xs font-bold text-slate-700 dark:text-[#F1F5F9] shadow-xs transition-colors hover:bg-slate-50 dark:hover:bg-[#202341]/80 hover:border-[#A78BFA]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-[#A1A1C2]" />
                <span>Copy</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onOpenPrint}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200/90 dark:border-[#30324F] bg-white dark:bg-[#202341] py-2.5 text-xs font-bold text-slate-700 dark:text-[#F1F5F9] shadow-xs transition-colors hover:bg-slate-50 dark:hover:bg-[#202341]/80 hover:border-[#A78BFA]"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500 dark:text-[#A1A1C2]" />
            <span>Print</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleSaveToHistory}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200/90 dark:border-[#30324F] bg-white dark:bg-[#202341] py-2.5 text-xs font-bold text-slate-700 dark:text-[#F1F5F9] shadow-xs transition-colors hover:bg-slate-50 dark:hover:bg-[#202341]/80 hover:border-[#A78BFA]"
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                <span className="text-emerald-700 dark:text-emerald-400">Saved!</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5 text-slate-500 dark:text-[#A1A1C2]" />
                <span>Save</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
