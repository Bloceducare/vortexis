import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#e0d3fc] to-[#d3e8fc] overflow-hidden">

      <div className="w-full flex gap-0 flex-row justify-center items-center h-screen absolute top-0 bottom-0 left-0 right-0">
        <div className=" w-[40em] h-[40em] bg-[#d2bcff] rounded-full opacity-50 z-0 mix-blend-multiply mt-[-12em] absolute left-10" />
        <div className=" w-[40em] h-[40em] bg-[#ffffff] rounded-full opacity-50 z-0 mt-[16em] " />
        <div className=" w-[40em] h-[40em] bg-[#c5c3ff] rounded-full opacity-50 z-0 mix-blend-multiply mt-[-12em] absolute right-20" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-snug">
          Run. Join. Win.
          <br />
          Everything Hackathon, All In One Place.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl">
          Vortexis makes it easy to{" "}
          <span className="font-semibold">host hackathons</span>,{" "}
          <span className="font-semibold">collaborate with teammates</span>, and{" "}
          <span className="font-semibold">build innovative projects</span> —
          whether you're an organizer, participant, or judge.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            For Participants
          </button>
          <button className="border-2 border-indigo-600 text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-100 transition">
            For Organizers
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
