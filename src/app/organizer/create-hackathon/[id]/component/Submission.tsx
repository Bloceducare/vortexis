"use client";

import React, { useState } from "react";
import { NavigationProps } from "@/components/Interface";
import { useHackathonStore } from "@/store/useHackathonStore";
import { useShallow } from "zustand/react/shallow";
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

function Submission({ onNext, onPrev }: NavigationProps) {
  const initialNotifications = [
    { label: "Project Description", checked: true },
    { label: "Demo Video", checked: false },
    { label: "Slide Deck", checked: true },
    { label: "GitHub Repository", checked: true },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  const { submission_deadline, setField } = useHackathonStore(
    useShallow((state) => ({
      submission_deadline: state.submission_deadline,
      setField: state.setField,
    }))
  );

  const handleToggle = (idx: number) => {
    setNotifications((prev) =>
      prev.map((notif, i) =>
        i === idx ? { ...notif, checked: !notif.checked } : notif
      )
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext?.();
  };

  const previousButton = () => {
    onPrev?.();
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField("submission_deadline", e.target.value);
  };

  return (
    <section className="p-4">
      <div className="space-y-3 mb-6">
        <h1 className="text-2xl font-bold">Submissions Setup</h1>
        <p>Configure how participants will submit their projects.</p>
      </div>

  <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10">
  {/* Deadline Section */}
  <div className="bg-gray-50/50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
    <div className="w-full md:w-[48%]">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
        <span className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          <CalendarIcon className="text-sm" /> 
        </span>
        Submission Deadline
      </label>
      
      <div className="relative mt-3 group">
        <input
          type="date"
          required
          name="submission_deadline"
          value={submission_deadline ?? ""}
          onChange={handleDeadlineChange}
          className="w-full rounded-xl py-3 px-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent focus:ring-2 focus:ring-[#0B40EE] focus:border-transparent outline-none transition-all cursor-pointer hover:border-gray-300 dark:hover:border-gray-500"
        />
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Participants must submit their projects before 11:59 PM on this date.
      </p>
    </div>
  </div>

  {/* Navigation Actions */}
  <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
    <button
      type="button"
      onClick={previousButton}
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


  {/* Toggle Section */}
        {/* <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            {notifications.map((notif, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between w-[25%] pb-3"
              >
                <span className="text-gray-800 dark:text-white">{notif.label}</span>
                <button
                  onClick={() => handleToggle(idx)}
                  type="button"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notif.checked ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notif.checked ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div> */}
