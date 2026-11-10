import { create } from "zustand";
import { persist } from "zustand/middleware";
import Hackathon_details from "@/app/api/utils/interface";

interface HackathonState extends Omit<Hackathon_details, "banner_image_file"> {
  banner_image_file: string | null;
  /** Local object URL used to preview the banner while it uploads (not persisted). */
  preview: string | null;
  /** True while the banner is being uploaded to Cloudinary (not persisted). */
  banner_uploading: boolean;

  setField: <K extends keyof HackathonState>(key: K, value: HackathonState[K]) => void;
  clearHackathon: () => void;
  getHackathonData: () => Partial<Hackathon_details>;

  hackathons: Hackathon_details[];
  setHackathons: (hackathons: Hackathon_details[]) => void;

  selectedHackathonId: string | null;
  setSelectedHackathonId: (id: string) => void;

  activeHackathon: Hackathon_details | null;
  setActiveHackathon: (hackathon: Hackathon_details) => void;
}

export const useHackathonStore = create<HackathonState>()(
  persist(
    (set, get) => ({
      // Hackathon fields
      title: "",
      description: "",
      venue: "",
      start_date: "",
      end_date: "",
      submission_deadline: "",
      grand_prize: 0,
      prizes: "",
      skills: [],
      judges: [],
      rules: "",
      visibility: true,
      evaluation_criteria: "",
      min_team_size: 1,
      max_team_size: 5,
      preview: null,
      banner_uploading: false,
      banner_image_file: null,
      participants_count: 0,
      banner_image: null,
      submissions_count: 0,

      // Actions
      setField: (key, value) => set((state) => ({ ...state, [key]: value })),

    activeHackathon: null,
      setActiveHackathon: (hackathon) => set({ activeHackathon: hackathon }),

      clearHackathon: () =>
        set({
          title: "",
          description: "",
          venue: "",
          start_date: "",
          end_date: "",
          submission_deadline: "",
          grand_prize: 0,
          prizes: "",
          skills: [],
          judges: [],
          rules: "",
          visibility: true,
          evaluation_criteria: "",
          min_team_size: 1,
          max_team_size: 5,
          preview: null,
          banner_uploading: false,
          banner_image: null,
          banner_image_file: null,
          participants_count: 0,
          submissions_count: 0,
        }),

      getHackathonData: () => {
        const {
          hackathons, selectedHackathonId, setField, clearHackathon, getHackathonData,
          setHackathons, setSelectedHackathonId, activeHackathon, setActiveHackathon,
          preview, banner_uploading,
          ...data
        } = get();
        return data;
      },

      hackathons: [],
      setHackathons: (hackathons) => set({ hackathons }),

      selectedHackathonId: null,
      setSelectedHackathonId: (id) => set({ selectedHackathonId: id }),
    }),
    {
      name: "hackathon-storage",
      partialize: (state) => {
        // Object URLs and the upload flag don't survive a reload; the uploaded
        // banner URL does, so the user doesn't silently lose their banner.
        const { preview, banner_uploading, ...persistable } = state;
        return persistable;
      },
    }
  )
);
