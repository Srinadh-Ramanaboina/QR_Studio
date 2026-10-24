export type QRDataType =
  | 'url'
  | 'text'
  | 'wifi'
  | 'vcard'
  | 'email'
  | 'phone'
  | 'sms'
  | 'geo'
  | 'event'
  | 'crypto'
  | 'social';

export type DotType =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'extra-rounded'
  | 'classy'
  | 'classy-rounded';

export type CornerSquareType = 'square' | 'extra-rounded' | 'dot';
export type CornerDotType = 'square' | 'dot';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type GradientType = 'none' | 'linear' | 'radial';

export interface GradientConfig {
  type: GradientType;
  color1: string;
  color2: string;
  rotation: number;
}

export type FrameType =
  | 'none'
  | 'bottom-badge'
  | 'top-badge'
  | 'rounded-card'
  | 'phone-frame'
  | 'minimal-border';

export interface QRDesignConfig {
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  
  // Colors
  foregroundColor: string;
  backgroundColor: string;
  transparentBackground: boolean;
  gradient: GradientConfig;
  
  // Corner Custom Colors (optional custom override)
  customEyeColor: boolean;
  cornerSquareColor: string;
  cornerDotColor: string;
  
  // Logo
  logoUrl?: string;
  logoSize: number; // 0.1 to 0.4
  logoMargin: number; // 0 to 20
  hideBackgroundDots: boolean;
  
  // Frame
  frameType: FrameType;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
  
  // Quality & Error Correction
  errorCorrectionLevel: ErrorCorrectionLevel;
  size: number;
  margin: number;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  jobTitle: string;
  phoneWork: string;
  phoneMobile: string;
  email: string;
  url: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  note: string;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface GeoData {
  latitude: number | string;
  longitude: number | string;
  query?: string;
}

export interface EventData {
  title: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
}

export interface CryptoData {
  currency: 'bitcoin' | 'ethereum' | 'solana' | 'tether';
  address: string;
  amount: string;
  label?: string;
  message?: string;
}

export interface SocialData {
  platform: 'instagram' | 'x' | 'linkedin' | 'youtube' | 'whatsapp' | 'github' | 'tiktok' | 'spotify';
  username: string;
}

export interface QRItemHistory {
  id: string;
  type: QRDataType;
  title: string;
  payload: string;
  createdAt: number;
  design: QRDesignConfig;
  thumbnail?: string;
}
