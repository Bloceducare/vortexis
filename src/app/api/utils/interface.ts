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
  