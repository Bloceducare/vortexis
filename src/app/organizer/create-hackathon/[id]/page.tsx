"use client";

import React, { useState } from "react";
import Details from "./component/Details";
import Visibility from "./component/Visibility";
import Submission from "./component/Submission";
import Team from "./component/Team";
import Prizes from "./component/Prizes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import { useOrganizationStore } from "@/store/useOrganizationStore";

function Hackathon() {
  const [activeButton, setActiveButton] = useState("Hackathon Details");
  const params = useParams();
 

  const setClickedOrganization = useOrganizationStore((state) => state.organization)
  const orgid = setClickedOrganization?.id ?? 0;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    details: {},
    submission: {},
    team: {},
    visibility: {},
    invitation: {},
  });

  const goToStep = (index: number) => {
    setCurrentStep(index);
    setActiveButton(Buttons[index]);
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const Buttons = [
    "Hackathon Details",
    "Submission",
    "Team Configuration",
    "Prizes",
    "Visibility",
  ];

  const handleSubmit = async () => {
    try {
    } catch (error) {}
  };

  const renderComponent = () => {
    if (Buttons[currentStep] === "Hackathon Details") {
      return <Details onNext={handleNext} data={formData.details} />;
    }
    if (Buttons[currentStep] === "Submission") {
      return (
        <Submission
          onNext={handleNext}
          onPrev={handlePrev}
          data={formData.submission}
          setData={(data: any) =>
            setFormData((prev) => ({ ...prev, submission: data }))
          }
        />
      );
    }
    if (Buttons[currentStep] === "Team Configuration") {
      return (
        <Team
          onNext={handleNext}
          onPrev={handlePrev}
          data={formData.team}
          setData={(data: any) =>
            setFormData((prev) => ({ ...prev, team: data }))
          }
        />
      );
    }
    if (Buttons[currentStep] === "Prizes") {
      return (
        <Prizes
          onNext={handleNext}
          onPrev={handlePrev}
          data={formData.team}
          setData={(data: any) =>
            setFormData((prev) => ({ ...prev, team: data }))
          }
        />
      );
    }
    if (Buttons[currentStep] === "Visibility") {
      return (
        <Visibility
          onNext={handleNext}
          onPrev={handlePrev}
          data={formData.visibility}
          setData={(data: any) =>
            setFormData((prev) => ({ ...prev, visibility: data }))
          }
          onSubmit={handleSubmit}
          orgId={orgid}
        />
      );
    }
    return null;
  };

  return (
    <section className="bg-white dark:bg-gray-800 px-4 md:px-10 rounded-2xl py-5 transition-colors">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-[#605DEC] dark:text-indigo-400">
          {activeButton}
        </h1>
        <p className="dark:text-gray-300">
          Enter the basic information about your hackathon.
        </p>
      </div>
      <section className="w-full overflow-x-auto">
 <div className="flex gap-3 mb-6 flex-wrap mt-4">
        {Buttons.map((btn, index) => (
          <button
            key={btn}
            onClick={() => goToStep(index)}
            className={`px-4 md:px-8 py-3 md:py-4 rounded-lg transition cursor-pointer ${
              currentStep === index
                ? "bg-[#605DEC] text-white"
                : "bg-[#F4F3FE] dark:bg-gray-700 text-[#C5C0DB] dark:text-gray-300"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
      </section>
     

      <div className="mt-4">{renderComponent()}</div>
    </section>
  );
}

export default Hackathon;
