"use client";

import { BookOpen } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import HtmlContent from "@/components/ui/HtMLContent";

interface Hackathon {
  id: number;
  title: string;
  evaluation_criteria?: string | null;
}

export default function EvaluationCriteriaPage() {
  const params = useParams();
  const hackathonId = params.id as string;
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        setLoading(true);
        setError(null);

        const bearerToken = localStorage.getItem("access_token");
        if (!bearerToken) {
          setError("No access token found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hackathon/${hackathonId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData?.message ||
              errorData?.detail ||
              `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        setHackathon(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching hackathon details";
        setError(errorMessage);
        console.error("Error fetching hackathon:", err);
      } finally {
        setLoading(false);
      }
    };

    if (hackathonId) {
      fetchHackathon();
    }
  }, [hackathonId]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#605DEC]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Evaluation Criteria
        </h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
          <p className="text-sm">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Evaluation Criteria
        </h1>
        <p className="text-gray-600 mt-4">No hackathon found.</p>
      </div>
    );
  }

  const hackathonName = hackathon.title || `Hackathon #${hackathonId}`;
  const evaluationCriteria = hackathon.evaluation_criteria || "";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Evaluation Criteria
      </h1>
      <p className="text-gray-600 mb-6">
        Evaluation guidelines for {hackathonName} submissions. Use these
        criteria to provide consistent and fair reviews.
      </p>

      {evaluationCriteria ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="size-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Evaluation Guidelines
            </h2>
          </div>
          <div className="prose max-w-none">
            <HtmlContent html={evaluationCriteria} />
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="text-sm">
            No evaluation criteria has been set for this hackathon yet.
          </p>
        </div>
      )}
    </div>
  );
}
