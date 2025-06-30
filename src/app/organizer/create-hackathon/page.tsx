"use client";

import React, { useState } from 'react';
import Details from './component/Details';
import Visibility from './component/Visibility';
import Invitation from './component/Invitation';
import Submission from './component/Submission';
import Team from './component/Team';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Hackathon() {
  const [activeButton, setActiveButton] = useState("Hackathon Details");

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    details: {},
    submission: {},
    team: {},
    visibility: {},
    invitation: {},
  });
  

  const goToStep = (index: number) => {
    setCurrentStep(index);
    console.log("Current Step:", index);
    setActiveButton(Buttons[index]);
  };
  

  const handleNext = () => {
    setCurrentStep(prev => prev + 1)
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const Buttons = [
    "Hackathon Details",
    "Submission",
    "Team Configuration",
    "Visibility",
    "Invite judges"
  ];

  const handleSubmit = async () => {
    try {
      
    } catch (error) {
      
    }
  }

  const renderComponent = () => {
    if (Buttons[currentStep] === "Hackathon Details") {
      return <Details onNext={handleNext} data={formData.details} />;
    }
    if (Buttons[currentStep] === "Submission") {
      return <Submission onNext={handleNext} onPrev={handlePrev} data={formData.submission} setData={(data: any) => setFormData(prev => ({ ...prev, submission: data }))}  />;
    }
    if (Buttons[currentStep] === "Team Configuration") {
      return <Team onNext={handleNext} onPrev={handlePrev} data={formData.team} setData={(data: any) => setFormData(prev => ({ ...prev, team: data }))} />;
    }
    if (Buttons[currentStep] === "Visibility") {
      return <Visibility onNext={handleNext} onPrev={handlePrev} data={formData.visibility} setData={(data: any) => setFormData(prev => ({ ...prev, visibility: data }))} />;
    }
    if (Buttons[currentStep] === "Invite judges") {
      return <Invitation onPrev={handlePrev} data={formData.invitation} setData={(data: any) => setFormData(prev => ({ ...prev, invitation: data }))} onSubmit={handleSubmit} />;
    }
    return null;
  };
  

  return (
    <section className="bg-white px-10 rounded-2xl py-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className='space-y-3'>
        <h1 className='text-3xl font-bold text-[#605DEC]'>{activeButton}</h1>
        <p>Enter the basic information about your hackathon.</p>
      </div>
      <div className="flex gap-3 mb-6 flex-wrap mt-4">
        {Buttons.map((btn, index) => (
          <button
            key={btn}
            onClick={() => goToStep(index)}
            className={`px-8 py-4 rounded-lg transition cursor-pointer ${
              currentStep === index
                ? "bg-[#605DEC] text-white"
                : "bg-[#F4F3FE] text-[#C5C0DB]"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="mt-4">{renderComponent()}</div>
    </section>
  );
}

export default Hackathon;
