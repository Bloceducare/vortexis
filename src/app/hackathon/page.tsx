"use client";

import React, { useState, useEffect } from "react";
import HackathonHeaders from "@/components/HackathonHeaders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import HackathonCard from "@/components/HackathonCard";
import FilterSection from "@/components/FilterSection"; // Import the new component
import Img1 from "@/public/assets/sponsors/sponsor1.svg";
import Img2 from "@/public/assets/sponsors/sponsor2.svg";
import Img3 from "@/public/assets/sponsors/sponsor3.svg";
import { Hackathons } from "./form/utils/utils";

interface Hackathon {
  image: string;
  name: string;
  location: string;
  participants: string;
  prize: number;
  date: string;
  mode: string;
  startTime: string;
  organization: string;
  entry: string;
  type: string;
}

const hackathonsData: Hackathon[] = [
  {
    image: Img1,
    name: "AI Innovation Challenge",
    location: "Online",
    participants: "500",
    prize: 10000,
    date: "2025-04-15 14:00:00",
    mode: "Upcoming",
    startTime: "2:00 PM",
    organization: "Tech Innovators",
    entry: "Free",
    type: "Gaming",
  },
  {
    image: Img2,
    name: "Blockchain Hackathon",
    location: "In-person",
    participants: "300",
    prize: 5000,
    date: "2025-05-10 10:00:00",
    mode: "Open",
    startTime: "10:00 AM",
    organization: "Crypto Labs",
    entry: "Paid",
    type: "Cybersecurity",
  },
  {
    image: Img3,
    name: "Cybersecurity Hackfest",
    location: "Hybrid",
    participants: "200",
    prize: 8000,
    date: "2025-06-20 09:30:00",
    mode: "Ended",
    startTime: "9:30 AM",
    organization: "Security Experts",
    entry: "Free",
    type: "Lifehacks",
  },
];

const Page: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedLength, setSelectedLength] = useState<string>("");
  const [selectedHackathons, setSelectedHackathons] = useState<string>("");
  const [filteredHackathons, setFilteredHackathons] =
    useState<Hackathon[]>(hackathonsData);

  const locations = ["Online", "In-person", "Hybrid"];
  const statuses = ["Upcoming", "Open", "Ended"];
  const lengths = ["1-6 days", "1+ month"];

  useEffect(() => {
    let filtered = hackathonsData;

    if (selectedLocation) {
      filtered = filtered.filter((hack) => hack.location === selectedLocation);
    }

    if (selectedStatus) {
      filtered = filtered.filter((hack) => hack.mode === selectedStatus);
    }

    if (selectedHackathons) {
      filtered = filtered.filter((hack) => hack.type === selectedHackathons);
    }

    setFilteredHackathons(filtered);
  }, [selectedLocation, selectedStatus, selectedLength, selectedHackathons]);

  return (
    <section>
      <HackathonHeaders title="Join the world's best online and in-person hackathons" />

      <div className="py-10 flex justify-center ">
        <div className="flex gap-4 md:gap-10 w-full justify-center flex-wrap md:flex-nowrap ">
          <Input
            placeholder="Search by hackathon title or keywords"
            className="md:w-[30%] h-[50%] md:h-full"
          />
          <Button size="lg" className="px-6">
            Search Hackathons
          </Button>
        </div>
      </div>

      <section className="flex justify-between px-5 lg:px-10 flex-wrap  lg:flex-nowrap gap-10 py-5 md:py-10">
        {/* Filter Section */}
        <section className="lg:w-[30%] lg:space-y-10 flex flex-wrap gap-2 lg:block md:gap-10">
          <FilterSection
            title="Location"
            options={locations}
            selectedOption={selectedLocation}
            onChange={setSelectedLocation}
          />
          <FilterSection
            title="Status"
            options={statuses}
            selectedOption={selectedStatus}
            onChange={setSelectedStatus}
          />
          <FilterSection
            title="Length"
            options={lengths}
            selectedOption={selectedLength}
            onChange={setSelectedLength}
          />
          <FilterSection
            title="Interest Type"
            options={Hackathons}
            selectedOption={selectedHackathons}
            onChange={setSelectedHackathons}
          />
        </section>

        {/* Hackathon Display Section */}
        <section className="w-full  lg:w-[70%] 2xl:w-[50%] h-[120vh] overflow-auto hide-scrollbar">
          {filteredHackathons.length > 0 ? (
            filteredHackathons.map((hackathon, index) => (
              <HackathonCard key={index} {...hackathon} />
            ))
          ) : (
            <p className="text-center text-gray-500">No hackathons found.</p>
          )}
        </section>
      </section>
    </section>
  );
};

export default Page;
