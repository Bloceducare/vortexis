export default interface Hackathon_details {
  title?: string | undefined;
  description?: string | undefined;
  venue?: string | undefined;
  details?: string | null;
  grand_prize?: number;
  prizes?: Prize[];
  submission_deadline?: string | undefined;
  start_date?: string | undefined;
  end_date?: string | undefined;
  visibility?: boolean;
  min_team_size?: number;
  max_team_size?: number;
  organization?: number | null;
  skills?: string[];
  judges?: string[];
  rules?: string[];
  banner_image?: File | null;
}
export interface Prize {
  name: string;
  amount: number;
}



export interface Judge {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name?: string;
  is_judge: boolean;
}


export interface ReactQueryState {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
}

export interface getHackathonIdProps {
  hackathon_id: string;
}


export interface Submission {
  id: number;
  project: string;
  team: string;
  hackathon: number;
  approved: boolean;
  reviews: string;
  created_at: string;
  updated_at: string;
}


export interface SubmissionProps extends ReactQueryState {
  submissions: Submission[];
}


