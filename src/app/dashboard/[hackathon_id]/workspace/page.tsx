
import { Button } from "@/components/ui/Button";
import {Card} from "@/components/ui/card";
import { Plus, Github, FileText, Book } from "lucide-react";

const TeamWorkspace = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    {
      name: "Sarah Chen",
      role: "Backend Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      name: "Mike Rodriguez",
      role: "UI Designer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    },
    {
      name: "Coco Happiness",
      role: "UX Designer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coco"
    },
    {
      name: "Dona",
      role: "Backend Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dona"
    }
  ];

  const tasks = [
    { id: 1, title: "Set up project repository", status: "completed" },
    { id: 2, title: "Create project plan", status: "completed" },
    { id: 3, title: "Design user interface", status: "in-progress" },
    { id: 4, title: "Implement core functionality", status: "upcoming" },
    { id: 5, title: "Prepare final presentation", status: "upcoming" }
  ];

  const meetings = [
    {
      title: "Team Standup",
      description: "Daily check-in to discuss progress and blockers",
      time: "Today, 3:30pm"
    },
    {
      title: "Mentor Meeting",
      description: "Meeting with industry mentor to get feedback",
      time: "Tomorrow, 1:00pm"
    },
    {
      title: "Mentor Meeting",
      description: "Meeting with industry mentor to get feedback",
      time: "Tomorrow, 1:00pm"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "upcoming":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "upcoming":
        return "Upcoming";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Team Workspace</h1>
          <p className="text-gray-600 mb-6">Collaborate with your team members!</p>

          {/* Hackathon Pills */}
          <div className="flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              AI Innovation Challenge
            </Button>
            <Button variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              Climate Tech Hackathon
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Team and Tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Team Section */}
            <Card>
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">Team: Innovation Squad</h2>
                  <p className="text-gray-600 mb-4">Working on AI Innovation Challenge</p>

                  <h3 className="text-lg font-medium text-blue-600 mb-4">Team Members</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-blue-600">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))}

                    {/* Invite Member Button */}
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 p-3 h-auto border-dashed border-2 border-gray-300 hover:border-blue-400"
                    >
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-600">Invite Member</span>
                    </Button>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Details</h3>
                  <p className="text-gray-600">
                    Our team is building an AI-powered code assistant that helps developers write clean,
                    efficient code faster.
                  </p>
                </div>
              </div>
            </Card>

            {/* Tasks Section */}
            <Card>
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-green-600 mb-1">Tasks</h2>
                  <p className="text-gray-600">Track your team's progress</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <input
                            title={task.title}
                            type="checkbox"
                            checked={task.status === "completed"}
                            disabled
                          />
                          <span className="text-gray-700">{task.title}</span>
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Resources and Meetings */}
          <div className="space-y-8">
            {/* Project Resources */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Project Resources</h2>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full flex justify-start gap-3 h-12"
                  >
                    <Github className="w-5 h-5" />
                    GitHub Repository
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start gap-3 h-12"
                  >
                    <FileText className="w-5 h-5" />
                    Project Docs
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start gap-3 h-12"
                  >
                    <Book className="w-5 h-5" />
                    API Documentation
                  </Button>
                </div>
              </div>
            </Card>

            {/* Upcoming Meetings */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-green-600 mb-4">Upcoming Meetings</h2>
                <div className="space-y-4">
                  {meetings.map((meeting, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                        <span className="text-sm font-medium text-green-600">{meeting.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{meeting.description}</p>
                      {index < meetings.length - 1 && <hr className="mt-4" />}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamWorkspace;