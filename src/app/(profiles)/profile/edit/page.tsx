"use client";
import { useState, useEffect } from "react";
import useUser from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { getUserDetail, updateUserDetail, updateUserProfile } = useUser();

  const { data, isLoading, error: fetchError } = getUserDetail();
  const updateDetailMutation = updateUserDetail();
  const updateProfileMutation = updateUserProfile();

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
  });

  const [showErrorModal, setShowErrorModal] = useState(false);

  // Populate form with fetched data
  useEffect(() => {
    if (data?.user) {
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
      });
    }
  }, [data]);

  // Redirect to profile detail after successful update
  useEffect(() => {
    if (updateDetailMutation.isSuccess && updateProfileMutation.isSuccess) {
      router.push("/profile/detail");
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
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    };

    updateDetailMutation.mutate({ data: detailData });
    updateProfileMutation.mutate({ data: profileData });
  };

  const isUpdating =
    updateDetailMutation.isPending || updateProfileMutation.isPending;

  if (isLoading) {
    // Skeleton loader
    return (
      <section className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl animate-pulse">
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="mt-6 h-10 w-40 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="pt-24 text-center text-red-600">
        Failed to load settings: {fetchError.message}
      </section>
    );
  }

  return (
    <>
      <section className="mb-10 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

          {isUpdating && (
            <p className="text-blue-500 font-medium mb-4">Saving changes...</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["first_name", "last_name", "username", "email"].map((field) => (
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

            {["location", "github", "linkedin", "twitter", "website"].map(
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

          <div className="mt-4">
            <label className="block font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 h-24 resize-none"
            ></textarea>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>

      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
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
    </>
  );
}
