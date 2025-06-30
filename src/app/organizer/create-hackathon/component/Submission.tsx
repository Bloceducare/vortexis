import React, { useState } from 'react'
import { NavigationProps } from '@/components/Interface';


function Submission({ onNext, onPrev }: NavigationProps) {
  const initialNotifications = [
    { label: "Project Description", checked: true },
    { label: "Demo Video", checked: false },
    { label: "Slide Deck", checked: true },
    { label: "GitHub Repository", checked: true }
  ];

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
    onNext?.();
    // Handle form submission logic here
    console.log("Form submitted");
  }

  const previousButton = () => {
    onPrev?.();
    console.log("Going to previous step");
  }

  return (
    <section className="p-4">
      <div className="space-y-3 mb-6">
        <h1 className="text-2xl font-bold">Submissions Setup</h1>
        <p>Configure how participants will submit their projects.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mt-10 flex-wrap gap-6">
          <div className="w-full md:w-[45%]">
            <label className="text-lg text-[#2F3036]">Submission Deadline</label>
            <input
              type="date"
              required
              name="submission_deadline"
              className="w-full rounded-2xl py-3 px-3 border outline-none border-[#C5C6CC] mt-3"
            />
          </div>

          <div className="w-full md:w-[45%]">
            <label className="text-lg text-[#2F3036]">End Date</label>
            <input
              type="date"
              required
              name="end_date"
              className="w-full rounded-2xl py-3 px-3 border outline-none border-[#C5C6CC] mt-3"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col">
          <label className="text-lg text-[#2F3036]">Additional Requirements</label>
          <textarea
            className="outline-none resize-none h-52 border-2 w-full border-[#C5C6CC] mt-3 rounded-2xl px-3 py-3"
            placeholder="Enter any additional submission requirements...."
            name="aditional"
          />
        </div>


      {/* Toggle Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="space-y-4">
          {notifications.map((notif, idx) => (
            <div key={idx} className="flex items-center justify-between w-[25%] pb-3">
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
  );
}

export default Submission;
