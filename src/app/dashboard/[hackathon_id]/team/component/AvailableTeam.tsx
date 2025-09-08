import React from 'react'

function AvailableTeam() {
  return (
   
    <div>
        
    </div>
    // {availableTeams.length > 0 && (
    //     <div className="mt-4">
    //       <h3 className="text-lg font-semibold mb-2">Available Teams</h3>
    //       <ul className="list-disc pl-5">
    //         {availableTeams.map((team) => (
    //           <li key={team.id}>
    //             {team.name} - {team.members.length} members
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}

    //   <div className="p-6 space-y-6">
    //     {/* CREATE TEAM */}
    //     {!myTeam && (
    //       <form onSubmit={handleCreateTeam} className="space-y-4">
    //         <Input
    //           name="name"
    //           placeholder="Team Name"
    //           value={formData.name}
    //           onChange={handleChange}
    //           required
    //         />
    //         <Input
    //           name="members"
    //           placeholder="Members Email (comma separated)"
    //           value={formData.members.join(",")}
    //           onChange={handleChange}
    //           required
    //         />
    //         <button type="submit">Create Team</button>
    //       </form>
    //     )}

    //     {/* JOIN TEAM */}
    //     {!myTeam && (
    //       <div className="grid gap-4">
    //         {teams.map((team) => (
    //           <Card key={team.id}>
    //             <CardContent className="flex justify-between items-center p-4">
    //               <div>
    //                 <h2 className="font-bold">{team.name}</h2>
    //                 <p>{team.members.length} members</p>
    //               </div>
    //               <button onClick={() => setModal({ type: "join", teamId: team.id })}>
    //                 Join
    //               </button>
    //             </CardContent>
    //           </Card>
    //         ))}
    //       </div>
    //     )}

    
    //     {/* CUSTOM MODALS */}
    
    //     <Modal
    //       open={modal?.type === "delete"}
    //       onClose={() => setModal(null)}
    //       title="Are you sure you want to delete this team?"
    //       onConfirm={() => handleDeleteTeam(modal!.teamId!)}
    //       confirmText="Delete"
    //       confirmVariant="destructive"
    //     />

    //     <Modal
    //       open={modal?.type === "add"}
    //       onClose={() => setModal(null)}
    //       title="Add Member"
    //       onConfirm={() => console.log("Add member logic")}
    //     >
    //       <Input placeholder="Enter username" />
    //     </Modal>

    //     <Modal
    //       open={modal?.type === "remove"}
    //       onClose={() => setModal(null)}
    //       title="Remove Member"
    //       onConfirm={() => console.log("Remove member logic")}
    //     >
    //       <Input placeholder="Enter username" />
    //     </Modal>

    //     <Modal
    //       open={modal?.type === "update"}
    //       onClose={() => setModal(null)}
    //       title="Update Team Name"
    //       onConfirm={() => console.log("Update team name logic")}
    //     >
    //       <Input placeholder="New Team Name" />
    //     </Modal>
    //   </div>
  )
}

export default AvailableTeam