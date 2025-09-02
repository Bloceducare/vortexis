"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import useTeams from "@/hooks/useTeams";
import { useParams } from "next/navigation";

function Modal({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  confirmVariant = "default",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: "default" | "destructive";
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={confirmVariant === "destructive" ? "text-red-600" : ""}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamManagement() {
  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;

  const [availableTeams, setAvailableTeams] = useState<any[]>([]);
  const { getAvailableTeams, createTeamMutation } = useTeams();

  // Example local teams
  const [teams, setTeams] = useState([
    { id: 1, name: "Team Alpha", members: ["alice@mail.com", "bob@mail.com"] },
    { id: 2, name: "Team Beta", members: ["charlie@mail.com"] },
  ]);

  const [myTeam, setMyTeam] = useState<any>(null);
  const [modal, setModal] = useState<{ type: string; teamId?: number } | null>(
    null
  );

  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    members: [] as string[],
    hackathon_id,
  });

  // ✅ Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "members") {
      // split members by commas and trim spaces
      setFormData((prev) => ({
        ...prev,
        members: value.split(",").map((m) => m.trim()).filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Handle submit
  const handleCreateTeam = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Final payload:", formData);

    // You can send to backend here
    createTeam(formData);

    // Add locally for UI demo
    setTeams([...teams, { id: Date.now(), ...formData }]);

    // Reset form
    setFormData({ name: "", members: [], hackathon_id });
  };

  const handleJoinTeam = (id: number) => {
    setMyTeam(teams.find((t) => t.id === id));
  };

  const handleDeleteTeam = (id: number) => {
    setTeams(teams.filter((t) => t.id !== id));
    setMyTeam(null);
  };

  const { data: availableTeamsData, isLoading, error } =
    getAvailableTeams(hackathon_id);

  const viewAvailableTeams = () => {
    if (availableTeamsData) {
      console.log(availableTeamsData);
      setAvailableTeams(availableTeamsData);
    }
  };

  const createTeam = async (data: any) => {
    try {
      console.log("Create team request:", data);
    await createTeamMutation().mutateAsync(data)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <button onClick={viewAvailableTeams}>View Available Teams</button>

      {availableTeams.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Available Teams</h3>
          <ul className="list-disc pl-5">
            {availableTeams.map((team) => (
              <li key={team.id}>
                {team.name} - {team.members.length} members
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* CREATE TEAM */}
        {!myTeam && (
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <Input
              name="name"
              placeholder="Team Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              name="members"
              placeholder="Members Email (comma separated)"
              value={formData.members.join(",")}
              onChange={handleChange}
              required
            />
            <button type="submit">Create Team</button>
          </form>
        )}

        {/* JOIN TEAM */}
        {!myTeam && (
          <div className="grid gap-4">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h2 className="font-bold">{team.name}</h2>
                    <p>{team.members.length} members</p>
                  </div>
                  <button onClick={() => setModal({ type: "join", teamId: team.id })}>
                    Join
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* MY TEAM */}
        {myTeam && (
          <Card>
            <CardContent className="space-y-4 p-4">
              <h2 className="font-bold text-lg">{myTeam.name}</h2>
              <ul className="list-disc pl-4">
                {myTeam.members.map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button onClick={() => setModal({ type: "update" })}>
                  Update Name
                </button>
                <button onClick={() => setModal({ type: "add" })}>Add Member</button>
                <button onClick={() => setModal({ type: "remove" })}>
                  Remove Member
                </button>
                <button
                  onClick={() => setModal({ type: "delete", teamId: myTeam.id })}
                >
                  Delete Team
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CUSTOM MODALS */}
        <Modal
          open={modal?.type === "join"}
          onClose={() => setModal(null)}
          title="Confirm Join Team?"
          onConfirm={() => handleJoinTeam(modal!.teamId!)}
        />

        <Modal
          open={modal?.type === "delete"}
          onClose={() => setModal(null)}
          title="Are you sure you want to delete this team?"
          onConfirm={() => handleDeleteTeam(modal!.teamId!)}
          confirmText="Delete"
          confirmVariant="destructive"
        />

        <Modal
          open={modal?.type === "add"}
          onClose={() => setModal(null)}
          title="Add Member"
          onConfirm={() => console.log("Add member logic")}
        >
          <Input placeholder="Enter username" />
        </Modal>

        <Modal
          open={modal?.type === "remove"}
          onClose={() => setModal(null)}
          title="Remove Member"
          onConfirm={() => console.log("Remove member logic")}
        >
          <Input placeholder="Enter username" />
        </Modal>

        <Modal
          open={modal?.type === "update"}
          onClose={() => setModal(null)}
          title="Update Team Name"
          onConfirm={() => console.log("Update team name logic")}
        >
          <Input placeholder="New Team Name" />
        </Modal>
      </div>
    </section>
  );
}

