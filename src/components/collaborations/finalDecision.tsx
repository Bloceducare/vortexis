import { Pin } from "lucide-react";

function FinalDecision() {
  return (
    <div>
      <div className="bg-[#DAE0DE3D] w-[1088px] px-4 py-1.5 mb-8 rounded-3xl border-l-24 pl-6 border-l-[#605DEC]">
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

      <div className="w-[1083px] space-y-6">
        <div className=" border border-[#E4E4E4] rounded-lg bg-white py-8 px-4 space-y-1.5">
          <div className="border-b-2 flex justify-between border-[#535353] pb-4">
            <div className="flex gap-4 items-center">
              <p className="bg-[#727272] px-1 h-6 text-center py-1 rounded-full text-xs">
                Rank#1
              </p>
              <p className="text-2xl font-bold">BlockChain Vote </p>
            </div>

            <p className="font-bold">8.7</p>
          </div>
          <div className="pl-5">
            <p className="text-xl font-[600] mb-5 ">Judge Scores</p>

            <div className="mb-2 flex items-center justify-between">
              <div className="flex justify-between w-[408px]">
                {" "}
                <p>Jane Doe</p> <p>9.4</p>
              </div>
              <div className="flex justify-between w-[565px]">
                {" "}
                <p className="-ms-10">Maria Rodriguez</p>{" "}
                <p className="ms-auto">8.5</p>{" "}
              </div>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex justify-between w-[408px]">
                {" "}
                <p>Alex Smith</p> <p>8.4</p>
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <div className="flex justify-between w-[408px]">
                {" "}
                <p>Maria Rodriguez</p> <p>8.5</p>
              </div>
            </div>

            <div className="w-[627px] mt-3">
              <p className="text-2xl mb-1">Summary Comments</p>
              <p>
                Innovative solution with strong technical implementation. UI
                could use some polish.
              </p>
            </div>
          </div>
        </div>

        <div className=" border border-[#E4E4E4] rounded-lg bg-white py-8 px-4 space-y-1.5">
          <div className="border-b-2 flex justify-between border-[#535353] pb-4">
            <div className="flex gap-4 items-center">
              <p className="bg-[#727272] px-1 h-6 text-center py-1 rounded-full text-xs">
                Rank#1
              </p>
              <p className="text-2xl font-bold">BlockChain Vote </p>
            </div>

            <p className="font-bold">8.7</p>
          </div>
          <div className="pl-5">
            <p className="text-xl font-[600] mb-5 ">Judge Scores</p>

            <div className="mb-2 flex items-center justify-between">
              <div className="flex justify-between w-[408px]">
                {" "}
                <p>Jane Doe</p> <p>9.4</p>
              </div>
              <div className="flex justify-between w-[565px]">
                {" "}
                <p className="-ms-10">Maria Rodriguez</p>{" "}
                <p className="ms-auto">8.5</p>
              </div>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex justify-between w-[408px]">
                {" "}
                <p>Alex Smith</p> <p>8.4</p>
              </div>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex justify-between w-[408px]">
                {" "}
                <p>Maria Rodriguez</p> <p>8.5</p>
              </div>
            </div>

            <div className="w-[627px] mt-3">
              <p className="text-2xl mb-1">Summary Comments</p>
              <p>
                Innovative solution with strong technical implementation. UI
                could use some polish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalDecision;
