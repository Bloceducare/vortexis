'use client';

import React from 'react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useShallow } from 'zustand/react/shallow';
import { NavigationProps } from '@/components/Interface';
import { FieldError, FieldLabel, useFieldError } from './FormField';
import dynamic from "next/dynamic";
import { ArrowLeftIcon, TrophyIcon, ChevronDownIcon } from 'lucide-react';
import { CURRENCY_OPTIONS } from '@/lib/utils';

const TiptapEditor = dynamic(() => import("@/components/ui/TipTapEditor"), {
  ssr: false,
});

function getCurrencySymbol(code: string): string {
  return CURRENCY_OPTIONS.find((c) => c.code === code)?.symbol ?? code;
}

function formatCurrency(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function Prizes({ onNext, onPrev }: NavigationProps) {
  const { grand_prize, currency, prizes, setField } = useHackathonStore(
    useShallow((state) => ({
      grand_prize: state.grand_prize,
      currency: state.currency ?? 'USD',
      prizes: state.prizes,
      setField: state.setField,
    }))
  );
  const grandPrizeErr = useFieldError("grand_prize");
  const currencyErr = useFieldError("currency");
  const prizesErr = useFieldError("prizes");

  const displayGrandPrize = grand_prize ? formatCurrency(grand_prize) : "";

  const handleGrandPrizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    setField("grand_prize", digits ? parseInt(digits, 10) : 0);
    grandPrizeErr.clear();
  };

  return (
 <div className="max-w-4xl mx-auto space-y-10">
  {/* Grand Prize Card */}
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#0B40EE]/5 dark:to-transparent p-8 rounded-3xl border border-blue-100 dark:border-white/10 shadow-sm">
    <div className="max-w-md">
      <label htmlFor="grand_prize" className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-4">
        <span className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
          <TrophyIcon className="text-lg" />
        </span>
        Total Prize Pool
        <span className="normal-case tracking-normal font-normal text-xs text-gray-400">(optional)</span>
      </label>

      {/* Currency selector */}
      <div className="mb-4">
        <label htmlFor="currency" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Currency
        </label>
        <div className="relative inline-flex items-center">
          <select
            id="currency"
            value={currency}
            onChange={(e) => {
              setField('currency', e.target.value);
              currencyErr.clear();
            }}
            className="appearance-none pl-4 pr-10 py-2.5 text-sm font-semibold bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#0B40EE] focus:ring-2 focus:ring-[#0B40EE]/20 outline-none transition-all cursor-pointer text-gray-700 dark:text-gray-200"
          >
            {CURRENCY_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <FieldError message={currencyErr.error} />
      </div>
      
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 group-focus-within:text-[#0B40EE] transition-colors select-none">
          {getCurrencySymbol(currency)}
        </span>
        <input
          id="grand_prize"
          type="text"
          inputMode="numeric"
          aria-invalid={!!grandPrizeErr.error}
          value={displayGrandPrize}
          onChange={handleGrandPrizeChange}
          className="w-full pl-16 pr-4 py-4 text-3xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-[#0B40EE] outline-none transition-all placeholder:text-gray-300"
          placeholder="0"
        />
      </div>
      <FieldError message={grandPrizeErr.error} />
      <p className="mt-3 text-xs text-blue-600/70 dark:text-gray-400 italic">
        This is the total amount distributed across all winners.
      </p>
    </div>
  </div>

  {/* Detailed Prize Breakdown */}
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <FieldLabel>Individual Prize Breakdown</FieldLabel>
    </div>
    
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/5 overflow-hidden focus-within:ring-2 focus-within:ring-[#0B40EE] transition-all">
      <TiptapEditor
        value={prizes ?? ""}
        onChange={(html) => {
          setField("prizes", html);
          prizesErr.clear();
        }}
        placeholder="e.g. 1st Place: $5,000 + Swag bag..."
      />
    </div>
    <FieldError message={prizesErr.error} />
  </div>

  {/* Navigation Actions */}
  <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
    <button
      type="button"
      onClick={onPrev}
      className="flex items-center gap-2 text-gray-500 font-medium hover:text-gray-800 dark:hover:text-white transition-all px-4 py-2"
    >
      <ArrowLeftIcon />
      Back
    </button>

    <button
      type="button"
      onClick={() => onNext?.()}
      className="bg-[#0B40EE] hover:bg-[#0835C4] text-white font-bold py-3 px-12 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
    >
      Continue
    </button>
  </div>
</div>
  );
}

export default Prizes;
