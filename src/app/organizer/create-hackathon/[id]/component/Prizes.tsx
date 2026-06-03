'use client';

import React, { useEffect, useState } from 'react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useShallow } from 'zustand/react/shallow';
import { NavigationProps } from '@/components/Interface';
import { toast } from 'react-toastify';
import dynamic from "next/dynamic";
import { ArrowLeftIcon, TrophyIcon } from 'lucide-react';

const TiptapEditor = dynamic(() => import("@/components/ui/TipTapEditor"), {
  ssr: false,
});

function formatCurrency(value: number): string {
  return value.toLocaleString('en-NG'); // You can change 'en-NG' based on currency
}

function Prizes({ onNext, onPrev }: NavigationProps) {
  const { grand_prize, prizes, setField } = useHackathonStore(
    useShallow((state) => ({
      grand_prize: state.grand_prize,
      prizes: state.prizes,
      setField: state.setField,
    }))
  );

  const [localPrize, setLocalPrize] = useState<string>("");
  const [displayGrandPrize, setDisplayGrandPrize] = useState<string>("");

  useEffect(() => {
    if (prizes && prizes.length > 0) {
      setLocalPrize(prizes[0]);
    }

    if (grand_prize) {
      setDisplayGrandPrize(formatCurrency(grand_prize));
    }
  }, [prizes, grand_prize]);

  const handleGrandPrizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const numeric = parseInt(rawValue);

    if (!isNaN(numeric)) {
      setField('grand_prize', numeric);
      setDisplayGrandPrize(formatCurrency(numeric));
    } else {
      setField('grand_prize', 0);
      setDisplayGrandPrize('');
    }
  };

  const handlePrizeChange = (value: string) => {
    setLocalPrize(value);
  };
  

  const handleNextClick = () => {
    if (!grand_prize || grand_prize <= 0) {
      toast.error("Please enter the grand prize amount.");
      return;
    }
  
    if (!localPrize || localPrize.trim() === "") {
      toast.error("Please enter the individual prize.");
      return;
    }
  
    setField("prizes", localPrize); 
  
    onNext?.();
  };
  

  return (
 <div className="max-w-4xl mx-auto space-y-10">
  {/* Grand Prize Card */}
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#0B40EE]/5 dark:to-transparent p-8 rounded-3xl border border-blue-100 dark:border-white/10 shadow-sm">
    <div className="max-w-md">
      <label className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-4">
        <span className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
          <TrophyIcon className="text-lg" />
        </span>
        Total Prize Pool
      </label>
      
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 group-focus-within:text-[#0B40EE] transition-colors">
          $
        </span>
        <input
          type="text"
          value={displayGrandPrize}
          onChange={handleGrandPrizeChange}
          className="w-full pl-10 pr-4 py-4 text-3xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-[#0B40EE] outline-none transition-all placeholder:text-gray-300"
          placeholder="0.00"
        />
      </div>
      <p className="mt-3 text-xs text-blue-600/70 dark:text-gray-400 italic">
        This is the total amount distributed across all winners.
      </p>
    </div>
  </div>

  {/* Detailed Prize Breakdown */}
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
        Individual Prize Breakdown
      </label>
    </div>
    
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/5 overflow-hidden focus-within:ring-2 focus-within:ring-[#0B40EE] transition-all">
      <TiptapEditor
        value={localPrize}
        onChange={handlePrizeChange}
        placeholder="e.g. 1st Place: $5,000 + Swag bag..."
      />
    </div>
  </div>

  {/* Navigation Actions */}
  <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
    <button
      onClick={onPrev}
      className="flex items-center gap-2 text-gray-500 font-medium hover:text-gray-800 dark:hover:text-white transition-all px-4 py-2"
    >
      <ArrowLeftIcon />
      Back
    </button>

    <button
      type="button"
      onClick={handleNextClick}
      className="bg-[#0B40EE] hover:bg-[#0835C4] text-white font-bold py-3 px-12 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
    >
      Continue
    </button>
  </div>
</div>
  );
}

export default Prizes;






