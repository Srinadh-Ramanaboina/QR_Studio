import React from 'react';
import { User, Building, Phone, Mail, Globe, MapPin, Sparkles, Briefcase, FileText } from 'lucide-react';
import { VCardData } from '../../../types/qr';

interface VCardFormProps {
  data: VCardData;
  onChange: (data: VCardData) => void;
}

export const VCardForm: React.FC<VCardFormProps> = ({ data, onChange }) => {
  const update = (patch: Partial<VCardData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-5">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <User className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Digital Contact Card (vCard 3.0)
            </label>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]">
          Address Book Synced
        </span>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="vcard-fn" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            First Name *
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <input
              id="vcard-fn"
              type="text"
              value={data.firstName}
              onChange={e => update({ firstName: e.target.value })}
              placeholder="e.g. Alex"
              className="relative w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-2 text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
        <div>
          <label htmlFor="vcard-ln" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Last Name
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <input
              id="vcard-ln"
              type="text"
              value={data.lastName}
              onChange={e => update({ lastName: e.target.value })}
              placeholder="e.g. Morgan"
              className="relative w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-2 text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Company & Job Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="vcard-org" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Company / Organization
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-1.5">
              <Building className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
              <input
                id="vcard-org"
                type="text"
                value={data.organization}
                onChange={e => update({ organization: e.target.value })}
                placeholder="Acme Studio"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="vcard-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Job Title
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-1.5">
              <Briefcase className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
              <input
                id="vcard-title"
                type="text"
                value={data.jobTitle}
                onChange={e => update({ jobTitle: e.target.value })}
                placeholder="Creative Director"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="vcard-mobile" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Mobile Phone
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-1.5">
              <Phone className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
              <input
                id="vcard-mobile"
                type="tel"
                value={data.phoneMobile}
                onChange={e => update({ phoneMobile: e.target.value })}
                placeholder="+1 (555) 019-2831"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="vcard-work-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Work Phone
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-1.5">
              <Phone className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
              <input
                id="vcard-work-phone"
                type="tel"
                value={data.phoneWork}
                onChange={e => update({ phoneWork: e.target.value })}
                placeholder="+1 (555) 010-0044"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="vcard-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-1.5">
              <Mail className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
              <input
                id="vcard-email"
                type="email"
                value={data.email}
                onChange={e => update({ email: e.target.value })}
                placeholder="alex@apexstudio.io"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="vcard-url" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Website URL
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-1.5">
              <Globe className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
              <input
                id="vcard-url"
                type="text"
                value={data.url}
                onChange={e => update({ url: e.target.value })}
                placeholder="https://apexstudio.io"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label htmlFor="vcard-street" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Street Address
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-1.5">
              <MapPin className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
              <input
                id="vcard-street"
                type="text"
                value={data.street}
                onChange={e => update({ street: e.target.value })}
                placeholder="500 Howard Street"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="vcard-city" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            City
          </label>
          <input
            id="vcard-city"
            type="text"
            value={data.city}
            onChange={e => update({ city: e.target.value })}
            placeholder="San Francisco"
            className="w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-2 text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Notes / Bio */}
      <div>
        <label htmlFor="vcard-note" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
          Bio / Notes
        </label>
        <textarea
          id="vcard-note"
          rows={2}
          value={data.note}
          onChange={e => update({ note: e.target.value })}
          placeholder="Specialized in modern web platforms & brand design."
          className="w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-3 text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden focus:border-[#A78BFA]"
        />
      </div>

      {/* Aurora Helper HUD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#191B33]/80 p-3.5 backdrop-blur-md">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">Instant Address Book Import: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Standardized format adds name, photo, phone, and company to Apple Contacts or Google Contacts in a single click.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
