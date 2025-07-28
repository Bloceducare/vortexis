export default interface Hackathon_details {
  id?: string;
  title?: string | undefined;
  description?: string | undefined;
  venue?: string | undefined;
  details?: string | null;
  status?: "upcoming" | "just-created" | "active" | "finished";
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
  participants?: string[];
  submissions?: string[];
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


 export const mockHackathons: Hackathon_details[] = [
  {
    id: '1',
    title: 'AI Innovation Sprint',
    description: 'A 3-day hackathon focused on building AI-powered tools.',
    venue: 'Lagos Tech Hub',
    details: 'Teams will build tools using open-source AI APIs.',
    grand_prize: 1000000,
    prizes: [
      { name: 'First Place', amount: 1000000 },
      { name: 'Second Place', amount: 500000 },
    ],
    submission_deadline: '2025-07-28',
    start_date: '2025-07-25',
    end_date: '2025-07-27',
    visibility: true,
    min_team_size: 2,
    max_team_size: 5,
    organization: 101,
    skills: ['AI', 'React', 'Python'],
    judges: ['ai.judge1@example.com', 'ai.judge2@example.com'],
    rules: ['No plagiarism', 'Code must be original'],
    participants: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi"
    ],
    submissions: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi"
    ],
    banner_image: null,
  },
  {
    id: '2',
    title: 'GreenTech Hackathon',
    description: 'Build solutions for environmental sustainability.',
    venue: 'Abuja Innovation Center',
    details: 'Focus on renewable energy, recycling, and carbon tracking.',
    grand_prize: 750000,
    prizes: [{ name: 'Top Project', amount: 750000 }],
    submission_deadline: '2025-08-15',
    start_date: '2025-08-12',
    end_date: '2025-08-14',
    visibility: true,
    min_team_size: 3,
    max_team_size: 6,
    organization: 102,
    skills: ['IoT', 'Sustainability', 'Node.js'],
    judges: ['green.judge@example.com'],
    rules: ['Must include a pitch deck'],
    participants: [],
    submissions: [],

    banner_image: null,
  },
  {
    id: '3',
    title: 'FinTech BuildFest',
    description: 'Develop cutting-edge fintech applications.',
    venue: 'Online',
    details: 'Participants work remotely to build apps for finance.',
    grand_prize: 1200000,
    prizes: [
      { name: 'Winner', amount: 1200000 },
      { name: 'Runner Up', amount: 600000 },
    ],
    submission_deadline: '2025-09-01',
    start_date: '2025-08-29',
    end_date: '2025-08-31',
    visibility: false,
    min_team_size: 1,
    max_team_size: 4,
    organization: 103,
    skills: ['FinTech', 'API Integration', 'React Native'],
    judges: ['fin.judge1@example.com', 'fin.judge2@example.com'],
    rules: ['Follow all banking regulations'],
    participants: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi"
    ],
    submissions: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi"
    ],
    banner_image: null,
  },
  {
    id: '4',
    title: 'EduTech Jam',
    description: 'Reimagine learning with tech-based educational tools.',
    venue: 'University of Ibadan',
    details: 'Build learning platforms, quiz engines, or educational games.',
    grand_prize: 500000,
    prizes: [{ name: 'Best Use of Tech', amount: 500000 }],
    submission_deadline: '2025-08-20',
    start_date: '2025-08-17',
    end_date: '2025-08-19',
    visibility: true,
    min_team_size: 2,
    max_team_size: 4,
    organization: 104,
    skills: ['React', 'Firebase', 'UX Design'],
    judges: ['edu.judge@example.com'],
    rules: ['Include accessibility features'],
    participants: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi",
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi"
    ],
    submissions: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi",
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi"
    ],
    banner_image: null,
  },
  {
    id: '5',
    title: 'Blockchain Builders Camp',
    description: 'Create decentralized apps and smart contracts.',
    venue: 'Tech Park, Enugu',
    details: 'Focus on real-world blockchain use cases.',
    grand_prize: 1500000,
    prizes: [
      { name: 'Gold', amount: 1500000 },
      { name: 'Silver', amount: 700000 },
    ],
    submission_deadline: '2025-10-10',
    start_date: '2025-10-07',
    end_date: '2025-10-09',
    visibility: true,
    min_team_size: 2,
    max_team_size: 5,
    organization: 105,
    skills: ['Solidity', 'Web3.js', 'Smart Contracts'],
    judges: ['block.judge@example.com'],
    rules: ['Must be deployed on testnet'],
    participants: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", 
    ],
    submissions: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell", "john",  "Amiola", "Superman", "Gbemi", "Amiola", "Maxwell", "john", "Amiola", 
    ],
    banner_image: null,
  },
  {
    id: '6',
    title: 'HealthHack',
    description: 'Build tech solutions to healthcare challenges.',
    venue: 'Ikeja Medical Research Center',
    details: 'Ideas may include patient tracking, telemedicine, or AI diagnosis.',
    grand_prize: 850000,
    prizes: [{ name: 'Best Health App', amount: 850000 }],
    submission_deadline: '2025-09-15',
    start_date: '2025-09-12',
    end_date: '2025-09-14',
    visibility: true,
    min_team_size: 3,
    max_team_size: 6,
    organization: 106,
    skills: ['Flutter', 'AI', 'HealthTech'],
    judges: ['health.judge@example.com'],
    rules: ['Data must be anonymized'],
    participants: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell"
    ],
    submissions: [
      "Amiola", "Maxwell", "john", "Amiola", "Maxwell"
    ],
    banner_image: null,
  },
];
