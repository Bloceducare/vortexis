
import { useState } from "react";
import { Upload, User } from "lucide-react";

const ProfileTab = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    skills: ["React", "TypeScript", "UI Design", ""],
    githubUsername: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...profileData.skills];
    newSkills[index] = value;
    setProfileData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saving profile changes...", profileData);
  };

  const handleRemovePhoto = () => {
    console.log("Removing profile photo...");
  };

  const handleUploadPhoto = () => {
    console.log("Opening photo upload...");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
        <p className="text-gray-600">Update your personal information and how it appears to others</p>
      </div>

      <div className="space-y-6">
        {/* Profile Photo */}
        <div className="space-y-4">
          {/* <label className="text-sm font-medium text-gray-700">Profile Photo</label> */}
          <div className="flex items-center gap-4">
            {/* <Avatar className="w-16 h-16">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gray-200 text-gray-600">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar> */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-gray-600"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={handleUploadPhoto}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              placeholder="Your first name"
              value={profileData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              placeholder="Your last name"
              value={profileData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("lastName", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your email address"
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Bio*
          </label>
          <textarea
            id="bio"
            placeholder="Your bio"
            value={profileData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="w-full min-h-[120px] resize-none"
          />
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Skills</label>
            <p className="text-sm text-gray-500 mt-1">Enter the technologies used in your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.skills.map((skill, index) => (
              <input
                key={index}
                placeholder={index === profileData.skills.length - 1 ? "And more....." : ""}
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="w-full"
              />
            ))}
          </div>
        </div>

        {/* GitHub Username */}
        <div className="space-y-2">
          <label htmlFor="githubUsername" className="text-sm font-medium text-gray-700">
            GitHub Username
          </label>
          <input
            id="githubUsername"
            placeholder=""
            value={profileData.githubUsername}
            onChange={(e) => handleInputChange("githubUsername", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={handleSaveChanges}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
