const evaluations = [
  {
    section: "Innovation",
    description: "Originality and creativity of the solution",
    grade: 5,
  },
  {
    section: "Technical Complexity",
    description: "Implementation difficulty and technical sophistication",
    grade: 5,
  },
  {
    section: "User Experience",
    description: "Ease of use, intuitiveness, and design quality",
    grade: 5,
  },
  {
    section: "Impact",
    description: "Potential impact and practical applicability",
    grade: 5,
  },
  {
    section: "Presentation",
    description: "Quality of documentation and presentation",
    grade: 5,
  },
];

function Evaluation() {
  return (
    <div>
      <div>
        {evaluations.map((evaluation, index) => {
          return (
            <div key={index}>
              <div className="flex justify-between">
                <div className="text-[#212121]">
                  <p className="text-xl font-medium">{evaluation.section}</p>
                  <p className="text-sm mt-1.5">{evaluation.description}</p>
                </div>

                <p className="text-[#000000] font-bold">
                  {evaluation.grade}/10
                </p>
              </div>

              <div className="relative h-2 w-full my-4 bg-[#E8E9F1] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-[#605DEC] rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${evaluation.grade * 10}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="my-4">
          <p className="font-[400] mb-1">Comments</p>
          <textarea
            name=""
            cols={120}
            rows={50}
            placeholder="Add your comments and feedback here..."
            className="border h-40 w-full border-[#C5C6CC] rounded-lg p-2 focus:outline-none focus:border-[#C5C6CC] focus:ring-1 focus:ring-[#C5C6CC] text-[#8F9098] placeholder:text-[#C5C6CC] text-sm"
          ></textarea>
        </div>

        <div className="flex justify-between">
          <p className="border-1 font-[400] border-[#605DEC] text-[#605DEC] text-center p-2 w-40 rounded-sm cursor-pointer">
            Flag for Discussion
          </p>
          <p className="border-1 font-[400] border-[#605DEC] text-[#605DEC] text-center p-2 w-40 rounded-sm cursor-pointer">
            Discuss{" "}
          </p>
        </div>

        <div className="text-center bg-[#605DEC] mx-auto w-40 p-2 text-white rounded-sm">
          Save & Next
        </div>
      </div>
    </div>
  );
}

export default Evaluation;
