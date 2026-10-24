import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, FileText } from 'lucide-react';
import { EventData } from '../../../types/qr';

interface EventFormProps {
  data: EventData;
  onChange: (data: EventData) => void;
}

export const EventForm: React.FC<EventFormProps> = ({ data, onChange }) => {
  const update = (patch: Partial<EventData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-4">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <Calendar className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label htmlFor="event-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Calendar Event (.ics / VEVENT)
            </label>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]">
          One-Tap Add to Calendar
        </span>
      </div>

      {/* Event Title */}
      <div>
        <label htmlFor="event-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Event Title *
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100" />
          <input
            id="event-title"
            type="text"
            value={data.title}
            onChange={e => update({ title: e.target.value })}
            placeholder="e.g. Design & Tech Summit 2026 or Birthday Gala"
            className="relative w-full rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Location / Venue */}
      <div>
        <label htmlFor="event-location" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Location / Venue / URL
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
          <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-1.5">
            <MapPin className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
            <input
              id="event-location"
              type="text"
              value={data.location}
              onChange={e => update({ location: e.target.value })}
              placeholder="e.g. Grand Ballroom, Hilton Downtown or Zoom Link"
              className="w-full bg-transparent text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Start and End Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="event-start" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
            Start Date & Time
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <input
              id="event-start"
              type="datetime-local"
              value={data.startDate}
              onChange={e => update({ startDate: e.target.value })}
              className="relative w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-[#F1F5F9] focus:outline-hidden"
            />
          </div>
        </div>
        <div>
          <label htmlFor="event-end" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
            End Date & Time
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <input
              id="event-end"
              type="datetime-local"
              value={data.endDate}
              onChange={e => update({ endDate: e.target.value })}
              className="relative w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-[#F1F5F9] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="event-desc" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Event Details / Agenda
        </label>
        <textarea
          id="event-desc"
          rows={3}
          value={data.description}
          onChange={e => update({ description: e.target.value })}
          placeholder="Brief agenda or instructions for attendees..."
          className="w-full rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] p-3 text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden focus:border-[#A78BFA]"
        />
      </div>

      {/* Aurora Helper HUD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#191B33]/80 p-3.5 backdrop-blur-md">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">Cross-Calendar Compatibility: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Scanned codes prompt users to create an event with exact dates and reminders synced to Google Calendar, Apple Calendar, or Microsoft 365.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
