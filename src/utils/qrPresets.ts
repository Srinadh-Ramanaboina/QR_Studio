import { QRDesignConfig } from '../types/qr';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  design: Partial<QRDesignConfig>;
}

export const DEFAULT_DESIGN: QRDesignConfig = {
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  foregroundColor: '#0f172a',
  backgroundColor: '#ffffff',
  transparentBackground: false,
  gradient: {
    type: 'none',
    color1: '#0f172a',
    color2: '#2563eb',
    rotation: 45
  },
  customEyeColor: false,
  cornerSquareColor: '#0f172a',
  cornerDotColor: '#2563eb',
  logoUrl: undefined,
  logoSize: 0.25,
  logoMargin: 4,
  hideBackgroundDots: true,
  frameType: 'none',
  frameText: 'SCAN ME',
  frameColor: '#0f172a',
  frameTextColor: '#ffffff',
  errorCorrectionLevel: 'M',
  size: 320,
  margin: 10
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'aurora-ai',
    name: 'Aurora AI',
    description: 'Signature purple, blue & cyan gradient with smooth dots',
    design: {
      dotType: 'extra-rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      foregroundColor: '#191B33',
      backgroundColor: '#ffffff',
      transparentBackground: false,
      gradient: {
        type: 'linear',
        color1: '#7C3AED',
        color2: '#06B6D4',
        rotation: 135
      },
      customEyeColor: true,
      cornerSquareColor: '#6D28D9',
      cornerDotColor: '#0284C7',
      frameType: 'none'
    }
  },
  {
    id: 'classic-minimal',
    name: 'Classic Minimal',
    description: 'Crisp black & white with smooth rounded corners',
    design: {
      dotType: 'rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      foregroundColor: '#0f172a',
      backgroundColor: '#ffffff',
      transparentBackground: false,
      gradient: { type: 'none', color1: '#0f172a', color2: '#2563eb', rotation: 0 },
      customEyeColor: false,
      frameType: 'none'
    }
  },
  {
    id: 'electric-indigo',
    name: 'Electric Indigo',
    description: 'Vibrant tech gradient from indigo to violet',
    design: {
      dotType: 'extra-rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      foregroundColor: '#4338ca',
      backgroundColor: '#ffffff',
      transparentBackground: false,
      gradient: {
        type: 'linear',
        color1: '#4f46e5',
        color2: '#7c3aed',
        rotation: 45
      },
      customEyeColor: true,
      cornerSquareColor: '#4338ca',
      cornerDotColor: '#6366f1',
      frameType: 'none'
    }
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Luxe',
    description: 'Sophisticated deep emerald with classy dots',
    design: {
      dotType: 'classy-rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      foregroundColor: '#064e3b',
      backgroundColor: '#f0fdf4',
      transparentBackground: false,
      gradient: {
        type: 'linear',
        color1: '#064e3b',
        color2: '#059669',
        rotation: 135
      },
      customEyeColor: true,
      cornerSquareColor: '#064e3b',
      cornerDotColor: '#10b981',
      frameType: 'none'
    }
  },
  {
    id: 'sunset-burst',
    name: 'Sunset Glow',
    description: 'Warm coral and sunset gold gradient',
    design: {
      dotType: 'dots',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      foregroundColor: '#ea580c',
      backgroundColor: '#fffbeb',
      transparentBackground: false,
      gradient: {
        type: 'linear',
        color1: '#dc2626',
        color2: '#f59e0b',
        rotation: 45
      },
      customEyeColor: true,
      cornerSquareColor: '#dc2626',
      cornerDotColor: '#f59e0b',
      frameType: 'none'
    }
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk',
    description: 'High energy cyan and electric blue on dark surface',
    design: {
      dotType: 'square',
      cornerSquareType: 'square',
      cornerDotType: 'square',
      foregroundColor: '#06b6d4',
      backgroundColor: '#090d16',
      transparentBackground: false,
      gradient: {
        type: 'linear',
        color1: '#06b6d4',
        color2: '#3b82f6',
        rotation: 90
      },
      customEyeColor: true,
      cornerSquareColor: '#06b6d4',
      cornerDotColor: '#38bdf8',
      frameType: 'none'
    }
  },
  {
    id: 'corporate-badge',
    name: 'Branded Badge',
    description: 'Professional navy with SCAN ME badge frame',
    design: {
      dotType: 'rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      foregroundColor: '#1e293b',
      backgroundColor: '#ffffff',
      transparentBackground: false,
      gradient: { type: 'none', color1: '#1e293b', color2: '#0f172a', rotation: 0 },
      customEyeColor: false,
      frameType: 'bottom-badge',
      frameText: 'SCAN ME',
      frameColor: '#1e293b',
      frameTextColor: '#ffffff'
    }
  }
];

export const POPULAR_LOGOS = [
  { name: 'Website', icon: 'globe', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>` },
  { name: 'Wi-Fi', icon: 'wifi', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>` },
  { name: 'Instagram', icon: 'instagram', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e1306c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>` },
  { name: 'WhatsApp', icon: 'message-circle', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>` },
  { name: 'LinkedIn', icon: 'linkedin', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>` },
  { name: 'GitHub', icon: 'github', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#181717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>` },
  { name: 'Mail', icon: 'mail', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>` },
  { name: 'Star', icon: 'star', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` }
];

export function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}
