"use client";
import React, { useEffect, useState } from 'react'
import All from './component/All';
import Pending from './component/Pending';
import Reviewed from './component/Reviewed';
import Rejected from './component/Rejected';
import useOrganizer from '@/hooks/useOrganizer';
import { useParams } from 'next/navigation';

function SubmitProject() {
  const [activeButton, setActiveButton] = useState("All Submission");
  const Buttons = [
    "All Submission",
    "Pending14",
    "Reviewed",
    "Rejected",
  ];
  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;



  const { useSubmissionById } = useOrganizer();
  const { data, isLoading, error } = useSubmissionById(hackathon_id); 

  console.log(data)

  const renderComponent = () => {
    switch (activeButton) {
      case "All Submission":
        return <All />;
      case "Pending14":
        return <Pending />;
      case "Reviewed":
        return <Reviewed />;
      case "Rejected":
        return <Rejected />;
      default:
        return null;
    }
  };

  
  return (
    <section className="bg-white px-10 rounded-2xl py-5 mb-10 shadow-lg">

      <div className='space-y-3'>
        <h1 className='text-3xl font-bold text-[#605DEC]'>Submissions</h1>
        <p className='text-[#212121]'>Review and manage hackathon submissions</p>
      </div>
      <div className="flex justify-between xl:justify-start  gap-3 mb-6  mt-4">
        {Buttons.map((btn, index) => (
          <button
            key={btn}
            onClick={() => setActiveButton(btn)}
            className={`w-[28%] xl:w-[15%] py-4 rounded-lg transition cursor-pointer ${
              btn === activeButton
                ? "bg-[#605DEC] text-white"
                : "bg-[#F4F3FE] text-[#C5C0DB]"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="mt-20 px-5 xl:px-10 xl:mr-20">{renderComponent()}</div>
    </section>
  )
}

export default SubmitProject