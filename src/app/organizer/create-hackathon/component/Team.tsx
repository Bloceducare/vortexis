import React, { useState } from 'react';
import { NavigationProps } from '@/components/Interface';
import { toast } from 'react-toastify';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useShallow } from 'zustand/shallow';




function Team({ onNext, onPrev, data, setData }: NavigationProps ) {
    
      const hackathonSelector = useShallow((state: any) => ({
        min_team_size: state.min_team_size,
        max_team_size: state.max_team_size,
        setField: state.setField,
      }));

      const { min_team_size, max_team_size, setField } = useHackathonStore(hackathonSelector);
  
  const dropdownMinimumIndividual = [
    "1 individual",
    "2 Members",
    "3 Members",
    "4 Members",
    "5 Members",
    "6 Members",
    "7 Members",
  ];

  const dropdownMaximum = [
    "2 Members",
    "3 Members",
    "4 Members",
    "5 Members",
    "6 Members",
    "7 Members",
  ];

  const initialNotifications = [
    { label: "Allow Solo Participation", checked: true },
  ]

   const [notifications, setNotifications] = useState(initialNotifications);
  
    const handleToggle = (idx: number) => {
      setNotifications((prev) =>
        prev.map((notif, i) =>
          i === idx ? { ...notif, checked: !notif.checked } : notif
        )
      );
    };

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

          if (!min_team_size) {
              toast.error("Please enter a minimum team size", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
              });
              return;
            }

            if (!max_team_size) {
              toast.error("Please enter a maximum team size", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
              });
              return;
            }

        if (onNext) {
          onNext();
        }
        // Handle form submission logic here
        console.log("Form submitted");
      }
    
      const previousButton = () => {
        if (onPrev) {
          onPrev();
        }
        console.log("Going to previous step");
      }
    

  return (
    <>
      <section className="p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-bold">Team Configuration</h1>
          <p className="text-gray-600">Set up team requirements for participants.</p>
        </div>

        <form onSubmit={handleSubmit}>

        <div className="flex gap-6 flex-wrap">
          {/* Minimum Members Dropdown */}
          <div className="w-full md:w-[45%]">
            <label className="block mb-2 text-[#2F3036] font-bold">Minimum Team Members</label>
            <select
              className="w-full rounded-2xl border border-[#C5C6CC] px-4 py-3 outline-none"
              name="min_team_size"
              value={min_team_size}
              onChange={(e) => setField('min_team_size', e.target.value)}
            >
              {dropdownMinimumIndividual.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Maximum Members Dropdown */}
          <div className="w-full md:w-[45%]">
            <label className="block mb-2 text-[#2F3036] font-bold">Maximum Team Members</label>
            <select
              className="w-full rounded-2xl border border-[#C5C6CC] px-4 py-3 outline-none"
              name="max_team_size"
              value={max_team_size}
              onChange={(e) => setField('max_team_size', e.target.value)}
            >
              {dropdownMaximum.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>


        <div className="mt-10">
        <div className="space-y-4">
          {notifications.map((notif, idx) => (
            <div key={idx} className="flex items-center justify-between w-2/5 xl:w-[25%] pb-3">
              <span className="text-gray-800">{notif.label}</span>
              <button
                onClick={() => handleToggle(idx)}
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notif.checked ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notif.checked ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-10 flex flex-col'>
        <label className='text-lg text-[#2F3036]'>Team Formation Rules</label>
        <textarea className='outline-none resize-none h-52 border-2 w-full border-[#C5C6CC] mt-3 rounded-2xl px-3 py-3' placeholder='Describe how teams should be formed or any special requirements...' name='rules'></textarea>
        </div>


        <div className="mt-10 flex justify-between">
        <button className="border-[#0B40EE] border text-[#0B40EE] py-2 px-8 rounded cursor-pointer" onClick={previousButton}>
          Previous
        </button>

        <button className="bg-[#0B40EE] text-white py-2 px-8 rounded cursor-pointer" type='submit'>
          Next
        </button>
      </div>
      </form>

      </section>
    </>
  );
}

export default Team;
