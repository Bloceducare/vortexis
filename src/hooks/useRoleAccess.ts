import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

interface RoleAccess {
    canAccessJudges: boolean;
    canAccessOrganizer: boolean;
    canAccessDashboard: boolean;
    loading: boolean;
}

export const useRoleAccess = (): RoleAccess => {
    const token = useAuthStore((state) => state.token);
    const user = useUserStore((state) => state.user);
    const [access, setAccess] = useState<RoleAccess>({
        canAccessJudges: false,
        canAccessOrganizer: false,
        canAccessDashboard: false,
        loading: true,
    });

    useEffect(() => {
        const verifyAccess = async () => {
            if (!user || !token) {
                setAccess({
                    canAccessJudges: false,
                    canAccessOrganizer: false,
                    canAccessDashboard: false,
                    loading: false,
                });
                return;
            }

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://spicy-cheri-web3bridge-bc3db9dc.koyeb.app/api/v1"

            // If user has no roles, skip API checks entirely
            if (!user.is_judge && !user.is_organizer && !user.is_participant) {
                setAccess({
                    canAccessJudges: false,
                    canAccessOrganizer: false,
                    canAccessDashboard: false,
                    loading: false,
                });
                return;
            }

            // Check each role by attempting to access their respective endpoints
            const judgeUrl = `${baseUrl}/hackathon/judge/hackathons/`;
            const organizerUrl = `${baseUrl}/organizers/hackathons/`;
            const participantUrl = `${baseUrl}/participants/hackathons/`;

            const checks = await Promise.all([
                // Check judge access - use singular "judge" to match backend
                user.is_judge
                    ? fetch(judgeUrl, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.ok).catch(() => false)
                    : Promise.resolve(false),

                // Check organizer access
                user.is_organizer
                    ? fetch(organizerUrl, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.ok).catch(() => false)
                    : Promise.resolve(false),

                // Check participant access
                user.is_participant
                    ? fetch(participantUrl, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.ok).catch(() => false)
                    : Promise.resolve(false),
            ]);

            setAccess({
                canAccessJudges: checks[0],
                canAccessOrganizer: checks[1],
                canAccessDashboard: checks[2],
                loading: false,
            });
        };

        // Only run verification once when user or token changes
        verifyAccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, token]); // Only re-run if user ID or token changes

    return access;
};
