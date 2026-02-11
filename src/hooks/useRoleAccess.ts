import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useRoleAccessStore } from "@/store/useRoleAccessStore";

interface RoleAccess {
    canAccessJudges: boolean;
    canAccessOrganizer: boolean;
    canAccessDashboard: boolean;
    loading: boolean;
}

export const useRoleAccess = (): RoleAccess => {
    const token = useAuthStore((state) => state.token);
    const user = useUserStore((state) => state.user);

    // Read from cached store
    const { canAccessJudges, canAccessOrganizer, canAccessDashboard, loading, lastChecked, setAccess } = useRoleAccessStore();

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

            // If we have cached data and user hasn't changed, skip API calls
            if (lastChecked !== null) {
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
            const organizerUrl = `${baseUrl}/hackathon/organizer/hackathons/`;
            const participantUrl = `${baseUrl}/hackathon/my-registrations/`;

            const checks = await Promise.all([
                // Check judge access
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

        verifyAccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, token, user?.is_judge, user?.is_organizer, user?.is_participant]); // Re-run if roles change

    return { canAccessJudges, canAccessOrganizer, canAccessDashboard, loading };
};
