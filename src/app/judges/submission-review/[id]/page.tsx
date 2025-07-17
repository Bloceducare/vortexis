import Tabscontent from "@/components/Tabscontent";

export default function SubmissionReviewPage() {
  return (
    <div>
      <div>
        <h1 className="text-2xl mb-2 font-semibold text-[#605DEC]">
          Submission Review
        </h1>
        <p>Reviewing submissions</p>
      </div>

      <div className="bg-[#FFFFFF] my-5 shadow-md rounded-md border border-[#E4E4E4]">
        <div className="md:w-[1114px] px-3 py-8">
          <Tabscontent />
        </div>
      </div>
    </div>
  );
}
