"use client"

import React, { useState } from 'react';
import { Preferences, Hackathons, Location, TimeZone } from './utils/utils';
import { useForm, Form } from './utils/action';

function Hackathon() {
  const { CreateRecommendation } = useForm();
  const [formData, setFormData] = useState<Form>({
    preferences: [],
    skills: "",
    location: "",
    hackathons: [],
    time_zone: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await CreateRecommendation(formData);
      console.log(response);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <>
      <section className='text-center flex flex-col gap-3.5'>
        <h1 className='text-[#4D4D4D] font-semibold text-2xl md:text-5xl lg:text-6xl'>Hackathon Recommendations</h1>
        <p className='text-[#717171] font-normal text-sm md:text-2xl'>We'll use this to connect you with hackathons and more.</p>
      </section>

      <section className='px-5 md:px-10 mt-10 pb-10'>
        <form className='bg-white px-4 md:px-14 py-5 space-y-14' onSubmit={handleSubmit}>
          <div className='space-y-7'>
            <h2 className='text-3xl'>Preference</h2>
            <p>* What’s your specialty?</p>

            <div className="flex flex-wrap gap-5">
              {Preferences.map((pref, index) => (
                <label key={index} className="flex items-center space-x-2 border-[#E4DEFE] border rounded-lg h-[48px] w-[45%] text-sm md:w-[253px] justify-start pl-5">
                  <input
                    type="checkbox"
                    name="preferences"
                    value={pref.name}
                    onChange={(e) => setFormData({...formData, preferences: [...formData.preferences, e.target.value]})}
                    className="w-5 h-5 appearance-none border-2 border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-500 checked:ring-2 checked:ring-blue-300 transition-all duration-200"
                  />
                  <span>{pref.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
          <h3>* What are your skills ?</h3>
            <input
              type="text"
              placeholder="Type your skill"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              className="w-full p-3 border border-gray-400 rounded-lg placeholder-[#8F9098] focus:outline-none"
            />
          </div>

          <div className='space-y-4'>
            <h3>* What types of hackathons are you interested in?</h3>
            <div className="flex flex-wrap gap-5">
              {Hackathons.map((hack, index) => (
                <label key={index} className="flex items-center space-x-2 border-[#E4DEFE] border rounded-lg h-[48px] w-[45%] text-sm md:w-[253px] justify-start pl-5">
                  <input
                    type="checkbox"
                    name="hackathons"
                    value={hack.name}
                    onChange={(e) => setFormData({...formData, hackathons: [...formData.hackathons, e.target.value]})}
                    className="w-5 h-5 appearance-none border-2 border-gray-400 rounded-md checked:bg-blue-500 checked:border-blue-500 checked:ring-2 checked:ring-blue-300 transition-all duration-200"
                  />
                  <span className="text-[#282828]">{hack.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
            <h1 className="text-3xl">Eligibility</h1>
            <div className="mt-4">
              <label htmlFor="location" className="block">Location</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="mt-2 w-full md:w-[50%] p-3 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="" disabled>Select Location</option>
                {Location.map((loc) => (
                  <option key={loc.id} value={loc.city}>{loc.city}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="timezone" className="block">Time Zone</label>
              <select
                id="timezone"
                name="time_zone"
                value={formData.time_zone}
                onChange={(e) => setFormData({...formData, time_zone: e.target.value})}
                className="mt-2 w-full md:w-[50%] p-3 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="" disabled>Select Time Zone</option>
                {TimeZone.map((time) => (
                  <option key={time.id} value={time.name}>{time.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button type='submit' className='bg-[#009AFF] text-white px-10 py-4'>Continue</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Hackathon;
