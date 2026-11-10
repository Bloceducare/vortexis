import React from "react";
import { NavigationProps } from "@/components/Interface";
import { useHackathonStore } from "@/store/useHackathonStore";
import { useShallow } from "zustand/shallow";
import useSkills from "@/hooks/useSkills";
import { Skills } from "@/app/api/utils/interface";
import { FieldError, FieldLabel, errorRing, useFieldError } from "./FormField";
import { UserPlusIcon, UsersIcon, RefreshCw } from "lucide-react";

function Team({ onNext, onPrev }: NavigationProps) {
  const { min_team_size, max_team_size, skills, setField } = useHackathonStore(
    useShallow((state) => ({
      min_team_size: state.min_team_size,
      max_team_size: state.max_team_size,
      skills: state.skills,
      setField: state.setField,
    }))
  );
  const selectedSkillIds: number[] = Array.isArray(skills) ? skills : [];

  const minErr = useFieldError("min_team_size");
  const maxErr = useFieldError("max_team_size");
  const skillsErr = useFieldError("skills");

  const { getAllSkills } = useSkills();
  const { data, isLoading, isError, isFetching, refetch } = getAllSkills();

  const handleSkillChange = (id: number) => {
    const updated = selectedSkillIds.includes(id)
      ? selectedSkillIds.filter((skillId) => skillId !== id)
      : [...selectedSkillIds, id];
    setField("skills", updated);
    skillsErr.clear();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext?.();
  };

  return (
    <>
      <section className="p-6">
     <form onSubmit={handleSubmit} noValidate className="max-w-5xl mx-auto space-y-12">
  {/* Team Size Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[
      { label: "Minimum Team Size", name: "min_team_size" as const, val: min_team_size, icon: <UsersIcon />, err: minErr, hint: "Use 1 to allow solo participants." },
      { label: "Maximum Team Size", name: "max_team_size" as const, val: max_team_size, icon: <UserPlusIcon />, err: maxErr, hint: "Between 1 and 100." },
    ].map((item) => (
      <div key={item.name} className="group">
        <FieldLabel htmlFor={item.name} required className="block mb-2">
          {item.label}
        </FieldLabel>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-gray-400 group-focus-within:text-[#0B40EE] transition-colors">
            {item.icon}
          </span>
          <input
            id={item.name}
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            step={1}
            placeholder={item.name === "min_team_size" ? "1" : "5"}
            name={item.name}
            aria-invalid={!!item.err.error}
            value={item.val ?? ""}
            onChange={(e) => {
              setField(item.name, e.target.value === "" ? (undefined as any) : Number(e.target.value));
              item.err.clear();
            }}
            className={`${errorRing(!!item.err.error)} w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#0B40EE] focus:bg-white dark:focus:bg-transparent transition-all`}
          />
        </div>
        {item.err.error ? (
          <FieldError message={item.err.error} />
        ) : (
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{item.hint}</p>
        )}
      </div>
    ))}
  </div>

  {/* Skills Selection Section */}
  <div className="space-y-6">
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Required Skills
          <span className="ml-2 text-xs font-normal text-gray-400">(optional)</span>
        </h3>
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
    ) : isError ? (
      <p className="text-sm text-red-600 dark:text-red-400">
        Couldn&apos;t load skills. Use &quot;Refresh List&quot; to try again, or continue without selecting skills.
      </p>
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
    <FieldError message={skillsErr.error} />
  </div>

  {/* Navigation Buttons */}
  <div className="flex items-center justify-between pt-10 border-t border-gray-100 dark:border-gray-800">
    <button
      type="button"
      onClick={() => onPrev?.()}
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
