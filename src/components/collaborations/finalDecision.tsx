import { Pin } from "lucide-react";

function FinalDecision() {
  return (
    <div>
      <div className="bg-[#DAE0DE3D] p-4 mb-8 rounded-3xl border-l-24 pl-8 border-l-[#605DEC]">
        <div className="flex justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <Pin className="text-[#212121] h-6" />
            <p className="">Final Decision Room</p>
          </div>
          <p>10:40 AM</p>
        </div>
        <p>
          Review the collective scores and make final recommendations for the
          winners. All judges must submit their final recommendations by May
          15th.
        </p>
      </div>
    </div>
  );
}

export default FinalDecision;
