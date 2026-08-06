import type { UserProfile, Community } from "@/services/networking";
import ConnectionCard from "./ConnectionCard";
import CommunityCard from "./CommunityCard";

interface SearchResultsProps {
  users: UserProfile[];
  groups: Community[];
}

export default function SearchResults({ users, groups }: SearchResultsProps) {
  if (users.length === 0 && groups.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-slate-500 italic">
        No connections or community groups match your query.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Users match */}
      {users.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Matching Professionals</h3>
          <div className="space-y-3">
            {users.map((u) => (
              <ConnectionCard
                key={u.id}
                id={u.id}
                name={u.name}
                role={u.role}
                avatar={u.avatar}
                followed={u.followed}
              />
            ))}
          </div>
        </div>
      )}

      {/* Groups match */}
      {groups.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Matching Communities</h3>
          <div className="space-y-3">
            {groups.map((g) => (
              <CommunityCard
                key={g.id}
                id={g.id}
                name={g.name}
                description={g.description}
                membersCount={g.membersCount}
                joined={g.joined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
