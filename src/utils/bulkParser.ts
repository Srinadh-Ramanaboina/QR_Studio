export interface BulkQRItem {
  id: string;
  name: string;
  data: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
  error?: string;
  dataUrl?: string;
}

/**
 * Parses raw text input (comma-separated, tab-separated, or newline-separated).
 * Supports standard CSV format with optional header row:
 * "Name,URL" or simply one URL/text per line.
 */
export function parseBulkInput(rawText: string): BulkQRItem[] {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const items: BulkQRItem[] = [];
  let startIndex = 0;

  // Check if first row is header
  const firstLine = lines[0].toLowerCase();
  if (
    (firstLine.includes('name') || firstLine.includes('title')) &&
    (firstLine.includes('url') || firstLine.includes('data') || firstLine.includes('text') || firstLine.includes('value'))
  ) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    // Split by comma or tab if quoted/deliniated
    const parts = line.split(/[,\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));

    let name = `QR Code ${items.length + 1}`;
    let data = '';

    if (parts.length >= 2 && parts[1]) {
      name = parts[0] || name;
      data = parts.slice(1).join(',').trim();
    } else {
      data = parts[0];
      // Generate clean name from data if URL
      try {
        if (/^https?:\/\//i.test(data)) {
          const u = new URL(data);
          name = u.hostname.replace('www.', '') + (u.pathname !== '/' ? u.pathname : '');
        } else {
          name = data.length > 20 ? data.slice(0, 20) + '...' : data;
        }
      } catch {
        name = data.length > 20 ? data.slice(0, 20) + '...' : data;
      }
    }

    if (data) {
      items.push({
        id: `bulk-${Date.now()}-${items.length}-${Math.random().toString(36).substring(2, 7)}`,
        name,
        data,
        status: 'pending'
      });
    }
  }

  return items;
}
