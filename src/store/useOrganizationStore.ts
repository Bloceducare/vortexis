import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Organization {
    id: number;
    name: string;
    description: string;
    website?: string;
    custom_url?: string;
    location?: string;
    tagline?: string;
    about?: string;
    logo_file?: string | null;
}

interface OrganizationState {
    organization: Organization | null;
    setOrganization: (org: Organization) => void;
    clearOrganization: () => void;
}


export const useOrganizationStore = create<OrganizationState>()(
    persist(
        (set) => ({
            organization: null,
            setOrganization: (org) => set({ organization: org }),
            clearOrganization: () => set({ organization: null }),
        }),
        {
            name: "organization-storage",
            storage: createJSONStorage(() => localStorage), 
        }
    )
);