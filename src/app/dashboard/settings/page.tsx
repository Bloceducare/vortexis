"use client"


import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/dashboard/ProfileTab";

const tabMenu = ["profile", "notifications", "account"];

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <div className="min-h-screen bg-white rounded-2xl p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div defaultValue="profile" className="w-full">
          <nav className="grid w-full grid-cols-3 max-w-md">
            {tabMenu.map((tab, index) => (
              <button type="button" key={index} onClick={() => setActiveTab(tab)} value="profile">{tab}</button>
            ))}
          </nav>
          
          {activeTab === "profile" &&
            <div className="mt-6">
              <ProfileTab />
            </div>
          }
          
          {activeTab === "notifications" &&
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          }
          
          {activeTab === "account" &&
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Settings;
