import React from 'react';
import { NavigationProps } from '@/components/Interface';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useShallow } from 'zustand/shallow';
import { FieldError, FieldLabel, errorRing, useFieldError } from './FormField';
import { GlobeIcon, LockIcon, MapPinIcon } from 'lucide-react';


interface VisibilityProps extends NavigationProps {
  onSubmit: () => void | Promise<void>;
  isSubmitting: boolean;
  organizationName?: string;
}

function Visibility({ onPrev, onSubmit, isSubmitting, organizationName }: VisibilityProps) {
  const { visibility, venue, setField } = useHackathonStore(
    useShallow((state) => ({
      visibility: state.visibility,
      venue: state.venue,
      setField: state.setField,
    }))
  );
  const venueErr = useFieldError("venue");
  const visibilityErr = useFieldError("visibility");
  const orgErr = useFieldError("organization_id");

  const selected: 'public' | 'private' = visibility === false ? 'private' : 'public';

  const select = (value: 'public' | 'private') => {
    setField('visibility', value === 'public');
    visibilityErr.clear();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitting) onSubmit();
  };

  return (
    <>
      <section>
     <form onSubmit={handleSubmit} noValidate className="max-w-4xl mx-auto space-y-12">
  {/* Organization */}
  <div className={`rounded-2xl border p-4 text-sm ${orgErr.error ? "border-red-300 bg-red-50 dark:bg-red-950/30" : "border-gray-200 dark:border-gray-800"}`}>
    <span className="text-gray-500 dark:text-gray-400">Hosting organization: </span>
    <span className="font-semibold">{organizationName || "None selected"}</span>
    <FieldError message={orgErr.error} />
  </div>

  {/* Visibility Options */}
  <div className="space-y-3">
  <FieldLabel required>Visibility</FieldLabel>
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
        role="radio"
        aria-checked={selected === option.id}
        tabIndex={0}
        onClick={() => select(option.id as 'public' | 'private')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            select(option.id as 'public' | 'private');
          }
        }}
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
  <FieldError message={visibilityErr.error} />
  </div>

  {/* Venue Input */}
  <div className="space-y-3">
    <FieldLabel htmlFor="venue" required>Venue / Location</FieldLabel>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B40EE] transition-colors">
        <MapPinIcon />
      </span>
      <input
        id="venue"
        type="text"
        maxLength={100}
        aria-invalid={!!venueErr.error}
        placeholder="e.g. Lagos, Nigeria or Virtual (Zoom/Discord)"
        value={venue ?? ''}
        onChange={(e) => {
          setField('venue', e.target.value);
          venueErr.clear();
        }}
        className={`${errorRing(!!venueErr.error)} w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 focus:ring-2 focus:ring-[#0B40EE] focus:bg-white dark:focus:bg-transparent outline-none transition-all`}
      />
    </div>
    <FieldError message={venueErr.error} />
  </div>

  {/* Navigation & Final Action */}
  <div className="flex items-center justify-between pt-10 border-t border-gray-100 dark:border-gray-800">
    <button
      type="button"
      onClick={() => onPrev?.()}
      className="px-8 py-3 text-gray-500 font-semibold hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      Previous Step
    </button>

    <button
      disabled={isSubmitting}
      className={`relative min-w-[160px] py-4 px-10 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 flex justify-center items-center gap-3 ${
        isSubmitting 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-[#0B40EE] hover:bg-[#0835C4] shadow-blue-500/25 cursor-pointer"
      }`}
      type="submit"
    >
      {isSubmitting ? (
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

    </>
  );
}

export default Visibility;
