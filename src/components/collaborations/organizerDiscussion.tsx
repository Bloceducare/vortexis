import { Pin, SendIcon } from "lucide-react";

const judgesRoom = [
  {
    name: "Alex Smith",
    decision:
      "Will do. For clarification, how should we weight technical innovation vs. real-world impact?",
    time: "10:40",
  },
  {
    name: "Maria Rodriguez",
    decision:
      "Great question! We're looking for a balance, but for this hackathon, give technical innovation a slight edge (60/40 split).",
    time: "10:40",
  },
  {
    name: "Jane Doe",
    decision:
      "I just finished reviewing it. I was impressed by the UX design, very intuitive!",
    time: "10:40",
  },
  {
    name: "Maria Rodriguez",
    decision:
      "I agree on innovation, but I think the technical implementation needs more work. The repository doesn't have proper tests.",
    time: "10:40",
  },
  {
    name: "Maria Rodriguez",
    decision:
      "I agree on innovation, but I think the technical implementation needs more work. The repository doesn't have proper tests.",
    time: "10:40",
  },
  {
    name: "Maria Rodriguez",
    decision:
      "I agree on innovation, but I think the technical implementation needs more work. The repository doesn't have proper tests.",
    time: "10:40",
  },
];

function OrganizerDiscussion() {
  return (
    <div>
      <div className="bg-[#DAE0DE3D] p-4 mb-8 rounded-3xl border-l-24 pl-8 border-l-[#605DEC]">
        <div className="flex justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <Pin className="text-[#212121] h-6" />
            <p className="">Tom Williams (Organizer)</p>
          </div>
          <p>10:40 AM</p>
        </div>
        <p>
          Just a reminder to all judges: Please use the full range of the
          scoring scale (1-10) to ensure we can properly differentiate between
          submissions.
        </p>
      </div>

      <div className="space-y-8">
        {judgesRoom.map((room, i) => {
          return (
            <div key={i} className="flex gap-8 px-2">
              <p className="flex flex-col justify-center text-center font-semibold h-12 rounded-full w-12 uppercase bg-[#53535335]">
                {room.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </p>
              <div className="w-[60%] space-y-2">
                <p className="text-xl font-medium">{room.name}</p>
                <p>{room.decision}</p>
              </div>
              <p className="ms-auto pe-2">{room.time} AM</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-5">
        <input
          type="text"
          className="w-2/4 border h-16 pb-3 px-2 text-[#C5C6CC] border-[#C5C6CC] rounded-md focus:outline-none focus:border-[#C5C6CC] focus:ring-1 focus:ring-[#C5C6CC]"
          placeholder="Type your message here........"
        />

        <SendIcon className="w-18 text-white cursor-pointer rounded-md py-1.5 bg-[#605DEC] text-center h-16" />
      </div>
    </div>
  );
}

export default OrganizerDiscussion;
