import React, { useState, useEffect } from 'react';
import { NavigationProps } from '@/components/Interface';
import { toast } from 'react-toastify';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useShallow } from 'zustand/shallow';
import { skillsData } from '../../utils';
import useSkills from '@/hooks/useSkills';
import { Skills } from '@/app/api/utils/interface';




function Team({ onNext, onPrev,  setData }: NavigationProps ) {
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]); 
      const hackathonSelector = useShallow((state: any) => ({
        min_team_size: state.min_team_size,
        max_team_size: state.max_team_size,
        skills: state.skills,
        setField: state.setField,
      }));

      const { min_team_size, max_team_size, skills, setField } = useHackathonStore(hackathonSelector);

      const { getAllSkills } = useSkills()


      const { data, isLoading, isError, isFetching, refetch } = getAllSkills()

      console.log(data)




      const handleSkillChange = (id: number) => {
        let updatedSkills: number[];
    
        if (selectedSkillIds.includes(id)) {
          updatedSkills = selectedSkillIds.filter(skillId => skillId !== id);
        } else {
          updatedSkills = [...selectedSkillIds, id];
        }
    
        setSelectedSkillIds(updatedSkills);
        setField('skills', updatedSkills); 
      };

      useEffect(() => {
        if (skills && Array.isArray(skills)) {
          setSelectedSkillIds(skills);
        }
      }, [skills]);
  
  const dropdownMinimumIndividual = [
    "1 individual",
    "2 Members",
    "3 Members",
    "4 Members",
    "5 Members",
    "6 Members",
    "7 Members",
  ];

  const dropdownMaximum = [
    "2 Members",
    "3 Members",
    "4 Members",
    "5 Members",
    "6 Members",
    "7 Members",
  ];

  const initialNotifications = [
    { label: "Allow Solo Participation", checked: true },
  ]

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

          if (!min_team_size) {
              toast.error("Please enter a minimum team size", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
              });
              return;
            }

            if (!max_team_size) {
              toast.error("Please enter a maximum team size", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
              });
              return;
            }

        if (onNext) {
          onNext();
        }
        // Handle form submission logic here
        console.log("Form submitted");
      }
    
      const previousButton = () => {
        if (onPrev) {
          onPrev();
        }
        console.log("Going to previous step");
      }
    

  return (
    <>
      <section className="p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-bold">Team Configuration</h1>
          <p className="text-gray-600">Set up team requirements for participants.</p>
        </div>

        <form onSubmit={handleSubmit}>

        <div className="flex gap-6 flex-wrap">
          {/* Minimum Members Dropdown */}
          <div className="w-full md:w-[45%]">
            <label className="block mb-2 text-[#2F3036] font-bold">Minimum Team Members</label>
            <select
              className="w-full rounded-2xl border border-[#C5C6CC] px-4 py-3 outline-none"
              name="min_team_size"
              value={min_team_size}
              onChange={(e) => setField('min_team_size', e.target.value)}
            >
              {dropdownMinimumIndividual.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

        
          <div className="w-full md:w-[45%]">
            <label className="block mb-2 text-[#2F3036] font-bold">Maximum Team Members</label>
            <select
              className="w-full rounded-2xl border border-[#C5C6CC] px-4 py-3 outline-none"
              name="max_team_size"
              value={max_team_size}
              onChange={(e) => setField('max_team_size', e.target.value)}
            >
              {dropdownMaximum.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>



        <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-4">
        <label className="text-[#2F3036] font-bold text-lg">Set Your Skill</label>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isFetching ? 'Refreshing...' : 'Refetch'}
        </button>
      </div>

      {isLoading ? (
        <p>Loading skills...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load skills.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {data?.map((skill: Skills) => (
            <label
              key={skill.id}
              className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 ${
                selectedSkillIds.includes(skill.id)
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                value={skill.id}
                checked={selectedSkillIds.includes(skill.id)}
                onChange={() => handleSkillChange(skill.id)}
                className="hidden"
              />
              <span>{skill.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>



        <div className="mt-10">
        <div className="space-y-4">
          {notifications.map((notif, idx) => (
            <div key={idx} className="flex items-center justify-between w-2/5 xl:w-[25%] pb-3">
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
    </>
  );
}

export default Team;
