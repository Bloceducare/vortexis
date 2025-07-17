'use client';

import React, { useState } from 'react';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useShallow } from 'zustand/react/shallow';
import { NavigationProps } from '@/components/Interface';
// import toast from 'react-hot-toast';
import { toast } from 'react-toastify';

function Prizes({ onNext, onPrev }: NavigationProps) {
  const [localPrizes, setLocalPrizes] = useState([{ name: '', amount: 0 }]);

  const { grand_prize, setField } = useHackathonStore(
    useShallow((state) => ({
      grand_prize: state.grand_prize,
      prizes: state.prizes,
      setField: state.setField,
    }))
  );

  const handleGrandPrizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setField('grand_prize', isNaN(value) ? 0 : value);
  };

  const handlePrizeChange = <K extends keyof (typeof localPrizes)[number]>(
    index: number,
    key: K,
    value: string
  ) => {
    const updated = [...localPrizes];
    if (key === 'amount') {
      updated[index][key] = Number(value) as (typeof localPrizes)[number][K];
    } else {
      updated[index][key] = value as any;
    }
    setLocalPrizes(updated);
    setField('prizes', updated);
  };

  const addMorePrize = () => {
    const updated = [...localPrizes, { name: '', amount: 0 }];
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
    const filledPrizes = localPrizes.filter(
      (prize) => prize.name.trim() !== '' && prize.amount > 0
    );

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
          <div key={index} className="flex gap-2 items-center mb-2">
            <input
              type="text"
              placeholder="Name"
              value={prize.name}
              onChange={(e) => handlePrizeChange(index, 'name', e.target.value)}
              className="w-1/2 rounded-md border p-2 outline-none"
            />
            <input
              type="text"
              placeholder="Amount ($)"
              value={prize.amount === 0 ? '' : prize.amount}
              onChange={(e) => handlePrizeChange(index, 'amount', e.target.value)}
              className="w-32 rounded-md border p-2 outline-none"
            />
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




