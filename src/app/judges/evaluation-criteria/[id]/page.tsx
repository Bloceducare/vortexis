"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";
import { useParams } from "next/navigation";
import { useSubmissionReview } from "@/hooks/useSubmissionReview";

export default function EvaluationCriteriaPage() {
  const params = useParams();
  const hackathonId = params.id as string;

  // Fetch hackathon details to get the real name
  const { hackathonDetails } = useSubmissionReview(hackathonId);
  const hackathonName = hackathonDetails?.title || `Hackathon #${hackathonId}`;

  interface Criterion {
    id: string;
    name: string;
    description: string;
    maxScore: number;
    examples?: string[];
  }

  interface EvaluationCategory {
    id: string;
    name: string;
    criteria: Criterion[];
  }

  const evaluationCriteria: EvaluationCategory[] = [
    {
      id: "cat1",
      name: "Innovation & Creativity",
      criteria: [
        {
          id: "crit1.1",
          name: "Originality of Idea",
          description:
            "How unique and novel is the core concept? Does it offer a fresh perspective or solution?",
          maxScore: 10,
          examples: [
            "Highly original, addresses an unserved need.",
            "Builds on existing ideas but adds a unique twist.",
            "Common idea, but well-executed.",
          ],
        },
        {
          id: "crit1.2",
          name: "Creative Problem Solving",
          description:
            "How creatively does the solution address the problem? Are there innovative approaches to challenges?",
          maxScore: 10,
          examples: [
            "Elegant and unexpected solution.",
            "Clever use of technology or methodology.",
            "Standard approach, but effective.",
          ],
        },
      ],
    },
    {
      id: "cat2",
      name: "Technical Implementation",
      criteria: [
        {
          id: "crit2.1",
          name: "Functionality & Completeness",
          description:
            "Does the project work as intended? Are core features implemented and stable?",
          maxScore: 15,
          examples: [
            "Fully functional, robust, and complete.",
            "Most features work, minor bugs.",
            "Basic functionality, significant bugs or missing features.",
          ],
        },
        {
          id: "crit2.2",
          name: "Code Quality & Architecture",
          description:
            "Is the code clean, readable, and well-organized? Is the architecture sound and scalable?",
          maxScore: 10,
          examples: [
            "Excellent code, clear structure, well-documented.",
            "Good code, some areas could be improved.",
            "Messy code, poor structure, hard to understand.",
          ],
        },
        {
          id: "crit2.3",
          name: "Use of Technologies",
          description:
            "How effectively and appropriately were chosen technologies utilized?",
          maxScore: 5,
          examples: [
            "Masterful use of relevant technologies.",
            "Competent use of technologies.",
            "Technologies used inappropriately or inefficiently.",
          ],
        },
      ],
    },
    {
      id: "cat3",
      name: "Impact & Feasibility",
      criteria: [
        {
          id: "crit3.1",
          name: "Potential Impact",
          description:
            "What is the potential real-world impact of this solution? How many people could it help?",
          maxScore: 10,
          examples: [
            "High potential for significant positive impact.",
            "Moderate impact on a specific group.",
            "Limited or unclear impact.",
          ],
        },
        {
          id: "crit3.2",
          name: "Feasibility & Scalability",
          description:
            "How realistic is it to implement and scale this solution beyond the hackathon?",
          maxScore: 5,
          examples: [
            "Highly feasible, clear path to scalability.",
            "Feasible with some challenges.",
            "Significant hurdles to implementation or scaling.",
          ],
        },
      ],
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Evaluation Criteria
      </h1>
      <p className="text-gray-600 mb-6">
        Evaluation guidelines for {hackathonName} submissions. Use these
        criteria to provide consistent and fair reviews.
      </p>

      <div className="space-y-8">
        {evaluationCriteria.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="size-6 text-blue-600" />
              {category.name}
            </h2>
            <div className="space-y-6">
              {category.criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                >
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    {criterion.name}{" "}
                    <span className="text-sm text-gray-500">
                      (Max Score: {criterion.maxScore})
                    </span>
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {criterion.description}
                  </p>
                  {criterion.examples && criterion.examples.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Examples:
                      </p>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                        {criterion.examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
