import React, { useState, useEffect } from "react";
import { NavigationProps } from "@/components/Interface";
import { toast } from "react-toastify";
import { useHackathonStore } from "@/store/useHackathonStore";
import { useShallow } from "zustand/shallow";
import useSkills from "@/hooks/useSkills";
import { Skills } from "@/app/api/utils/interface";
import { UserPlusIcon, UsersIcon, RefreshCw } from "lucide-react";

function Team({ onNext, onPrev, setData }: NavigationProps) {
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const hackathonSelector = useShallow((state: any) => ({
    min_team_size: state.min_team_size,
    max_team_size: state.max_team_size,
    skills: state.skills,
    setField: state.setField,
  }));

  const { min_team_size, max_team_size, skills, setField } =
    useHackathonStore(hackathonSelector);

  const { getAllSkills, createSkill } = useSkills();

  const { data, isLoading, isError, isFetching, refetch } = getAllSkills();

  const handleSkillChange = (id: number) => {
    let updatedSkills: number[];

    if (selectedSkillIds.includes(id)) {
      updatedSkills = selectedSkillIds.filter((skillId) => skillId !== id);
    } else {
      updatedSkills = [...selectedSkillIds, id];
    }

    setSelectedSkillIds(updatedSkills);
    setField("skills", updatedSkills);
  };

  useEffect(() => {
    if (skills && Array.isArray(skills)) {
      setSelectedSkillIds(skills);
    }
  }, [skills]);

  const initialNotifications = [
    { label: "Allow Solo Participation", checked: true },
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
  };

  const previousButton = () => {
    if (onPrev) {
      onPrev();
    }
  };

  return (
    <>
      <section className="p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-bold">Team Configuration</h1>
          <p className="text-gray-600">
            Set up team requirements for participants.
          </p>
        </div>

     <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-12">
  {/* Team Size Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[
      { label: "Minimum Team Size", name: "min_team_size", val: min_team_size, icon: <UsersIcon /> },
      { label: "Maximum Team Size", name: "max_team_size", val: max_team_size, icon: <UserPlusIcon /> },
    ].map((item) => (
      <div key={item.name} className="group">
        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
          {item.label}
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-gray-400 group-focus-within:text-[#0B40EE] transition-colors">
            {item.icon}
          </span>
          <input
            type="number" // Changed to number for better mobile UX
            placeholder="0"
            name={item.name}
            value={item.val}
            onChange={(e) => setField(item.name, e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B40EE] focus:bg-white dark:focus:bg-transparent transition-all"
          />
        </div>
      </div>
    ))}
  </div>

  {/* Skills Selection Section */}
  <div className="space-y-6">
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Required Skills</h3>
        <p className="text-sm text-gray-500">Select the skills needed for this hackathon</p>
      </div>
      <button
        type="button"
        onClick={() => refetch()}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
          isFetching 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10"
        }`}
      >
        <RefreshCw className={isFetching ? "animate-spin" : ""} />
        {isFetching ? "Syncing..." : "Refresh List"}
      </button>
    </div>

    {isLoading ? (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 animate-pulse">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg" />
        ))}
      </div>
    ) : (
      <div className="flex flex-wrap gap-3">
        {data?.map((skill: Skills) => {
          const isSelected = selectedSkillIds.includes(skill.id);
          return (
            <label
              key={skill.id}
              className={`group cursor-pointer flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 select-none ${
                isSelected
                  ? "bg-[#0B40EE] border-[#0B40EE] text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#0B40EE] hover:text-[#0B40EE]"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSkillChange(skill.id)}
                className="hidden"
              />
              {skill.name}
            </label>
          );
        })}
      </div>
    )}
  </div>

  {/* Navigation Buttons */}
  <div className="flex items-center justify-between pt-10 border-t border-gray-100 dark:border-gray-800">
    <button
      type="button"
      onClick={previousButton}
      className="px-8 py-3 text-gray-500 font-semibold hover:text-gray-700 dark:hover:text-white transition-colors"
    >
      Back
    </button>
    <button
      type="submit"
      className="bg-[#0B40EE] hover:bg-[#0835C4] text-white font-bold py-3 px-12 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
    >
      Next Step
    </button>
  </div>
</form>
      </section>
    </>
  );
}

export default Team;
