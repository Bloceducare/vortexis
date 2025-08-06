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

function Prizes({ onNext, onPrev }: NavigationProps) {
  const { grand_prize, prizes, setField } = useHackathonStore(
    useShallow((state) => ({
      grand_prize: state.grand_prize,
      prizes: state.prizes,
      setField: state.setField,
    }))
  );

  const [localPrizes, setLocalPrizes] = useState<string[]>([""]);

  // Load saved prizes on mount
  useEffect(() => {
    if (prizes && prizes.length > 0) {
      setLocalPrizes(prizes);
    }
  }, [prizes]);

  const handleGrandPrizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setField('grand_prize', isNaN(value) ? 0 : value);
  };

  const handlePrizeChange = (index: number, value: string) => {
    const updated = [...localPrizes];
    updated[index] = value;
    setLocalPrizes(updated);
    setField('prizes', updated);
  };

  const addMorePrize = () => {
    const updated = [...localPrizes, ""];
    setLocalPrizes(updated);
    setField('prizes', updated);
  };

  const removePrize = (index: number) => {
    const updated = [...localPrizes];
    updated.splice(index, 1);
    setLocalPrizes(updated);
    setField('prizes', updated);
  };

  const handleNextClick = () => {
    const filledPrizes = localPrizes.filter(prize => prize.trim() !== '');

    if (!grand_prize || grand_prize <= 0) {
      toast.error('Please enter the grand prize amount.');
      return;
    }

    if (filledPrizes.length < 2) {
      toast.error('Please enter at least two individual prizes.');
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
        <label className="block text-lg font-medium mb-1">Grand Prize ($)</label>
        <input
          type="text"
          value={grand_prize ?? ''}
          onChange={handleGrandPrizeChange}
          className="w-full rounded-md border p-2 outline-none"
        />
      </div>

      {/* Individual Prizes Section */}
      <div>
        <label className="block text-lg font-medium mb-2">Individual Prizes</label>
        {localPrizes.map((prize, index) => (
          <div key={index} className="flex gap-2 items-start mb-4">
            <div className="w-full">
              <TiptapEditor
                value={prize}
                onChange={(html) => handlePrizeChange(index, html)}
                placeholder="Enter prize description..."
                className="min-h-[40px] border rounded-md p-2"
              />
            </div>

            {/* Remove Button */}
            {localPrizes.length > 1 && (
              <button
                type="button"
                onClick={() => removePrize(index)}
                className="text-red-600 hover:underline px-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addMorePrize}
          className="mt-2 text-blue-600 hover:underline"
        >
          + Add more prizes
        </button>
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




