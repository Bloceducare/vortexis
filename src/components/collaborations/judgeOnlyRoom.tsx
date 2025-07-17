import { Pin, SendIcon } from "lucide-react";

const judgesRoom = [
  {
    name: "Alex Smith",
    decision:
      "What does everyone think about the BlockChain Vote project? I gave it high marks for innovation.",
    time: "10:40",
  },
  {
    name: "Maria Rodriguez",
    decision:
      "I agree on innovation, but I think the technical implementation needs more work. The repository doesn't have proper tests.",
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

function JudgeOnlyRoom() {
  return (
    <div>
      <div className="bg-[#DAE0DE3D] w-[1088px] px-4 py-1.5 mb-8 rounded-3xl border-l-24 pl-6 border-l-[#605DEC]">
        <div className="flex justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <Pin className="text-[#212121] h-6" />
            <p className="">System</p>
          </div>
          <p>10:40 AM</p>
        </div>
        <p>Reminder: All reviews must be completed by May 15th, 5:00 PM EST.</p>
      </div>

      <div className="space-y-7 w-[1083px]">
        {judgesRoom.map((room, i) => {
          return (
            <div key={i} className="flex gap-6 px-2">
              <p className="flex flex-col justify-center text-center font-semibold h-10 rounded-full w-10 uppercase bg-[#53535335]">
                {room.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </p>
              <div className="w-[60%] space-y-1">
                <p className="text-xl font-medium">{room.name}</p>
                <p className="text-sm">{room.decision}</p>
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

export default JudgeOnlyRoom;
