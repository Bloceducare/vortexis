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

      <div className="flex flex-col w-[770px] gap-3 mt-4">
        {members.map((member, index) => {
          return (
            <div
              key={index}
              className="py-1 px-2 flex border-2 items-center border-[#605DEC] rounded-xl text-[#605DEC] gap-4"
            >
              <Image
                src={member.img || "/placeholder.svg"}
                alt={member.name}
                width={40}
                height={40}
                className="w-10 h-10 object-cover border-0"
              />
              <div>
                <p className="font-bold">{member.name}</p>
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
