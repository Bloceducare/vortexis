import api from "@/lib/api";

export interface LeaderboardItem {
  rank: number;
  submission_id: number;
  project: {
    id: number;
    title: string;
    description: string;
    live_link?: string;
    github_url?: string;
    demo_video_url?: string;
    presentation_link?: string;
    video_url?: string;
    presentation_url?: string;
    deliverables?: {
      github_url?: string;
      live_link?: string;
      demo_video_url?: string;
      presentation_link?: string;
      video_url?: string;
      presentation_url?: string;
    };
  };
  team: {
    id: number;
    name: string;
  };
  review_count: number;
  average_overall_score: number;
  score_breakdown?: {
    average_innovation?: number;
    average_technical?: number;
    average_user_experience?: number;
    average_impact?: number;
    average_presentation?: number;
  };
}

export interface LeaderboardResponse {
  hackathon?: {
    id: number;
    title: string;
  };
  results_released?: boolean;
  results_released_at?: string | null;
  message?: string;
  is_organizer_preview?: boolean;
  total_submissions?: number;
  leaderboard: LeaderboardItem[];
}

export interface ReleaseStatusResponse {
  hackathon_id: number;
  title: string;
  results_released: boolean;
  results_released_at: string | null;
  can_release: boolean;
}

export interface ToggleResultsResponse {
  message: string;
  hackathon: {
    id: number;
    title: string;
  };
  results_released: boolean;
  results_released_at: string | null;
}

export interface LiveReviewItem {
  id: number;
  submission_id: number;
  project: {
    id: number;
    title: string;
    github_url?: string;
    live_link?: string;
    demo_video_url?: string;
    presentation_link?: string;
    video_url?: string;
    presentation_url?: string;
    deliverables?: {
      github_url?: string;
      live_link?: string;
      demo_video_url?: string;
      presentation_link?: string;
      video_url?: string;
      presentation_url?: string;
    };
  };
  team: {
    id: number;
    name: string;
  };
  judge: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
  overall_score: number;
  innovation_score?: number;
  technical_score?: number;
  user_experience_score?: number;
  impact_score?: number;
  presentation_score?: number;
  review: string;
  created_at: string;
}

export interface ReviewPayload {
  submission: number;
  innovation_score: number;
  technical_score: number;
  user_experience_score: number;
  impact_score: number;
  presentation_score: number;
  overall_score?: number;
  review?: string;
}

// 9. Judge review endpoints per backend specs
export async function submitJudgeReview(
  hackathonId: number | string,
  data: ReviewPayload
) {
  const res = await api.post(`/hackathon/${hackathonId}/reviews/`, data);
  return res.data;
}

export async function updateJudgeReview(
  hackathonId: number | string,
  reviewId: number | string,
  data: Partial<ReviewPayload>
) {
  let res;
  try {
    res = await api.patch(`/hackathon/${hackathonId}/reviews/${reviewId}/`, data);
  } catch (err: any) {
    if (err?.response?.status === 405) {
      res = await api.put(`/hackathon/${hackathonId}/reviews/${reviewId}/`, data);
    } else {
      throw err;
    }
  }
  return res.data;
}

export async function getJudgeReviews(
  hackathonId: number | string,
  submissionId?: number | string
) {
  const params: Record<string, any> = {};
  if (submissionId) params.submission = submissionId;
  const res = await api.get(`/hackathon/${hackathonId}/reviews/`, { params });
  return res.data;
}

export interface LiveReviewsResponse {
  hackathon?: {
    id: number;
    title: string;
  };
  total_reviews?: number;
  reviews: LiveReviewItem[];
}

// 1. Approve a submission
export async function approveSubmission(
  hackathonId: number | string,
  submissionId: number | string
) {
  const res = await api.post(
    `/hackathon/${hackathonId}/submissions/${submissionId}/approve/`
  );
  return res.data;
}

// 2. Reject a submission
export async function rejectSubmission(
  hackathonId: number | string,
  submissionId: number | string,
  reason?: string
) {
  const res = await api.post(
    `/hackathon/${hackathonId}/submissions/${submissionId}/reject/`,
    reason ? { reason } : {}
  );
  return res.data;
}

// 3. Fetch Leaderboard
export async function getLeaderboard(
  hackathonId: number | string,
  approvedOnly = true
): Promise<LeaderboardResponse> {
  const res = await api.get(`/hackathon/${hackathonId}/leaderboard/`, {
    params: { approved_only: approvedOnly },
  });
  return res.data;
}

// 4. Fetch Live Reviews Feed
export async function getLiveReviews(
  hackathonId: number | string
): Promise<LiveReviewsResponse> {
  const res = await api.get(`/hackathon/${hackathonId}/live-reviews/`);
  return res.data;
}

// 5. Fetch Approved Submissions
export async function getApprovedSubmissions(hackathonId: number | string) {
  const res = await api.get(`/hackathon/${hackathonId}/approved-submissions/`);
  return res.data;
}

// 6. Fetch All Submissions with optional approval status filter
export async function getAllSubmissions(
  hackathonId: number | string,
  approved?: boolean
) {
  const params: Record<string, any> = {};
  if (typeof approved === "boolean") {
    params.approved = approved;
  }
  const res = await api.get(`/hackathon/${hackathonId}/submissions/`, { params });
  return res.data;
}

// 7. Toggle or set results release
export async function toggleHackathonResults(
  hackathonId: number | string,
  release: boolean = true
): Promise<ToggleResultsResponse> {
  const res = await api.post(`/hackathon/${hackathonId}/release-results/`, { release });
  return res.data;
}

// 8. Check if user is organizer and if results are released
export async function getReleaseStatus(
  hackathonId: number | string
): Promise<ReleaseStatusResponse> {
  const res = await api.get(`/hackathon/${hackathonId}/release-results/`);
  return res.data;
}

