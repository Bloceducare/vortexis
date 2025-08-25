import { useState } from "react";

interface EvaluationItem {
  section: string;
  description: string;
  grade: number;
}

const initialEvaluations: EvaluationItem[] = [
  {
    section: "Innovation",
    description: "Originality and creativity of the solution",
    grade: 0,
  },
  {
    section: "Technical Complexity",
    description: "Implementation difficulty and technical sophistication",
    grade: 0,
  },
  {
    section: "User Experience",
    description: "Ease of use, intuitiveness, and design quality",
    grade: 0,
  },
  {
    section: "Impact",
    description: "Potential impact and practical applicability",
    grade: 0,
  },
  {
    section: "Presentation",
    description: "Quality of documentation and presentation",
    grade: 0,
  },
];

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  onChange,
  label,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="relative my-4">
      <div className="relative h-2 w-full bg-[#E8E9F1] rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#605DEC] rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${value * 10}%` }}
        />

        <div
          className={`absolute top-1/2 w-4 h-4 bg-white border-2 border-[#605DEC] rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 cursor-pointer transition-all duration-200 ${
            isDragging ? "scale-125 shadow-lg" : "hover:scale-110"
          }`}
          style={{ left: `${value * 10}%` }}
        />
      </div>

      {/* Hidden range input */}
      <input
        type="range"
        min="0"
        max="10"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer"
        aria-label={label}
      />

      {/* Grade markers */}
      <div className="flex justify-between text-xs text-gray-400 mt-3">
        {[0, 2.5, 5, 7.5, 10].map((mark) => (
          <div key={mark} className="flex flex-col items-center">
            <div className="w-px h-2 bg-gray-300 mb-1" />
            <span>{mark}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function Evaluation() {
  const [evaluations, setEvaluations] =
    useState<EvaluationItem[]>(initialEvaluations);
  const [comments, setComments] = useState("");

  const handleGradeChange = (index: number, newGrade: number) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations[index].grade = newGrade;
    setEvaluations(updatedEvaluations);
  };

  const getTotalScore = () => {
    return evaluations.reduce(
      (total, evaluation) => total + evaluation.grade,
      0
    );
  };

  const getAverageScore = () => {
    return (getTotalScore() / evaluations.length).toFixed(1);
  };

  const handleSaveAndNext = () => {
    // Handle save logic here
    console.log("Evaluations:", evaluations);
    console.log("Comments:", comments);
    console.log("Total Score:", getTotalScore());
    console.log("Average Score:", getAverageScore());
  };

  const handleFlagForDiscussion = () => {
    // Handle flag for discussion logic
    console.log("Flagged for discussion");
  };

  const handleDiscuss = () => {
    // Handle discuss logic
    console.log("Opening discussion");
  };

  return (
    <div className="flex md:items-stretch">
      <div className="space-y-6 w-full">
        {/* Score Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Evaluation Summary
              </h3>
              <p className="text-sm text-gray-600">Overall assessment score</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#605DEC]">
                {getTotalScore()}/50
              </div>
              <div className="text-sm text-gray-600">
                Average: {getAverageScore()}/10
              </div>
            </div>
          </div>
        </div>

        {evaluations.map((evaluation, index) => {
          return (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-[#212121] flex-1">
                  <p className="text-xl font-medium">{evaluation.section}</p>
                  <p className="text-sm mt-1.5 text-gray-600">
                    {evaluation.description}
                  </p>
                </div>

                <div className="text-right ml-4">
                  <p className="text-[#000000] font-bold text-lg">
                    {evaluation.grade}/10
                  </p>
                  <p className="text-xs text-gray-500">
                    {evaluation.grade >= 8
                      ? "Excellent"
                      : evaluation.grade >= 6
                      ? "Good"
                      : evaluation.grade >= 4
                      ? "Fair"
                      : "Needs Improvement"}
                  </p>
                </div>
              </div>

              <CustomSlider
                value={evaluation.grade}
                onChange={(newGrade) => handleGradeChange(index, newGrade)}
                label={`Grade for ${evaluation.section}`}
              />
            </div>
          );
        })}

        <div className="my-6">
          <label className="block font-medium mb-2 text-gray-700">
            Comments and Feedback
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your detailed comments and feedback here..."
            className="border h-40 w-full border-[#C5C6CC] rounded-lg p-3 focus:outline-none focus:border-[#605DEC] focus:ring-2 focus:ring-[#605DEC]/20 text-gray-700 placeholder:text-[#C5C6CC] text-sm resize-none transition-all duration-200"
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {comments.length} characters
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <button
            onClick={handleFlagForDiscussion}
            className="border border-[#605DEC] text-[#605DEC] text-center py-2 px-4 text-sm rounded-md cursor-pointer hover:bg-[#605DEC] hover:text-white transition-all duration-200 font-medium"
          >
            🚩 Flag for Discussion
          </button>
          <button
            onClick={handleDiscuss}
            className="border border-[#605DEC] text-[#605DEC] text-center py-2 px-4 text-sm rounded-md cursor-pointer hover:bg-[#605DEC] hover:text-white transition-all duration-200 font-medium"
          >
            💬 Discuss
          </button>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleSaveAndNext}
            className="bg-[#605DEC] px-8 py-3 text-white rounded-md hover:bg-[#504ad1] transition-all duration-200 cursor-pointer font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Save & Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Evaluation;
