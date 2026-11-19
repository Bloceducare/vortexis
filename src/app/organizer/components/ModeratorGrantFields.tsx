"use client";

import {
  DEFAULT_GRANT,
  PERMISSION_CATALOG,
  type ModeratorGrant,
} from "@/lib/moderatorAccess";

interface HackathonOption {
  id: number;
  title: string;
}

interface ModeratorGrantFieldsProps {
  value: ModeratorGrant;
  onChange: (next: ModeratorGrant) => void;
  hackathons?: HackathonOption[];
  hackathonsLoading?: boolean;
}

function ModeratorGrantFields({
  value,
  onChange,
  hackathons = [],
  hackathonsLoading = false,
}: ModeratorGrantFieldsProps) {
  const togglePermission = (key: string) => {
    const has = value.permissions.includes(key);
    onChange({
      ...value,
      permissions: has
        ? value.permissions.filter((item) => item !== key)
        : [...value.permissions, key],
    });
  };

  const toggleHackathon = (id: number) => {
    const has = value.hackathon_ids.includes(id);
    onChange({
      ...value,
      hackathon_ids: has
        ? value.hackathon_ids.filter((item) => item !== id)
        : [...value.hackathon_ids, id],
    });
  };

  const groups = [
    { key: "organization" as const, title: "Organization" },
    { key: "hackathon" as const, title: "Hackathons in scope" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Where they can work</p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...value, hackathon_scope: "all", hackathon_ids: [] })}
            className={`text-left p-3 rounded-xl border-2 transition cursor-pointer ${
              value.hackathon_scope === "all"
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-white">All hackathons</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Includes hackathons created later.
            </p>
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...value, hackathon_scope: "selected" })}
            className={`text-left p-3 rounded-xl border-2 transition cursor-pointer ${
              value.hackathon_scope === "selected"
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Selected hackathons</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Only the events you check below.
            </p>
          </button>
        </div>
      </div>

      {value.hackathon_scope === "selected" && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2">
          {hackathonsLoading ? (
            <p className="text-xs text-gray-500">Loading hackathons...</p>
          ) : hackathons.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This organization has no hackathons yet. Choose all hackathons, or grant organization permissions only.
            </p>
          ) : (
            hackathons.map((hackathon) => (
              <label key={hackathon.id} className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.hackathon_ids.includes(Number(hackathon.id))}
                  onChange={() => toggleHackathon(Number(hackathon.id))}
                  className="accent-indigo-600"
                />
                <span className="truncate">{hackathon.title}</span>
              </label>
            ))
          )}
        </div>
      )}

      {groups.map((group) => (
        <div key={group.key}>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{group.title}</p>
          <div className="mt-2 space-y-2">
            {PERMISSION_CATALOG.filter((item) => item.group === group.key).map((item) => (
              <label
                key={item.key}
                className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.permissions.includes(item.key)}
                  onChange={() => togglePermission(item.key)}
                  className="mt-0.5 accent-indigo-600"
                />
                <span>
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Managing moderators and deleting the organization stay with you. A new invite starts with{" "}
        {DEFAULT_GRANT.permissions.length} limited permissions until you change them.
      </p>
    </div>
  );
}

export default ModeratorGrantFields;
