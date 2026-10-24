/**
 * Calculates luminance and WCAG contrast ratio for QR code readability verification.
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map(char => char + char)
      .join('');
  }
  if (cleanHex.length !== 6) {
    return null;
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ScannabilityAssessment {
  contrastRatio: number;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  score: number; // 0 - 100
  message: string;
  isBackgroundLighter: boolean;
}

export function evaluateScannability(
  fgHex: string,
  bgHex: string,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H',
  hasLogo: boolean
): ScannabilityAssessment {
  const rgbFg = hexToRgb(fgHex) || { r: 0, g: 0, b: 0 };
  const rgbBg = hexToRgb(bgHex) || { r: 255, g: 255, b: 255 };

  const lumFg = getRelativeLuminance(rgbFg.r, rgbFg.g, rgbFg.b);
  const lumBg = getRelativeLuminance(rgbBg.r, rgbBg.g, rgbBg.b);
  const ratio = (Math.max(lumFg, lumBg) + 0.05) / (Math.min(lumFg, lumBg) + 0.05);
  const isBgLighter = lumBg >= lumFg;

  let baseScore = Math.min(100, Math.round((ratio / 7) * 75));
  if (ratio >= 7) baseScore = 90;
  if (ratio >= 10) baseScore = 98;

  // Inverted QR code penalty: many standard phone cameras struggle if background is darker than foreground
  if (!isBgLighter) {
    baseScore = Math.max(30, baseScore - 25);
  }

  // Error correction boost or penalty
  if (hasLogo) {
    if (errorCorrectionLevel === 'L' || errorCorrectionLevel === 'M') {
      baseScore = Math.max(20, baseScore - 30);
    } else {
      baseScore = Math.min(100, baseScore + 5);
    }
  }

  let status: ScannabilityAssessment['status'] = 'poor';
  let message = 'Contrast is too low. Scanners may fail to read this QR code.';

  if (baseScore >= 85) {
    status = 'excellent';
    message = 'High contrast and clean scannability. Works reliably across all phones and cameras.';
  } else if (baseScore >= 70) {
    status = 'good';
    message = 'Good contrast. Recommended for digital screens and modern cameras.';
  } else if (baseScore >= 45) {
    status = 'warning';
    if (!isBgLighter) {
      message = 'Inverted colors (dark background, light dots) may fail on older phone cameras.';
    } else if (hasLogo && (errorCorrectionLevel === 'L' || errorCorrectionLevel === 'M')) {
      message = 'Increase Error Correction to High (30%) when using a center logo.';
    } else {
      message = 'Borderline contrast. Increase contrast for dependable scanning in low light.';
    }
  }

  return {
    contrastRatio: Math.round(ratio * 10) / 10,
    status,
    score: baseScore,
    message,
    isBackgroundLighter: isBgLighter
  };
}
