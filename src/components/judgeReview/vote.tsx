import { Submission } from "@/hooks/useHackathonDetails";

function Vote({ items }: { items: Submission }) {
  return (
    <div>
      <p className="md:text-2xl text-xl font-bold dark:text-white">
        {/* BlockChain Vote - Secure Voting System */}
        {items?.project.title}
      </p>
      <p className="bg-[#727272] dark:bg-gray-600 uppercase mt-3 mb-2 w-24 rounded-full p-1 text-white text-center text-[0.65rem] transition-colors">
        {items?.team.name}
      </p>
      <p className="text-[#727272] dark:text-gray-300 mb-4 text-sm">{items?.project.description}</p>
      {/* <p className="text-xl mb-4 font-[400]">
        Hackathon: Web3 Innovation Challenge{" "}
      </p>
      <p className="text-[#00AC4F] text-sm font-medium">
        This project was submitted for the "Decentralized Applications"
        category.
      </p> */}
    </div>
  );
}

export default Vote;
