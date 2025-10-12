'use client';

import React, { useEffect, useState } from 'react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useShallow } from 'zustand/react/shallow';
import { NavigationProps } from '@/components/Interface';
import { toast } from 'react-toastify';
import dynamic from "next/dynamic";

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
    setField('prizes', value);
  };

  const handleNextClick = () => {
    if (!grand_prize || grand_prize <= 0) {
      toast.error('Please enter the grand prize amount.');
      return;
    }

    if (!localPrize || localPrize.trim() === '') {
      toast.error('Please enter the individual prize.');
      return;
    }

    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Grand Prize Field */}
      <div>
        <label className="block text-lg font-medium mb-1">Grand Prize</label>
        <input
          type="text"
          value={displayGrandPrize}
          onChange={handleGrandPrizeChange}
          className="w-full rounded-md border p-2 outline-none placeholder:text-gray-400"
          placeholder="Set your grand price"
        />
      </div>

      {/* Individual Prize */}
      <div>
        <label className="block text-lg font-medium mb-2">Individual Prize</label>
        <div className="w-full">
          <TiptapEditor
            value={localPrize}
            onChange={handlePrizeChange}
            placeholder="Enter prize description..."
            className="min-h-[40px] border rounded-md p-2"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="border-[#0B40EE] border text-[#0B40EE] py-2 px-8 rounded cursor-pointer"
          onClick={onPrev}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNextClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Prizes;






