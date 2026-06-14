import { Users, UserPlus } from "lucide-react";

export default function MembersPanel({ members, inviteEmail, setInviteEmail, onInvite }) {
  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    onInvite();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="pb-3 mb-4 border-b border-workspace-border/50 flex items-center gap-2">
        <Users className="h-4 w-4 text-workspace-accent" />
        <h3 className="text-xs uppercase tracking-wider font-bold text-workspace-textMuted">
          Cluster Access Allocation
        </h3>
      </div>

      <form onSubmit={handleInvite} className="flex flex-col gap-2 mb-4">
        <input
          type="email"
          placeholder="collaborator@syncstudio.io"
          className="ide-input text-xs w-full font-mono bg-workspace-bg"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <button type="submit" className="ide-button-secondary py-1.5 text-xs font-semibold w-full flex items-center justify-center gap-1">
          <UserPlus className="h-3.5 w-3.5" />
          Link Node Authority
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {members.map((m) => (
          <div key={m._id} className="flex items-center gap-2.5 p-2 bg-workspace-bg/40 border border-workspace-border rounded-lg">
            <div className="h-6 w-6 rounded bg-workspace-accent/10 border border-workspace-accent/20 flex items-center justify-center font-mono text-[10px] text-workspace-accent font-bold">
              {m.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-workspace-textActive truncate">
                {m.username}
              </span>
              <span className="text-[10px] text-workspace-textMuted font-mono truncate">
                {m.email}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}