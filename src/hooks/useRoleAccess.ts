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
            console.log("[RoleCheck DEBUG] verifyAccess starting...", { user: !!user, token: !!token, lastChecked });
            if (!user || !token) {
                console.log("[RoleCheck DEBUG] No user or token, aborting.");
                useRoleAccessStore.setState({
                    canAccessJudges: false,
                    canAccessOrganizer: false,
                    canAccessDashboard: false,
                    loading: false,
                    lastChecked: null // leave cache untouched
                });
                return;
            }

            // If we have cached data and user hasn't changed, skip API calls
            if (lastChecked !== null) {
                // console.log("[RoleCheck DEBUG] Using cached data. lastChecked:", new Date(lastChecked).toISOString());
                return;
            }

            // console.log("[RoleCheck DEBUG] Making API calls...");
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://spicy-cheri-web3bridge-bc3db9dc.koyeb.app/api/v1"

            // Check each role by attempting to access their respective endpoints
            const judgeUrl = `${baseUrl}/hackathon/judge/hackathons/`;
            const organizerUrl = `${baseUrl}/hackathon/organizer/hackathons/`;
            const participantUrl = `${baseUrl}/hackathon/my-registrations/`;

            const checks = await Promise.all([
                // Check judge access directly from backend, bypassing any local cache sync issues
                fetch(judgeUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then(async (res) => {
                    const text = await res.text().catch(() => "");
                    // console.log("[RoleCheck DEBUG] Judge API Status:", res.status, text);
                    return res.ok;
                }).catch((e) => {
                    // console.error("[RoleCheck DEBUG] Judge API Error:", e);
                    return false;
                }),

                // Check organizer access
                fetch(organizerUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then((res) => res.ok).catch(() => false),

                // Check participant access
                fetch(participantUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then((res) => res.ok).catch(() => false),
            ]);

            // Sync backend truth with the local user store if we discovered a role discrepancy
            if (checks[0] && !user.is_judge) {
                useUserStore.getState().setUser({ ...user, is_judge: true });
            }
            if (checks[1] && !user.is_organizer) {
                useUserStore.getState().setUser({ ...user, is_organizer: true });
            }
            if (checks[2] && !user.is_participant) {
                useUserStore.getState().setUser({ ...user, is_participant: true });
            }

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
