import React, { useState } from 'react';
import { motion } from 'motion/react';
import JSZip from 'jszip';
import QRCodeStyling from 'qr-code-styling';
import {
  Layers,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  Trash2,
  FileArchive,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { parseBulkInput, BulkQRItem } from '../../utils/bulkParser';
import { QRDesignConfig } from '../../types/qr';

interface BulkGeneratorProps {
  design: QRDesignConfig;
}

export const BulkGenerator: React.FC<BulkGeneratorProps> = ({ design }) => {
  const [inputText, setInputText] = useState<string>(
    `Table 1, https://menu.bistro.com/t1\nTable 2, https://menu.bistro.com/t2\nTable 3, https://menu.bistro.com/t3\nTable 4, https://menu.bistro.com/t4\nTable 5, https://menu.bistro.com/t5`
  );

  const [items, setItems] = useState<BulkQRItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Load Preset Bulk Examples
  const loadExample = (type: 'tables' | 'products' | 'social') => {
    if (type === 'tables') {
      setInputText(
        `Table 1, https://order.cafe.com/table/1\nTable 2, https://order.cafe.com/table/2\nTable 3, https://order.cafe.com/table/3\nTable 4, https://order.cafe.com/table/4\nTable 5, https://order.cafe.com/table/5`
      );
    } else if (type === 'products') {
      setInputText(
        `Summer T-Shirt, https://store.com/item/tshirt-01\nClassic Denim, https://store.com/item/denim-02\nLeather Wallet, https://store.com/item/wallet-03\nCanvas Backpack, https://store.com/item/bag-04`
      );
    } else {
      setInputText(
        `Official Website, https://mybrand.com\nInstagram, https://instagram.com/mybrand\nYouTube Channel, https://youtube.com/@mybrand\nCustomer Support, mailto:help@mybrand.com`
      );
    }
  };

  // CSV / TXT file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const content = ev.target?.result as string;
        if (content) {
          setInputText(content);
        }
      };
      reader.readAsText(file);
    }
  };

  // Generate All QR Codes
  const handleGenerateBatch = async () => {
    const parsed = parseBulkInput(inputText);
    if (parsed.length === 0) {
      alert('Please enter at least one valid line with title and URL/text.');
      return;
    }

    setIsGenerating(true);
    setProgress({ current: 0, total: parsed.length });
    setItems(parsed);

    const updatedItems = [...parsed];

    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      item.status = 'generating';
      setItems([...updatedItems]);

      try {
        const qr = new QRCodeStyling({
          width: 600,
          height: 600,
          data: item.data,
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
            color: design.transparentBackground ? 'transparent' : design.backgroundColor
          }
        });

        const tempContainer = document.createElement('div');
        await qr.append(tempContainer);
        // Short pause to ensure render
        await new Promise(r => setTimeout(r, 60));

        const canvas = tempContainer.querySelector('canvas') as HTMLCanvasElement;
        if (canvas) {
          item.dataUrl = canvas.toDataURL('image/png');
          item.status = 'ready';
        } else {
          item.status = 'error';
          item.error = 'Failed to render canvas';
        }
      } catch (err: any) {
        item.status = 'error';
        item.error = err.message || 'Error';
      }

      setProgress({ current: i + 1, total: parsed.length });
      setItems([...updatedItems]);
    }

    setIsGenerating(false);
  };

  // Download All as ZIP Archive
  const handleDownloadZip = async () => {
    const readyItems = items.filter(i => i.status === 'ready' && i.dataUrl);
    if (readyItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('qr-codes');

      for (let i = 0; i < readyItems.length; i++) {
        const item = readyItems[i];
        if (!item.dataUrl) continue;
        const base64Data = item.dataUrl.split(',')[1];
        // Clean filename
        const safeName = item.name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
        folder?.file(`${safeName || `qr_${i + 1}`}.png`, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `qr-studio-batch-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('ZIP generation error', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-6 px-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F1F5F9] sm:text-3xl">
          Bulk QR Code Generator
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-[#A1A1C2]">
          Create dozens or hundreds of customized QR codes at once from a CSV or text list and download as a ZIP archive.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-3">
            <label htmlFor="bulk-raw-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2]">
              CSV or List Input (One per line: "Title, URL")
            </label>
            <div className="flex items-center gap-1.5">
              <label className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#202341] px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-[#F1F5F9] hover:bg-slate-50 dark:hover:bg-[#202341]/80 transition-colors">
                <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-[#A78BFA]" />
                <span>Upload CSV / TXT</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <textarea
            id="bulk-raw-input"
            rows={8}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Table 1, https://menu.com/t1&#10;Table 2, https://menu.com/t2"
            className="w-full rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-3.5 font-mono text-xs text-slate-800 dark:text-[#F1F5F9] shadow-inner focus:border-[#A78BFA] focus:outline-hidden"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#A1A1C2]">
              <span>Examples:</span>
              <button
                type="button"
                onClick={() => loadExample('tables')}
                className="font-semibold text-indigo-600 dark:text-[#A78BFA] hover:underline"
              >
                Cafe Tables
              </button>
              •
              <button
                type="button"
                onClick={() => loadExample('products')}
                className="font-semibold text-indigo-600 dark:text-[#A78BFA] hover:underline"
              >
                Product SKUs
              </button>
              •
              <button
                type="button"
                onClick={() => loadExample('social')}
                className="font-semibold text-indigo-600 dark:text-[#A78BFA] hover:underline"
              >
                Social Channels
              </button>
            </div>

            <button
              type="button"
              onClick={handleGenerateBatch}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] px-5 py-2.5 text-xs font-bold text-white dark:text-[#0F1020] shadow-md shadow-indigo-600/30 dark:shadow-[#A78BFA]/30 hover:brightness-105 active:scale-98 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    Generating ({progress.current}/{progress.total})...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate All QR Codes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Batch Status & Download Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-[#30324F] bg-slate-50/70 dark:bg-[#15162B] p-5">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-[#F1F5F9] flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-indigo-600 dark:text-[#A78BFA]" />
              <span>Batch Summary</span>
            </h4>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between rounded-xl bg-white dark:bg-[#202341] p-3 border border-slate-200/60 dark:border-[#30324F] text-xs">
                <span className="text-slate-500 dark:text-[#A1A1C2]">Total Items:</span>
                <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">{items.length}</span>
              </div>
              <div className="flex justify-between rounded-xl bg-white dark:bg-[#202341] p-3 border border-slate-200/60 dark:border-[#30324F] text-xs">
                <span className="text-slate-500 dark:text-[#A1A1C2]">Ready for Export:</span>
                <span className="font-bold text-emerald-600 dark:text-[#34D399]">
                  {items.filter(i => i.status === 'ready').length}
                </span>
              </div>
              <div className="flex justify-between rounded-xl bg-white dark:bg-[#202341] p-3 border border-slate-200/60 dark:border-[#30324F] text-xs">
                <span className="text-slate-500 dark:text-[#A1A1C2]">Resolution:</span>
                <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">600 x 600 px (PNG)</span>
              </div>

              {/* Animated Progress Bar */}
              {isGenerating && progress.total > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-indigo-700 dark:text-[#A78BFA] mb-1">
                    <span>Generating Batch...</span>
                    <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#202341]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-[#A78BFA] to-[#67E8F9] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping || items.filter(i => i.status === 'ready').length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-gradient-to-r dark:from-[#34D399] dark:to-[#67E8F9] py-3.5 text-xs font-bold text-white dark:text-[#0F1020] shadow-md hover:brightness-105 active:scale-98 disabled:opacity-40 transition-all"
            >
              {isZipping ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Packaging ZIP...</span>
                </>
              ) : (
                <>
                  <FileArchive className="h-4 w-4" />
                  <span>Download All as ZIP Archive</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Generated Grid Preview with Motion Cards */}
      {items.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F1F5F9]">
              Generated Batch ({items.filter(i => i.status === 'ready').length}/{items.length} ready)
            </h3>
            {items.some(i => i.status === 'ready') && (
              <button
                type="button"
                onClick={() => setItems([])}
                className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear Batch
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.4) }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="flex flex-col items-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] p-3 shadow-xs text-center transition-all hover:border-[#A78BFA] hover:shadow-md"
              >
                {item.status === 'generating' && (
                  <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-slate-50 dark:bg-[#15162B]">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600 dark:text-[#A78BFA]" />
                  </div>
                )}
                {item.status === 'ready' && item.dataUrl && (
                  <img
                    src={item.dataUrl}
                    alt={item.name}
                    className="h-32 w-32 rounded-xl object-contain border border-slate-100 dark:border-[#30324F] bg-white p-1"
                  />
                )}
                {item.status === 'pending' && (
                  <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-slate-50 dark:bg-[#15162B] text-xs text-slate-400 dark:text-[#A1A1C2]">
                    Pending
                  </div>
                )}
                {item.status === 'error' && (
                  <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-600 dark:text-rose-400 p-2">
                    {item.error || 'Failed'}
                  </div>
                )}

                <span className="mt-2 text-xs font-bold text-slate-800 dark:text-[#F1F5F9] line-clamp-1">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] text-slate-400 dark:text-[#A1A1C2] line-clamp-1 max-w-[130px]">
                  {item.data}
                </span>

                {item.status === 'ready' && item.dataUrl && (
                  <a
                    href={item.dataUrl}
                    download={`${item.name.replace(/[^a-z0-9_-]/gi, '_')}.png`}
                    className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-[#30324F] py-1.5 text-[11px] font-bold text-slate-700 dark:text-[#F1F5F9] hover:bg-slate-50 dark:hover:bg-[#202341] shadow-2xs"
                  >
                    <Download className="h-3 w-3" /> Save PNG
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
