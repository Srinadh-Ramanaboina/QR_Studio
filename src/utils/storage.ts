import { QRItemHistory, QRDesignConfig } from '../types/qr';

const HISTORY_KEY = 'qr_studio_history_v1';
const PRESETS_KEY = 'qr_studio_custom_presets_v1';

export function getHistory(): QRItemHistory[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read history from localStorage', e);
    return [];
  }
}

export function saveHistoryItem(item: QRItemHistory): QRItemHistory[] {
  try {
    const current = getHistory();
    // Prepend and limit to max 50 items
    const filtered = current.filter(i => i.id !== item.id);
    const updated = [item, ...filtered].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save history item to localStorage', e);
    return getHistory();
  }
}

export function deleteHistoryItem(id: string): QRItemHistory[] {
  try {
    const current = getHistory();
    const updated = current.filter(i => i.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete history item', e);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}

export interface CustomPreset {
  id: string;
  name: string;
  design: QRDesignConfig;
}

export function getCustomPresets(): CustomPreset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomPreset(preset: CustomPreset): CustomPreset[] {
  try {
    const current = getCustomPresets();
    const updated = [preset, ...current.filter(p => p.id !== preset.id)];
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteCustomPreset(id: string): CustomPreset[] {
  try {
    const current = getCustomPresets();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
