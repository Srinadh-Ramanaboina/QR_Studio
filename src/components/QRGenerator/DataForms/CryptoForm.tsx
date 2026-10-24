import React from 'react';
import { Coins, Sparkles, Copy, Check, ShieldCheck } from 'lucide-react';
import { CryptoData } from '../../../types/qr';

interface CryptoFormProps {
  data: CryptoData;
  onChange: (data: CryptoData) => void;
}

export const CryptoForm: React.FC<CryptoFormProps> = ({ data, onChange }) => {
  const currencies: { id: CryptoData['currency']; name: string; symbol: string; placeholder: string; gradient: string }[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', placeholder: 'bc1q...', gradient: 'from-amber-500 to-orange-500' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', placeholder: '0x...', gradient: 'from-indigo-400 to-purple-500' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', placeholder: 'Solana wallet address...', gradient: 'from-teal-400 to-purple-500' },
    { id: 'tether', name: 'USDT (ERC-20)', symbol: 'USDT', placeholder: '0x...', gradient: 'from-emerald-400 to-teal-500' }
  ];

  const update = (patch: Partial<CryptoData>) => {
    onChange({ ...data, ...patch });
  };

  const currentCurrency = currencies.find(c => c.id === data.currency) || currencies[0];

  return (
    <div className="space-y-4">
      {/* Aurora Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#A78BFA] via-[#60A5FA] to-[#67E8F9] p-0.5 shadow-sm shadow-[#A78BFA]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0F1020]">
              <Coins className="h-3.5 w-3.5 text-[#67E8F9]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F1F5F9]">
              Cryptocurrency Payment Address
            </label>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border border-[#34D399]/40 bg-[#34D399]/10 text-[#34D399]">
          BIP-21 & Web3 Compatible
        </span>
      </div>

      {/* Asset Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          Select Crypto Asset
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {currencies.map(c => {
            const isSelected = data.currency === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => update({ currency: c.id })}
                className={`flex flex-col items-center justify-center rounded-xl p-3 border transition-all ${
                  isSelected
                    ? 'border-[#A78BFA] bg-indigo-50/70 dark:bg-[#202341] text-indigo-950 dark:text-[#F1F5F9] shadow-sm ring-1 ring-[#A78BFA]/40'
                    : 'border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] text-slate-700 dark:text-[#A1A1C2] hover:bg-slate-50 dark:hover:bg-[#202341]/60'
                }`}
              >
                <span className="text-xs font-black tracking-wide">{c.symbol}</span>
                <span className="text-[10px] text-slate-400 dark:text-[#A1A1C2] mt-0.5">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Receiving Address */}
      <div>
        <label htmlFor="crypto-address" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
          {currentCurrency.name} Receiving Address *
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#A78BFA]/30 via-[#60A5FA]/30 to-[#67E8F9]/30 opacity-40 blur-xs transition duration-300 group-hover:opacity-75 group-focus-within:opacity-100" />
          <input
            id="crypto-address"
            type="text"
            value={data.address}
            onChange={e => update({ address: e.target.value })}
            placeholder={currentCurrency.placeholder}
            className="relative w-full rounded-2xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-2.5 font-mono text-xs font-medium text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Amount & Label */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="crypto-amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
            Requested Amount ({currentCurrency.symbol})
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <input
              id="crypto-amount"
              type="number"
              step="any"
              value={data.amount}
              onChange={e => update({ amount: e.target.value })}
              placeholder="0.00"
              className="relative w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-2 font-mono text-xs font-bold text-slate-900 dark:text-[#F1F5F9] focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label htmlFor="crypto-label" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A1A1C2] mb-1.5">
            Note / Payment Reference
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A78BFA]/25 to-[#67E8F9]/25 opacity-30 blur-xs transition group-hover:opacity-70 group-focus-within:opacity-100" />
            <input
              id="crypto-label"
              type="text"
              value={data.label}
              onChange={e => update({ label: e.target.value })}
              placeholder="e.g. Donation or Invoice #409"
              className="relative w-full rounded-xl border border-slate-200 dark:border-[#30324F] bg-white dark:bg-[#15162B] px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder-[#A1A1C2]/50 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Aurora Helper HUD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#30324F] bg-slate-50/80 dark:bg-[#191B33]/80 p-3.5 backdrop-blur-md">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#67E8F9] text-[#0F1020]">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">Direct Wallet Payment: </span>
            <span className="text-slate-500 dark:text-[#A1A1C2]">
              Standard URI formatted code opens Trust Wallet, MetaMask, Coinbase Wallet, or Phantom with pre-filled destination address and exact sum.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
