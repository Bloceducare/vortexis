import Louise from "@/public/assets/icon/louise.svg";
import Image from "next/image";

const members = [
  {
    img: Louise,
    name: "Alex Johnson",
    role: "Frontend Developer",
  },
  {
    img: Louise,
    name: "Alex Johnson",
    role: "Frontend Developer",
  },
  {
    img: Louise,
    name: "Alex Johnson",
    role: "UX Designer",
  },
  {
    img: Louise,
    name: "Alex Johnson",
    role: "Backend Developer",
  },
];

function Members() {
  return (
    <div>
      <p className="text-[#1C1D1D] text-xl font-medium">Team Members</p>

      <div className="flex flex-col gap-4 mt-4">
        {members.map((member, index) => {
          return (
            <div
              key={index}
              className="p-2 flex border-2 items-center border-[#605DEC] rounded-lg text-[#605DEC] gap-4"
            >
              <img
                src={`${member.img.src}`}
                alt={`${member.name}`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-bold ">{member.name}</p>
                <p className="text-sm">{member.role}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Members;
