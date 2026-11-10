"use client";

import React from "react";
import { NavigationProps } from "@/components/Interface";
import { useHackathonStore } from "@/store/useHackathonStore";
import { useShallow } from "zustand/react/shallow";
import { FieldError, FieldLabel, errorRing, useFieldError } from "./FormField";
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

function Submission({ onNext, onPrev }: NavigationProps) {
  const { submission_deadline, start_date, end_date, setField } = useHackathonStore(
    useShallow((state) => ({
      submission_deadline: state.submission_deadline,
      start_date: state.start_date,
      end_date: state.end_date,
      setField: state.setField,
    }))
  );
  const deadlineErr = useFieldError("submission_deadline");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext?.();
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField("submission_deadline", e.target.value);
    deadlineErr.clear();
  };

  return (
    <section className="p-4">
  <form onSubmit={handleSubmit} noValidate className="max-w-4xl mx-auto space-y-10">
  {/* Deadline Section */}
  <div className="bg-gray-50/50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
    <div className="w-full md:w-[48%]">
      <FieldLabel htmlFor="submission_deadline" required className="flex items-center gap-2">
        <span className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          <CalendarIcon className="text-sm" /> 
        </span>
        Submission Deadline
      </FieldLabel>
      
      <div className="relative mt-3 group">
        <input
          id="submission_deadline"
          type="date"
          name="submission_deadline"
          aria-invalid={!!deadlineErr.error}
          min={start_date || undefined}
          max={end_date || undefined}
          value={submission_deadline ?? ""}
          onChange={handleDeadlineChange}
          className={`${errorRing(!!deadlineErr.error)} w-full rounded-xl py-3 px-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent focus:ring-2 focus:ring-[#0B40EE] focus:border-transparent outline-none transition-all cursor-pointer hover:border-gray-300 dark:hover:border-gray-500`}
        />
      </div>
      <FieldError message={deadlineErr.error} />
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Must fall between the start and end dates. Participants must submit their projects before 11:59 PM on this date.
      </p>
    </div>
  </div>

  {/* Navigation Actions */}
  <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
    <button
      type="button"
      onClick={() => onPrev?.()}
      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
    >
      <ArrowLeftIcon />
      Back
    </button>

    <button
      type="submit"
      className="bg-[#0B40EE] hover:bg-[#0835C4] text-white font-bold py-3 px-12 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 cursor-pointer flex items-center gap-2"
    >
      Continue
      <ArrowRightIcon />
    </button>
  </div>
</form>
    </section>
  );
}

export default Submission;
