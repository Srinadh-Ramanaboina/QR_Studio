import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  Upload,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  QrCode,
  Sparkles,
  Wifi,
  User,
  Mail,
  Phone,
  Compass,
  ArrowRight
} from 'lucide-react';
import { QRDataType, QRDesignConfig } from '../../types/qr';

interface QRScannerProps {
  onLoadIntoGenerator: (payload: string, type: QRDataType) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onLoadIntoGenerator }) => {
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('upload');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop camera stream helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraActive(false);
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Required for iOS Safari
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera permissions in browser settings or use image upload.'
          : err.message || 'Unable to access camera.'
      );
      setCameraActive(false);
    }
  };

  // Live video frame scanning loop
  const tickScan = () => {
    if (
      videoRef.current &&
      videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
    ) {
      const video = videoRef.current;
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        });

        if (code && code.data) {
          handleSuccessfulScan(code.data);
          stopCamera();
          return;
        }
      }
    }

    if (cameraActive || streamRef.current) {
      animationFrameRef.current = requestAnimationFrame(tickScan);
    }
  };

  // Handle successful scan
  const handleSuccessfulScan = (data: string) => {
    setDecodedData(data);
  };

  // Toggle Camera Facing Mode (Front / Back)
  const toggleFacingMode = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
  };

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
    return () => stopCamera();
  }, [facingMode]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Handle Image File Upload or Drag & Drop
  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        });

        if (code && code.data) {
          handleSuccessfulScan(code.data);
        } else {
          alert('No readable QR code found in this image. Make sure the code is clear and not blurry.');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Global paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Inspect decoded payload type
  const detectPayloadType = (payload: string): { type: QRDataType; label: string; icon: any } => {
    if (/^WIFI:/i.test(payload)) {
      return { type: 'wifi', label: 'Wi-Fi Network Credentials', icon: Wifi };
    }
    if (/^BEGIN:VCARD/i.test(payload)) {
      return { type: 'vcard', label: 'vCard Contact Card', icon: User };
    }
    if (/^mailto:/i.test(payload)) {
      return { type: 'email', label: 'Email Message', icon: Mail };
    }
    if (/^tel:/i.test(payload)) {
      return { type: 'phone', label: 'Phone Call', icon: Phone };
    }
    if (/^geo:/i.test(payload)) {
      return { type: 'geo', label: 'Geographic Location', icon: Compass };
    }
    if (/^https?:\/\//i.test(payload)) {
      return { type: 'url', label: 'Web URL / Link', icon: ExternalLink };
    }
    return { type: 'text', label: 'Text / Raw Data', icon: QrCode };
  };

  const copyToClipboard = () => {
    if (!decodedData) return;
    navigator.clipboard.writeText(decodedData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const detected = decodedData ? detectPayloadType(decodedData) : null;
  const DetectedIcon = detected?.icon;

  return (
    <div className="mx-auto max-w-4xl py-6 px-4">
      {/* Title */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F1F5F9] sm:text-3xl">
          QR Code Scanner & Decoder
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-[#A1A1C2]">
          Scan live using your webcam or mobile camera, or upload/paste an image file.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="mb-6 flex justify-center">
        <div className="flex rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => {
              setScanMode('upload');
              stopCamera();
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              scanMode === 'upload'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] text-white dark:text-[#0F1020] shadow-xs'
                : 'text-slate-600 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Image or Paste</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setScanMode('camera');
              startCamera();
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              scanMode === 'camera'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] text-white dark:text-[#0F1020] shadow-xs'
                : 'text-slate-600 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]'
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Live Camera Scanner</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Container */}
      <div className="rounded-3xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] p-6 shadow-sm">
        {scanMode === 'camera' ? (
          /* Live Camera View */
          <div className="flex flex-col items-center">
            {cameraError ? (
              <div className="flex flex-col items-center rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 p-6 text-center max-w-md">
                <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">Camera Notice</h4>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => setScanMode('upload')}
                  className="mt-4 rounded-xl bg-amber-600 dark:bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
                >
                  Switch to Image Upload
                </button>
              </div>
            ) : (
              <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-black aspect-square shadow-inner">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                />

                {/* Reticle / Viewfinder Overlay */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative h-64 w-64 rounded-2xl border-2 border-[#A78BFA]/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    {/* Corner Reticle Accents */}
                    <div className="absolute -top-1 -left-1 h-6 w-6 border-t-4 border-l-4 border-[#A78BFA] rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 h-6 w-6 border-t-4 border-r-4 border-[#A78BFA] rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-[#A78BFA] rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-[#A78BFA] rounded-br-lg" />

                    {/* Animated Scanning Line */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#67E8F9] to-transparent animate-bounce opacity-75 shadow-lg" />
                  </div>
                </div>

                {/* Camera Flip Control */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md hover:bg-slate-900 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Flip Camera ({facingMode === 'environment' ? 'Back' : 'Front'})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* File Upload / Drag & Drop Area */
          <div
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) processImageFile(file);
            }}
            className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all ${
              isDragging
                ? 'border-[#A78BFA] bg-indigo-50/50 dark:bg-[#202341]'
                : 'border-slate-200 dark:border-[#30324F] bg-slate-50/50 dark:bg-[#15162B]/60 hover:border-[#A78BFA] dark:hover:border-[#A78BFA]'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-[#202341] text-indigo-600 dark:text-[#A78BFA] mb-3">
              <Upload className="h-8 w-8 stroke-[2.2]" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-[#F1F5F9]">
              Drag and drop any QR code image here
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#A1A1C2] max-w-sm">
              Supports PNG, JPG, WebP, SVG, screenshots, and direct clipboard paste (Ctrl+V).
            </p>

            <label className="mt-4 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] px-5 py-2.5 text-xs font-bold text-white dark:text-[#0F1020] shadow-md shadow-indigo-600/30 dark:shadow-[#A78BFA]/30 hover:brightness-105 transition-all">
              <span>Browse Image File</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) processImageFile(file);
                }}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Scanned Result Card */}
        {decodedData && detected && (
          <div className="mt-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-[#15162B] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
                <DetectedIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Detected: {detected.label}</span>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Decoded Successfully
              </span>
            </div>

            {/* Decoded content block */}
            <div className="mt-3 rounded-xl border border-emerald-200 dark:border-[#30324F] bg-white dark:bg-[#0F1020] p-3 font-mono text-xs text-slate-800 dark:text-[#F1F5F9] break-all select-all shadow-inner">
              {decodedData}
            </div>

            {/* Actions for decoded result */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#202341] px-3 py-2 text-xs font-bold text-slate-700 dark:text-[#F1F5F9] hover:bg-slate-50 dark:hover:bg-[#202341]/80 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-[#A1A1C2]" />
                    <span>Copy Content</span>
                  </>
                )}
              </button>

              {decodedData.startsWith('http') && (
                <a
                  href={decodedData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] px-4 py-2 text-xs font-bold text-white dark:text-[#0F1020] shadow-xs"
                >
                  <span>Open Website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={() => onLoadIntoGenerator(decodedData, detected.type)}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-[#A78BFA]/50 bg-indigo-50 dark:bg-[#202341] px-3 py-2 text-xs font-bold text-indigo-700 dark:text-[#A78BFA] hover:bg-indigo-100 dark:hover:bg-[#202341]/80 shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Customize in Studio Generator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setDecodedData(null)}
                className="ml-auto rounded-xl border border-slate-200 dark:border-[#30324F] px-3 py-2 text-xs text-slate-500 dark:text-[#A1A1C2] hover:bg-slate-100 dark:hover:bg-[#202341]"
              >
                Scan Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
