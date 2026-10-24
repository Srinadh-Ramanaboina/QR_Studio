import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Wifi,
  User,
  AlignLeft,
  Mail,
  Phone,
  MessageSquare,
  Compass,
  Calendar,
  Coins,
  Share2,
  Sparkles,
  Info
} from 'lucide-react';
import {
  QRDataType,
  QRDesignConfig,
  WifiData,
  VCardData,
  EmailData,
  SmsData,
  GeoData,
  EventData,
  CryptoData,
  SocialData,
  QRItemHistory
} from '../../types/qr';
import { DEFAULT_DESIGN } from '../../utils/qrPresets';
import { getPayloadForType } from '../../utils/qrPayloads';
import { saveHistoryItem } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import { saveCloudQRCode } from '../../services/firebase';

import { UrlForm } from './DataForms/UrlForm';
import { WifiForm } from './DataForms/WifiForm';
import { VCardForm } from './DataForms/VCardForm';
import { TextForm } from './DataForms/TextForm';
import { EmailForm } from './DataForms/EmailForm';
import { PhoneForm } from './DataForms/PhoneForm';
import { SmsForm } from './DataForms/SmsForm';
import { GeoForm } from './DataForms/GeoForm';
import { EventForm } from './DataForms/EventForm';
import { CryptoForm } from './DataForms/CryptoForm';
import { SocialForm } from './DataForms/SocialForm';

import { CustomizationPanel } from './CustomizationPanel';
import { QRPreview } from './QRPreview';
import { PrintModal } from '../PrintModal';

interface QRGeneratorProps {
  initialPayload?: string;
  initialType?: QRDataType;
  initialDesign?: QRDesignConfig;
  onHistoryUpdated: (history: QRItemHistory[]) => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  initialPayload,
  initialType = 'url',
  initialDesign = DEFAULT_DESIGN,
  onHistoryUpdated
}) => {
  const [selectedType, setSelectedType] = useState<QRDataType>(initialType);
  const [design, setDesign] = useState<QRDesignConfig>(initialDesign);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const { user } = useAuth();

  // Separate state for each format so data isn't destroyed when switching tabs
  const [url, setUrl] = useState<string>(
    initialPayload && initialType === 'url' ? initialPayload : 'https://google.com'
  );

  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: 'Guest_WiFi_5G',
    password: 'SuperSecretPassword',
    encryption: 'WPA',
    hidden: false
  });

  const [vcardData, setVCardData] = useState<VCardData>({
    firstName: 'Alex',
    lastName: 'Morgan',
    organization: 'Apex Studio',
    jobTitle: 'Creative Director',
    phoneMobile: '+1 555-019-2831',
    phoneWork: '',
    email: 'alex@apexstudio.io',
    url: 'https://apexstudio.io',
    street: '500 Howard Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'USA',
    note: 'Specialized in modern web platforms & brand design.'
  });

  const [text, setText] = useState<string>(
    initialPayload && initialType === 'text'
      ? initialPayload
      : 'Welcome to QR Studio — generate, customize, and export vector QR codes locally.'
  );

  const [emailData, setEmailData] = useState<EmailData>({
    to: 'hello@company.com',
    subject: 'Project Inquiry',
    body: 'Hi team, I would like to inquire about your services...'
  });

  const [phone, setPhone] = useState<string>('+15551234567');

  const [smsData, setSmsData] = useState<SmsData>({
    phone: '+15551234567',
    message: 'Hello! I scanned your QR code.'
  });

  const [geoData, setGeoData] = useState<GeoData>({
    latitude: 37.7749,
    longitude: -122.4194,
    query: 'San Francisco, CA'
  });

  const [eventData, setEventData] = useState<EventData>({
    title: 'Design & Tech Summit 2026',
    location: 'Moscone Convention Center, San Francisco',
    description: 'Annual flagship technology gathering.',
    startDate: '2026-11-15T09:00',
    endDate: '2026-11-15T18:00',
    allDay: false
  });

  const [cryptoData, setCryptoData] = useState<CryptoData>({
    currency: 'bitcoin',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    amount: '0.005',
    label: 'Studio Donation'
  });

  const [socialData, setSocialData] = useState<SocialData>({
    platform: 'instagram',
    username: 'qrstudio'
  });

  // Calculate current payload based on active type
  const payload = useMemo(() => {
    switch (selectedType) {
      case 'url':
        return getPayloadForType('url', { url });
      case 'wifi':
        return getPayloadForType('wifi', wifiData);
      case 'vcard':
        return getPayloadForType('vcard', vcardData);
      case 'text':
        return getPayloadForType('text', { text });
      case 'email':
        return getPayloadForType('email', emailData);
      case 'phone':
        return getPayloadForType('phone', { phone });
      case 'sms':
        return getPayloadForType('sms', smsData);
      case 'geo':
        return getPayloadForType('geo', geoData);
      case 'event':
        return getPayloadForType('event', eventData);
      case 'crypto':
        return getPayloadForType('crypto', cryptoData);
      case 'social':
        return getPayloadForType('social', socialData);
      default:
        return url;
    }
  }, [
    selectedType,
    url,
    wifiData,
    vcardData,
    text,
    emailData,
    phone,
    smsData,
    geoData,
    eventData,
    cryptoData,
    socialData
  ]);

  const handleUpdateDesign = (patch: Partial<QRDesignConfig>) => {
    setDesign(prev => ({ ...prev, ...patch }));
  };

  const handleApplyPreset = (presetDesign: Partial<QRDesignConfig>) => {
    setDesign(prev => ({ ...prev, ...presetDesign }));
  };

  const handleSaveToHistory = (thumbnail: string) => {
    const title =
      selectedType === 'url'
        ? url || 'Website QR'
        : selectedType === 'wifi'
        ? `Wi-Fi: ${wifiData.ssid}`
        : selectedType === 'vcard'
        ? `vCard: ${vcardData.firstName} ${vcardData.lastName}`
        : selectedType === 'event'
        ? `Event: ${eventData.title}`
        : `${selectedType.toUpperCase()} Code`;

    const newItem: QRItemHistory = {
      id: `qr-${Date.now()}`,
      type: selectedType,
      title,
      payload,
      createdAt: Date.now(),
      design,
      thumbnail
    };

    const updated = saveHistoryItem(newItem);
    onHistoryUpdated(updated);

    if (user) {
      saveCloudQRCode(user.uid, newItem).catch(err => {
        console.warn('Could not save to cloud:', err);
      });
    }
  };

  const typesList: { id: QRDataType; label: string; icon: any }[] = [
    { id: 'url', label: 'Website URL', icon: Globe },
    { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
    { id: 'vcard', label: 'vCard Contact', icon: User },
    { id: 'text', label: 'Plain Text', icon: AlignLeft },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone Call', icon: Phone },
    { id: 'sms', label: 'SMS Message', icon: MessageSquare },
    { id: 'geo', label: 'Location / Geo', icon: Compass },
    { id: 'event', label: 'Calendar Event', icon: Calendar },
    { id: 'crypto', label: 'Crypto Asset', icon: Coins },
    { id: 'social', label: 'Social Profile', icon: Share2 }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Format Selector Bar with sliding active indicator */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex gap-2 min-w-max p-1.5 bg-slate-100/70 dark:bg-[#15162B] rounded-2xl border border-slate-200/60 dark:border-[#30324F] shadow-inner">
          {typesList.map(item => {
            const Icon = item.icon;
            const isSelected = selectedType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedType(item.id)}
                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all z-10 ${
                  isSelected
                    ? 'text-white dark:text-[#0F1020]'
                    : 'text-slate-600 dark:text-[#A1A1C2] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-white/50 dark:hover:bg-[#202341]/60'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="format-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 z-[-1] rounded-xl bg-slate-900 dark:bg-gradient-to-r dark:from-[#A78BFA] dark:via-[#60A5FA] dark:to-[#67E8F9] shadow-md shadow-slate-900/20 dark:shadow-[#A78BFA]/30"
                  />
                )}
                <Icon
                  className={`h-4 w-4 transition-transform ${
                    isSelected ? 'text-indigo-400 dark:text-[#0F1020] scale-110' : 'text-slate-500 dark:text-[#A1A1C2]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid: Left Configuration & Right Live Stage */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Data Form & Customization Panels */}
        <div className="space-y-6 lg:col-span-7">
          {/* Data Form Card */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-[#30324F] bg-white/90 dark:bg-[#191B33]/90 backdrop-blur-xl p-5 shadow-sm sm:p-6 transition-colors">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-[#30324F] pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-[#F1F5F9]">
                  {typesList.find(t => t.id === selectedType)?.label} Data
                </h3>
                <p className="text-xs text-slate-400 dark:text-[#A1A1C2]">
                  Fill in the fields below. QR code updates in real-time.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-[#202341] border border-slate-200 dark:border-[#30324F] px-2.5 py-0.5 text-[11px] font-mono text-slate-600 dark:text-[#A78BFA]">
                Local Zero-Cloud
              </span>
            </div>

            {/* Animated Active Form Switcher */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {selectedType === 'url' && <UrlForm url={url} onChange={setUrl} />}
                {selectedType === 'wifi' && (
                  <WifiForm data={wifiData} onChange={setWifiData} />
                )}
                {selectedType === 'vcard' && (
                  <VCardForm data={vcardData} onChange={setVCardData} />
                )}
                {selectedType === 'text' && <TextForm text={text} onChange={setText} />}
                {selectedType === 'email' && (
                  <EmailForm data={emailData} onChange={setEmailData} />
                )}
                {selectedType === 'phone' && (
                  <PhoneForm phone={phone} onChange={setPhone} />
                )}
                {selectedType === 'sms' && (
                  <SmsForm data={smsData} onChange={setSmsData} />
                )}
                {selectedType === 'geo' && (
                  <GeoForm data={geoData} onChange={setGeoData} />
                )}
                {selectedType === 'event' && (
                  <EventForm data={eventData} onChange={setEventData} />
                )}
                {selectedType === 'crypto' && (
                  <CryptoForm data={cryptoData} onChange={setCryptoData} />
                )}
                {selectedType === 'social' && (
                  <SocialForm data={socialData} onChange={setSocialData} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile QR Preview & Download Stage */}
          <div className="block lg:hidden rounded-3xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#191B33] p-4 shadow-sm">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] text-center">
              Live QR Preview & Quick Export
            </h4>
            <QRPreview
              payload={payload}
              type={selectedType}
              design={design}
              onSaveHistory={handleSaveToHistory}
              onOpenPrint={() => setIsPrintModalOpen(true)}
            />
          </div>

          {/* Customization Accordion */}
          <div id="customization-panel">
            <CustomizationPanel
              design={design}
              onChange={handleUpdateDesign}
              onApplyPreset={handleApplyPreset}
            />
          </div>
        </div>

        {/* Right Column: Desktop Live Preview & Downloads */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="sticky top-20 space-y-6">
            <QRPreview
              payload={payload}
              type={selectedType}
              design={design}
              onSaveHistory={handleSaveToHistory}
              onOpenPrint={() => setIsPrintModalOpen(true)}
            />

            {/* Production Quality Specs & Best Practices Callout */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/60 dark:bg-[#191B33]/80 p-4 text-xs text-slate-600 dark:text-[#A1A1C2] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-[#F1F5F9]">
                <Info className="h-4 w-4 text-indigo-600 dark:text-[#A78BFA]" />
                <span>Production & Print Guidelines</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-[#A1A1C2] text-[11px] leading-relaxed">
                <li>
                  <strong className="text-slate-700 dark:text-[#F1F5F9]">Vector SVG:</strong> Infinite resolution without pixelation, ideal for Adobe Illustrator, Canva, packaging, and large signage.
                </li>
                <li>
                  <strong className="text-slate-700 dark:text-[#F1F5F9]">Minimum Print Size:</strong> At least 2 x 2 cm (0.8 x 0.8 in) for standard scan distances up to 30 cm.
                </li>
                <li>
                  <strong className="text-slate-700 dark:text-[#F1F5F9]">Error Correction:</strong> Currently set to <strong>{design.errorCorrectionLevel}</strong>. Level H is automatically applied with logos.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        payload={payload}
        type={selectedType}
        design={design}
      />
    </div>
  );
};
