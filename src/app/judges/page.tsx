import Link from "next/link";

interface SubmissionStatusItem {
  number: number;
  status: string;
}

interface HackathonJudged {
  name: string;
  status: string;
  total_submission: string;
  due_date: string;
  reviews_completed: string;
}

const SubmissionStatus: SubmissionStatusItem[] = [
  { number: 12, status: "submission pending" },
  { number: 12, status: "submission pending" },
  { number: 12, status: "submission pending" },
];

const hackathonsJudged: HackathonJudged[] = [
  {
    name: "Judge Jane",
    status: "active",
    total_submission: "12",
    due_date: "5/15/2025",
    reviews_completed: "5/12",
  },
  {
    name: "Judge Jane",
    status: "active",
    total_submission: "12",
    due_date: "5/15/2025",
    reviews_completed: "5/12",
  },
  {
    name: "Judge Jane",
    status: "active",
    total_submission: "12",
    due_date: "5/15/2025",
    reviews_completed: "5/12",
  },
];

function Page() {
  return (
    <div className="">
      <div>
        <h1 className="font-bold text-2xl text-[#605DEC]">
          Welcome, Judge Sharon!
        </h1>
        <p className="text-sm mt-4">
          Your judging dashboard provides an overview of your assigned
          hackathons and pending reviews.
        </p>

        <div className="flex flex-wrap gap-4 mt-5">
          {SubmissionStatus.map((status, i) => {
            return (
              <div
                key={i}
                className="w-60 my-5 bg-[#FFFFFF] h-40 flex flex-col border border-[#E4E4E4] justify-center pl-8 rounded-lg shadow-md"
              >
                <div>
                  <p className="text-[#00AC4F] font-bold">{status.number}</p>
                  <p className="text-[#605DEC] font-semibold">
                    {status.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-full my-5 p-2 bg-white rounded-lg shadow-sm">
          <p className="font-semibold text-xl mb-3">Review Progress</p>

          <p className="flex justify-between mb-5">
            <span className="text-sm">8 of 20 reviews completed</span>
            <span className="text-sm">40%</span>
          </p>
          <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#605DEC] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `40%` }}
            />
          </div>
        </div>

        {/* Hackathons judged */}
        <div>
          <h2 className="text-[#00AC4F] text-xl font-semibold">
            Hackathons You're Judging
          </h2>
          <div className="flex flex-col gap-6 py-4">
            {hackathonsJudged.map((judge, i) => {
              return (
                <div
                  key={i}
                  className="shadow-md border border-[#E4E4E4] rounded-lg bg-white py-8 px-4 space-y-1.5"
                >
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold">
                      Welcome,{judge.name}!{" "}
                    </h2>
                    <Link href={`/judges/submission-review/${i}`}>
                      <p className="bg-[#605DEC] text-sm cursor-pointer rounded-md text-center px-2 py-1 text-white">
                        Review submission
                      </p>
                    </Link>
                  </div>
                  <p className="bg-[#164E04] pb-0.5 rounded-full text-white w-15 h-5 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full mt-0.5 inline-block"></span>
                    <span className="text-xs">{judge.status}</span>
                  </p>

                  <p>
                    Total submission:{" "}
                    <span className="text-[#605DEC]">
                      {judge.total_submission}
                    </span>
                  </p>
                  <p>
                    Due date:{" "}
                    <span className="text-[#AC0000]">{judge.due_date}</span>
                  </p>
                  <p>
                    Reviews completed{" "}
                    <span className="text-[#00AC4F]">
                      {judge.reviews_completed}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
