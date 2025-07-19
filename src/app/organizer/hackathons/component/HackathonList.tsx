import { HackathonCard, type Hackathon } from "./HackathonCard";

// Mock data for demonstration
const mockHackathons: Hackathon[] = [
  {
    id: "1",
    title: "TechVision 2024",
    description: "Build the future of technology with AI, blockchain, and cutting-edge innovations. Join 500+ developers for 48 hours of intense coding.",
    startDate: "Mar 15, 2024",
    endDate: "Mar 17, 2024",
    duration: "48 hours",
    venue: "Silicon Valley Convention Center",
    visibility: "public",
    status: "upcoming",
    judges: 12,
    participants: 456,
    submissions: 0
  },
  {
    id: "2",
    title: "Green Code Challenge",
    description: "Sustainable solutions for environmental challenges. Create apps that make a positive impact on our planet.",
    startDate: "Feb 20, 2024",
    endDate: "Feb 22, 2024",
    duration: "3 days",
    venue: "EcoTech Campus, Portland",
    visibility: "public",
    status: "active",
    judges: 8,
    participants: 234,
    submissions: 89
  },
  {
    id: "3",
    title: "FinTech Innovation Lab",
    description: "Revolutionary financial technology solutions. Private hackathon for selected participants only.",
    startDate: "Jan 10, 2024",
    endDate: "Jan 12, 2024",
    duration: "3 days",
    venue: "Wall Street Innovation Hub",
    visibility: "private",
    status: "finished",
    judges: 15,
    participants: 120,
    submissions: 67
  },
  {
    id: "4",
    title: "Healthcare Heroes Hackathon",
    description: "Digital health solutions to improve patient care and medical accessibility worldwide.",
    startDate: "Mar 25, 2024",
    endDate: "Mar 27, 2024",
    duration: "72 hours",
    venue: "Medical Innovation Center",
    visibility: "public",
    status: "just-created",
    judges: 10,
    participants: 0,
    submissions: 0
  },
  {
    id: "5",
    title: "Gaming Revolution 2024",
    description: "Next-generation gaming experiences with VR, AR, and immersive technologies.",
    startDate: "Apr 5, 2024",
    endDate: "Apr 7, 2024",
    duration: "48 hours",
    venue: "GameDev Studios, Austin",
    visibility: "public",
    status: "upcoming",
    judges: 6,
    participants: 345,
    submissions: 0
  },
  {
    id: "6",
    title: "EdTech Disruptors",
    description: "Transform education through innovative technology solutions and learning platforms.",
    startDate: "May 12, 2024",
    endDate: "May 14, 2024",
    duration: "3 days",
    venue: "University Innovation Lab",
    visibility: "private",
    status: "upcoming",
    judges: 9,
    participants: 178,
    submissions: 0
  }
];

export const HackathonList = () => {
    return (
      <div className="">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#009aff] to-[#00c2ff] text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Amazing Hackathons
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
               View and Control your Hackathons
              </p>
            </div>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">6</div>
              <div className="text-sm text-gray-500">Total Hackathons</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">1,333</div>
              <div className="text-sm text-gray-500">Total Participants</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">60</div>
              <div className="text-sm text-gray-500">Total Judges</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">156</div>
              <div className="text-sm text-gray-500">Total Submissions</div>
            </div>
          </div>
  
          {/* Hackathon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockHackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        </div>
      </div>
    );
  };