import {
  WifiData,
  VCardData,
  EmailData,
  SmsData,
  GeoData,
  EventData,
  CryptoData,
  SocialData,
  QRDataType
} from '../types/qr';

export function formatUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function formatWifi(data: WifiData): string {
  // WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
  // Escape special characters in SSID and password: \ ; , : "
  const escapeWifi = (str: string) => {
    return str.replace(/([\\;,:""])/g, '\\$1');
  };

  const t = data.encryption || 'WPA';
  const s = escapeWifi(data.ssid || '');
  const p = data.encryption === 'nopass' ? '' : escapeWifi(data.password || '');
  const h = data.hidden ? 'true' : 'false';

  return `WIFI:T:${t};S:${s};P:${p};H:${h};;`;
}

export function formatVCard(data: VCardData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const fn = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
  if (fn) {
    lines.push(`FN:${fn}`);
    lines.push(`N:${data.lastName || ''};${data.firstName || ''};;;`);
  } else {
    lines.push('FN:Contact');
    lines.push('N:;;;;');
  }

  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.jobTitle) lines.push(`TITLE:${data.jobTitle}`);
  if (data.phoneMobile) lines.push(`TEL;TYPE=CELL:${data.phoneMobile}`);
  if (data.phoneWork) lines.push(`TEL;TYPE=WORK,VOICE:${data.phoneWork}`);
  if (data.email) lines.push(`EMAIL;TYPE=PREF,INTERNET:${data.email}`);
  if (data.url) lines.push(`URL:${formatUrl(data.url)}`);

  const hasAddress = data.street || data.city || data.state || data.zip || data.country;
  if (hasAddress) {
    lines.push(
      `ADR;TYPE=WORK:;;${data.street || ''};${data.city || ''};${data.state || ''};${data.zip || ''};${data.country || ''}`
    );
  }

  if (data.note) lines.push(`NOTE:${data.note.replace(/\n/g, '\\n')}`);
  lines.push('END:VCARD');

  return lines.join('\n');
}

export function formatEmail(data: EmailData): string {
  const to = encodeURIComponent(data.to.trim());
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${to}${query}`;
}

export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  return `tel:${cleanPhone}`;
}

export function formatSms(data: SmsData): string {
  const cleanPhone = data.phone.replace(/[\s()-]/g, '');
  if (data.message) {
    return `smsto:${cleanPhone}:${data.message}`;
  }
  return `smsto:${cleanPhone}`;
}

export function formatGeo(data: GeoData): string {
  const lat = typeof data.latitude === 'string' ? parseFloat(data.latitude) || 0 : data.latitude;
  const lon = typeof data.longitude === 'string' ? parseFloat(data.longitude) || 0 : data.longitude;
  
  if (data.query) {
    return `geo:${lat},${lon}?q=${encodeURIComponent(data.query)}`;
  }
  return `geo:${lat},${lon}`;
}

export function formatEvent(data: EventData): string {
  // iCalendar standard format
  const formatIsoForCal = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QR Studio//EN',
    'BEGIN:VEVENT'
  ];

  if (data.title) lines.push(`SUMMARY:${data.title}`);
  if (data.location) lines.push(`LOCATION:${data.location}`);
  if (data.description) lines.push(`DESCRIPTION:${data.description.replace(/\n/g, '\\n')}`);
  
  const start = formatIsoForCal(data.startDate);
  if (start) lines.push(`DTSTART:${start}`);
  
  const end = formatIsoForCal(data.endDate);
  if (end) lines.push(`DTEND:${end}`);

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\n');
}

export function formatCrypto(data: CryptoData): string {
  const addr = data.address.trim();
  const params: string[] = [];
  if (data.amount && parseFloat(data.amount) > 0) {
    params.push(`amount=${encodeURIComponent(data.amount)}`);
  }
  if (data.label) {
    params.push(`label=${encodeURIComponent(data.label)}`);
  }
  if (data.message) {
    params.push(`message=${encodeURIComponent(data.message)}`);
  }

  const query = params.length > 0 ? `?${params.join('&')}` : '';

  switch (data.currency) {
    case 'bitcoin':
      return `bitcoin:${addr}${query}`;
    case 'ethereum':
      return `ethereum:${addr}${query}`;
    case 'solana':
      return `solana:${addr}${query}`;
    case 'tether':
      return `ethereum:${addr}?contractAddress=0xdac17f958d2ee523a2206206994597c13d831ec7${params.length > 0 ? `&${params.join('&')}` : ''}`;
    default:
      return addr;
  }
}

export function formatSocial(data: SocialData): string {
  const username = data.username.trim().replace(/^@/, '');
  switch (data.platform) {
    case 'instagram':
      return `https://instagram.com/${username}`;
    case 'x':
      return `https://x.com/${username}`;
    case 'linkedin':
      return username.startsWith('http') ? username : `https://linkedin.com/in/${username}`;
    case 'youtube':
      return `https://youtube.com/@${username}`;
    case 'whatsapp': {
      const cleanNum = username.replace(/[\s+()-]/g, '');
      return `https://wa.me/${cleanNum}`;
    }
    case 'github':
      return `https://github.com/${username}`;
    case 'tiktok':
      return `https://tiktok.com/@${username}`;
    case 'spotify':
      return username.startsWith('http') ? username : `https://open.spotify.com/user/${username}`;
    default:
      return username;
  }
}

export function getPayloadForType(type: QRDataType, data: any): string {
  switch (type) {
    case 'url':
      return formatUrl(data.url || '');
    case 'text':
      return data.text || '';
    case 'wifi':
      return formatWifi(data);
    case 'vcard':
      return formatVCard(data);
    case 'email':
      return formatEmail(data);
    case 'phone':
      return formatPhone(data.phone || '');
    case 'sms':
      return formatSms(data);
    case 'geo':
      return formatGeo(data);
    case 'event':
      return formatEvent(data);
    case 'crypto':
      return formatCrypto(data);
    case 'social':
      return formatSocial(data);
    default:
      return '';
  }
}
