import React, { useState } from 'react';
import { Compass, Navigation, Loader2, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { GeoData } from '../../../types/qr';

interface GeoFormProps {
  data: GeoData;
  onChange: (data: GeoData) => void;
}

export const GeoForm: React.FC<GeoFormProps> = ({ data, onChange }) => {
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        onChange({
          ...data,
          latitude: Math.round(pos.coords.latitude * 100000) / 100000,
          longitude: Math.round(pos.coords.longitude * 100000) / 100000,
          query: 'My Current Location'
        });
        setDetecting(false);
      },
      err => {
        setError(err.message || 'Unable to retrieve location.');
        setDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  const presetLocations = [
    { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
    { name: 'New York City', lat: 40.7128, lon: -74.006 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
  ];

  return (
    <div className="space-y-4">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <Compass className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Geographic Coordinates & Pin
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={detecting}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#A78BFA]/40 bg-[#A78BFA]/10 px-3 py-1 text-xs font-semibold text-[#A78BFA] hover:bg-[#A78BFA]/20 transition-all disabled:opacity-50"
        >
          {detecting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Navigation className="h-3 w-3" />
          )}
          <span>Detect Location</span>
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-500 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/30">
          {error}
        </p>
      )}

      {/* Lat & Lon inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="geo-lat" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Latitude (-90 to +90)
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <input
              id="geo-lat"
              type="number"
              step="any"
              value={data.latitude}
              onChange={e => onChange({ ...data, latitude: parseFloat(e.target.value) || 0 })}
              className="relative w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-2 font-mono text-sm text-slate-900 dark:text-[#F1F5F9] focus:outline-hidden"
            />
          </div>
        </div>
        <div>
          <label htmlFor="geo-lon" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
            Longitude (-180 to +180)
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <input
              id="geo-lon"
              type="number"
              step="any"
              value={data.longitude}
              onChange={e => onChange({ ...data, longitude: parseFloat(e.target.value) || 0 })}
              className="relative w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-2 font-mono text-sm text-slate-900 dark:text-[#F1F5F9] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Place Label or Search Query */}
      <div>
        <label htmlFor="geo-query" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1">
          Place Name or Description
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
          <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3 py-1.5">
            <MapPin className="h-4 w-4 text-slate-400 dark:text-[#A1A1C2] mr-2 shrink-0" />
            <input
              id="geo-query"
              type="text"
              value={data.query || ''}
              onChange={e => onChange({ ...data, query: e.target.value })}
              placeholder="e.g. Convention Center Main Entrance"
              className="w-full bg-transparent text-sm text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Quick City Presets */}
      <div>
        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Popular City Coordinates
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presetLocations.map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => onChange({ latitude: p.lat, longitude: p.lon, query: p.name })}
              className="rounded-lg border border-slate-200 dark:border-[#30324F] bg-slate-100/70 dark:bg-[#202341] px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-[#F1F5F9] hover:border-[#A78BFA] hover:text-[#A78BFA] transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Aurora Helper HUD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#191B33]/80 p-3.5 backdrop-blur-md">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">Direct Navigation Pin: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Scanning opens Google Maps, Apple Maps, or Waze immediately positioned at ({data.latitude}, {data.longitude}), ready for turn-by-turn driving or walking directions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
