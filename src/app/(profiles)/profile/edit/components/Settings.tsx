"use client";
import { useState, useEffect } from "react";
import useUser from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import useSkills from '@/hooks/useSkills';
import { Skills } from "@/app/api/utils/interface";


interface SettingsProps {
  onClose?: () => void;
}

export default function SettingsPage({ onClose }: SettingsProps) {
  const router = useRouter();
  const { getUserDetail, updateUserDetail, updateUserProfile } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Skills[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skills[]>([]);


  const { data, isLoading, error: fetchError } = getUserDetail();
  const updateDetailMutation = updateUserDetail();
  const updateProfileMutation = updateUserProfile();

  const tabs = ["Personal", "Social", "Skills & Interests"];
  const [activeTab, setActiveTab] = useState("Personal");
  const { getAllSkills } = useSkills()

  const {data: userSkills }  = getAllSkills()

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    skills: [], 
  });

  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (data?.user) {
      const userProfileSkills = data.user.profile.skills || []
  
      setForm({
        first_name: data.user.first_name || "",
        last_name: data.user.last_name || "",
        username: data.user.username || "",
        email: data.user.email || "",
        bio: data.user.profile?.bio || "",
        location: data.user.profile?.location || "",
        github: data.user.profile?.github || "",
        linkedin: data.user.profile?.linkedin || "",
        twitter: data.user.profile?.twitter || "",
        website: data.user.profile?.website || "",
        skills: userProfileSkills, // still here for fallback
      })
  
      setSelectedSkills(userProfileSkills) // ✅ populate chip UI
    }
  }, [data])
  

  // Redirect after success
  useEffect(() => {
    if (updateDetailMutation.isSuccess && updateProfileMutation.isSuccess) {
      router.push("/profile/detail");
      if (onClose) {
        onClose();
      }
      
    }
    if (updateDetailMutation.isError || updateProfileMutation.isError) {
      setShowErrorModal(true);
    }
  }, [
    updateDetailMutation.isSuccess,
    updateProfileMutation.isSuccess,
    updateDetailMutation.isError,
    updateProfileMutation.isError,
    router,
    onClose,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeSkill = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().length > 0) {
      const filtered = userSkills.filter((skill: Skills) =>
        skill.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  const handleSelect = (skill: Skills) => {
    if (!selectedSkills.some((s) => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setInputValue("");
    setSuggestions([]);
  };

  const handleRemove = (id: number) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    const detailData = {
      first_name: form.first_name,
      last_name: form.last_name,
      username: form.username,
      email: form.email,
    };

    const profileData = {
      bio: form.bio,
      location: form.location,
      github: form.github,
      linkedin: form.linkedin,
      twitter: form.twitter,
      website: form.website,
      skills: selectedSkills.map((s) => ({ name: s.name })),
    };

    updateDetailMutation.mutate({ data: detailData });
    updateProfileMutation.mutate({ data: profileData });
  };

  const isUpdating =
    updateDetailMutation.isPending || updateProfileMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">Profile Settings</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <section className=" flex justify-start w-full px-5 py-3">
        <div className="flex gap-10 bg-[#F5F5F5] rounded-full px-4 py-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm cursor-pointer font-semibold text-black ${
                activeTab === tab
                  ? " bg-blue-600 text-white rounded-full "
                  : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        </section>
       

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isUpdating && (
            <p className="text-blue-500 font-medium mb-4">Saving changes...</p>
          )}

          {/* Personal Tab */}
          {activeTab === "Personal" && (
            <section className="space-y-5">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["first_name", "last_name", "username", "email", "location"].map((field) => (
                <div key={field}>
                  <label className="block font-medium capitalize mb-1">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              ))}
            </div>

    <label className="block font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 h-28 resize-none"
              />
            </section>
           
          )}

          {/* Social Tab */}
          {activeTab === "Social" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[ "github", "linkedin", "twitter", "website"].map(
                (field) => (
                  <div key={field}>
                    <label className="block font-medium capitalize mb-1">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={(form as any)[field]}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                )
              )}
            </div>
          )}

          {/* Skills & Interests Tab */}
          {activeTab === "Skills & Interests" && (
           <div className="">
           <label className="block mb-1 text-[#212121] font-semibold">Skills & Interests</label>
     
           <div className="border rounded-lg p-2 flex flex-wrap items-center gap-2">
  {selectedSkills.map((skill) => (
    <span
      key={skill.id}
      className="px-3 py-1 bg-[#F2F1FD] text-[#605DEC] rounded-lg flex items-center gap-2 font-semibold text-[16px]"
    >
      {skill.name}
      <button
        onClick={() => handleRemove(skill.id)}
        className="text-red-500 hover:text-red-700"
      >
        ×
      </button>
    </span>
  ))}

  <input
    type="text"
    value={inputValue}
    onChange={handleChangeSkill}
    placeholder="Add your skills..."
    className="flex-1 min-w-[120px] border-none outline-none p-1"
  />
</div>


     
           {/* Suggestions dropdown */}
           {suggestions.length > 0 && (
             <ul className="border rounded-lg mt-1 bg-white shadow-md max-h-40 overflow-y-auto">
               {suggestions.map((skill) => (
                 <li
                   key={skill.id}
                   onClick={() => handleSelect(skill)}
                   className="p-2 hover:bg-gray-100 cursor-pointer"
                 >
                   {skill.name}
                 </li>
               ))}
             </ul>
           )}
         </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-red-600">Update Failed</h2>
            <p className="mt-2 text-gray-600">
              {updateDetailMutation.error?.message ||
                updateProfileMutation.error?.message ||
                "Something went wrong while updating your profile."}
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
