import React, { useState, useMemo } from 'react';
import { NavigationProps } from '@/components/Interface';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useShallow } from 'zustand/shallow';
import useOrganizer from '@/hooks/useOrganizers';
import SuccessModal from '@/components/SuccessModal';
import { useQueryClient } from "@tanstack/react-query";
import { GlobeIcon, LockIcon, MapPinIcon } from 'lucide-react';


interface VisibilityProps extends NavigationProps {
  data: any;
  setData: (data: any) => void;
  onSubmit: () => void;
  orgId: number;
}

function Visibility({ onNext, onPrev, orgId }: VisibilityProps) {
  const initialNotifications = [
    { label: 'Feature this hackathon on the homepage', checked: true },
  ];

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hackathonSelector = useShallow((state: any) => ({
    visibility: state.visibility,
    venue: state.venue,
    setField: state.setField,
  }));

  const { visibility, venue, setField } = useHackathonStore(hackathonSelector);

  const [notifications, setNotifications] = useState(initialNotifications);
  const [selected, setSelected] = useState<'public' | 'private' | null>(
    visibility ? 'public' : null
  );

  const toggleSelection = (value: 'public' | 'private') => {
    setSelected((prev) => (prev === value ? null : value));
    setField('visibility', value === 'public');
  };

  const handleToggle = (idx: number) => {
    setNotifications((prev) =>
      prev.map((notif, i) =>
        i === idx ? { ...notif, checked: !notif.checked } : notif
      )
    );
  };

  const { createHackathonMutation } = useOrganizer();
  const getHackathonData = useHackathonStore((state) => state.getHackathonData);
  const hackathon = useMemo(() => getHackathonData(), [getHackathonData]);
  const { clearHackathon } = useHackathonStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const payload = {
        ...hackathon,
         organization_id: orgId,
         banner_image_file: hackathon.banner_image_file ?? null,
      }

      await createHackathonMutation.mutateAsync(payload);
      setShowSuccessModal(true);
      clearHackathon();
    } catch (error: any) {
      const apiError =
        error?.response?.data?.non_field_errors?.[0] || 
        error?.response?.data?.message ||              
        error?.message || 
        'Something went wrong.';
    
      setErrorMessage(apiError);
    }    
  };


  const closeModal = () => {
    window.location.href = "/organizer"; 
  }

  const previousButton = () => {
    if (onPrev) onPrev();
  };

  return (
    <>
      <section>
        <div className="space-y-3 mb-6">
          <h1 className="text-2xl font-bold">Visibility Settings</h1>
          <p>Control who can see and participate in your hackathon.</p>
        </div>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

     <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
  {/* Visibility Options */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      {
        id: 'public',
        title: 'Public',
        desc: 'Anyone can discover and participate in your hackathon.',
        icon: <GlobeIcon className="text-xl" />
      },
      {
        id: 'private',
        title: 'Private',
        desc: 'Only people with an access code can join your hackathon.',
        icon: <LockIcon className="text-xl" />
      }
    ].map((option) => (
      <div
        key={option.id}
        onClick={() => toggleSelection(option.id as 'public' | 'private')}
        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
          selected === option.id
            ? "border-[#0B40EE] bg-blue-50/50 dark:bg-[#0B40EE]/10 ring-4 ring-blue-500/10"
            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-transparent hover:border-gray-300 dark:hover:border-gray-600"
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl ${
            selected === option.id ? "bg-[#0B40EE] text-white" : "bg-gray-100 dark:bg-white/5 text-gray-500"
          }`}>
            {option.icon}
          </div>
          {/* Custom Radio Circle */}
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected === option.id ? "border-[#0B40EE]" : "border-gray-300 dark:border-gray-600"
          }`}>
            {selected === option.id && <div className="w-3 h-3 bg-[#0B40EE] rounded-full animate-in zoom-in-50" />}
          </div>
        </div>
        
        <h3 className={`font-bold text-lg ${selected === option.id ? "text-[#0B40EE] dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
          {option.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          {option.desc}
        </p>
      </div>
    ))}
  </div>

  {/* Venue Input */}
  <div className="space-y-3">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
      Venue / Location
    </label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B40EE] transition-colors">
        <MapPinIcon />
      </span>
      <input
        type="text"
        placeholder="e.g. Lagos, Nigeria or Virtual (Zoom/Discord)"
        value={venue}
        onChange={(e) => setField('venue', e.target.value)}
        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 focus:ring-2 focus:ring-[#0B40EE] focus:bg-white dark:focus:bg-transparent outline-none transition-all"
      />
    </div>
  </div>

  {/* Navigation & Final Action */}
  <div className="flex items-center justify-between pt-10 border-t border-gray-100 dark:border-gray-800">
    <button
      type="button"
      onClick={previousButton}
      className="px-8 py-3 text-gray-500 font-semibold hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      Previous Step
    </button>

    <button
      disabled={createHackathonMutation.isPending}
      className={`relative min-w-[160px] py-4 px-10 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 flex justify-center items-center gap-3 ${
        createHackathonMutation.isPending 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-[#0B40EE] hover:bg-[#0835C4] shadow-blue-500/25 cursor-pointer"
      }`}
      type="submit"
    >
      {createHackathonMutation.isPending ? (
        <>
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        "Create Hackathon"
      )}
    </button>
  </div>
</form>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          title="🎉 Hackathon Created!"
          message="Your hackathon has been successfully submitted."
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default Visibility;
