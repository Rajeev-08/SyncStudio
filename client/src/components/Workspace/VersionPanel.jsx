import { GitBranch, FolderSync, Plus } from "lucide-react";

export default function VersionPanel({ versionName, setVersionName, onSaveVersion, versions, onRestore }) {
  const handleCommit = (e) => {
    e.preventDefault();
    if (!versionName.trim()) return;
    onSaveVersion();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="pb-3 mb-4 border-b border-workspace-border/50 flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-workspace-accent" />
        <h3 className="text-xs uppercase tracking-wider font-bold text-workspace-textMuted">
          Commit Version Ledger
        </h3>
      </div>

      <form onSubmit={handleCommit} className="flex flex-col gap-2 mb-5">
        <input
          type="text"
          placeholder="e.g., auth-complete-v1"
          className="ide-input text-xs w-full font-mono bg-workspace-bg"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
        />
        <button 
          type="submit" 
          className="ide-button-primary py-2 text-xs font-semibold w-full flex items-center justify-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Snapshot Filesystem
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {versions.length === 0 ? (
          <div className="text-[11px] text-workspace-textMuted text-center py-6 font-mono border border-dashed border-workspace-border/40 rounded-lg">
            No active recovery checkpoints verified
          </div>
        ) : (
          versions.map((v) => (
            <div key={v._id} className="p-3 bg-workspace-bg/50 border border-workspace-border rounded-lg flex flex-col gap-3 shadow-md hover:border-workspace-border/80 transition-colors">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-mono font-bold text-workspace-textActive truncate">
                  {v.versionName}
                </span>
                <span className="text-[10px] text-workspace-textMuted font-mono mt-1">
                  ID: {v._id.substring(0, 8)}
                </span>
              </div>
              <button
                onClick={() => onRestore(v._id)}
                className="w-full flex items-center justify-center gap-1 text-[10px] uppercase font-bold tracking-wider text-workspace-textActive bg-workspace-border hover:bg-workspace-accent hover:text-workspace-bg py-1.5 rounded transition-all"
              >
                <FolderSync className="h-3 w-3" />
                Rollback State
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}