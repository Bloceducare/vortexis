export type ModeratorScope = "all" | "selected";

export interface PermissionDefinition {
  key: string;
  group: "organization" | "hackathon";
  label: string;
  description: string;
}

export interface ModeratorGrant {
  permissions: string[];
  hackathon_scope: ModeratorScope;
  hackathon_ids: number[];
}

export interface MyAccess {
  role: "owner" | "moderator";
  hackathon_scope: ModeratorScope;
  hackathon_ids: number[];
  permissions: string[];
  legacy?: boolean;
}

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  {
    key: "edit_organization",
    group: "organization",
    label: "Edit organization",
    description: "Update the organization profile, logo, and links.",
  },
  {
    key: "create_hackathon",
    group: "organization",
    label: "Create hackathons",
    description: "Create new hackathons under this organization.",
  },
  {
    key: "edit_hackathon",
    group: "hackathon",
    label: "Edit hackathons",
    description: "Change details, schedule, rules, and prizes.",
  },
  {
    key: "delete_hackathon",
    group: "hackathon",
    label: "Delete hackathons",
    description: "Delete hackathons inside the granted scope.",
  },
  {
    key: "manage_participants",
    group: "hackathon",
    label: "Participants",
    description: "Open and work with the participant list.",
  },
  {
    key: "manage_submissions",
    group: "hackathon",
    label: "Submissions",
    description: "Review, approve, and reject submissions.",
  },
  {
    key: "manage_judges",
    group: "hackathon",
    label: "Judges",
    description: "Invite and manage judges.",
  },
  {
    key: "release_results",
    group: "hackathon",
    label: "Release results",
    description: "Preview unpublished results and publish the leaderboard.",
  },
];

export const DEFAULT_GRANT: ModeratorGrant = {
  permissions: ["manage_participants", "manage_submissions"],
  hackathon_scope: "all",
  hackathon_ids: [],
};

const LABELS = Object.fromEntries(PERMISSION_CATALOG.map((item) => [item.key, item.label]));

export function permissionLabel(key: string) {
  return LABELS[key] || key;
}

export function summarizeGrant(grant?: Partial<ModeratorGrant> | null) {
  if (!grant) return "Limited access";
  const scope =
    grant.hackathon_scope === "selected"
      ? `${grant.hackathon_ids?.length || 0} hackathon${grant.hackathon_ids?.length === 1 ? "" : "s"}`
      : "All hackathons";
  const names = (grant.permissions || []).map(permissionLabel);
  return names.length ? `${scope} · ${names.join(", ")}` : scope;
}

export function isOrgOwner(org: { my_access?: MyAccess | null; user_role?: string | null } | null | undefined) {
  if (org?.my_access?.role) return org.my_access.role === "owner";
  return org?.user_role !== "moderator";
}

export function orgAllows(
  org: { my_access?: MyAccess | null; user_role?: string | null } | null | undefined,
  permission: string
) {
  if (isOrgOwner(org)) return true;
  return Boolean(org?.my_access?.permissions?.includes(permission));
}

export function canSeeManagedHackathon(
  org: { my_access?: MyAccess | null; user_role?: string | null } | null | undefined,
  hackathonId: number | string
) {
  const access = org?.my_access;
  if (!access || access.role === "owner" || access.legacy) return true;
  const hasHackathonPermission = PERMISSION_CATALOG.some(
    (item) => item.group === "hackathon" && access.permissions?.includes(item.key)
  );
  if (!hasHackathonPermission) return false;
  if (access.hackathon_scope === "selected") {
    return (access.hackathon_ids || []).some((id) => Number(id) === Number(hackathonId));
  }
  return true;
}

export function permissionsOnHackathon(
  active: { id?: string | number; my_permissions?: string[] } | null | undefined,
  list?: { id?: string | number; my_permissions?: string[] }[] | null
) {
  const match = list?.find((item) => item?.id != null && String(item.id) === String(active?.id));
  const permissions = match?.my_permissions ?? active?.my_permissions;
  return Array.isArray(permissions) ? permissions : null;
}

export function allows(permissions: string[] | null, key: string) {
  if (permissions === null) return true;
  return permissions.includes(key);
}
