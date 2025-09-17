export default interface Hackathon_details {
  id?: string;
  title?: string | undefined;
  description?: string | undefined;
  venue?: string | undefined;
  details?: string | null;
  status?: "upcoming" | "just-created" | "active" | "finished";
  grand_prize?: number;
  prizes?: string[];
  submission_deadline?: string | undefined;
  start_date?: string | undefined;
  end_date?: string | undefined;
  visibility?: boolean;
  min_team_size?: number;
  max_team_size?: number;
  organization?: number | null;
  skills?: number[];
  judges?: string[];
  rules?: string[];
  participants?: string[];
  submissions?: string[];
  banner_image?: File | null;
}
// export interface Prize {
//   name: string;
//   amount: number;
// }



export interface Skills {
  id: number;
  name: string;
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

export interface Project {
  id: number;
  title: string;
  description: string;
  github_url: string;
  live_link: string;
}

export interface Team {
  id?: number;
  name: string;
}

export interface Review {
  // Add fields here when you know what reviews contain
}

export interface HackathonSubmission {
  id: number;
  project: Project;
  team: Team;
  hackathon: number;
  approved: boolean;
  status: "pending" | "approved" | "rejected" | "reviewed"; 
  reviews: Review[];
  created_at: string;  
  updated_at: string;
}


export interface Submission {
  id: number;
  project: string;
  team: string;
  hackathon: number;
  approved: boolean;
  status: string;
  reviews: string;
  created_at: string;
  updated_at: string;
}

export interface SubmissionProps extends ReactQueryState {
  submissions: HackathonSubmission[];
}

export interface UserProfile {
  bio: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
  location: string | null;
  profile_picture: string;
  skills: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
  is_participant: boolean;
  is_organizer: boolean;
  is_judge: boolean;
  is_moderator: boolean;
  is_admin: boolean;
  is_verified: boolean;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string;
}


export interface Team {
  id?: number;
  name: string;
  members: string[];
  hackathon_id: string;
}
  

export interface UserTeam {
  id: number ;
  name: string;
  organizer: {
    id: number;
    username: string;
  };
  members: {
    id: number;
    username: string;
  }[];
  hackathons: {
    id: number;
    title: string;
  }[];
  projects: any[];
  submissions: any[];
  prizes: any[];
  created_at: string;
  updated_at: string;
}


export interface userProject {
     id?: string;
    title: string
    description: string
    github_url: string
    live_link: string;
    demo_video_url: string;
    presentation_link: string;
    team: number;
    hackathon: string
}