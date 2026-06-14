export default function VersionPanel({ versionName, setVersionName, onSaveVersion, versions, onRestore }) {
  const handleCommit = (e) => {
    e.preventDefault();
    if (!versionName.trim()) return;
    onSaveVersion();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="pb-3 mb-4 border-b border-workspace-border/50">
        <h3 className="text-xs uppercase tracking-wider font-bold text-workspace-textMuted">
          Commit Version Ledger
        </h3>
      </div>

      <form onSubmit={handleCommit} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="e.g., commit-v1.2-stable"
          className="ide-input text-xs w-full font-mono"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
        />
        <button type="submit" className="ide-button-primary py-1.5 text-xs font-semibold w-full">
          Snapshot Cluster Filesystem
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {versions.length === 0 ? (
          <div className="text-[11px] text-workspace-textMuted text-center py-4 font-mono">
            No active recovery checkpoints verified
          </div>
        ) : (
          versions.map((v) => (
            <div key={v._id} className="p-3 bg-workspace-bg/40 border border-workspace-border rounded-lg flex flex-col gap-2 shadow-sm">
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold text-workspace-accent truncate">
                  📌 {v.versionName}
                </span>
                <span className="text-[9px] text-workspace-textMuted font-mono mt-0.5">
                  ID: {v._id.substring(0, 8)}...
                </span>
              </div>
              <button
                onClick={() => onRestore(v._id)}
                className="text-[10px] uppercase font-bold tracking-wider text-workspace-bg bg-workspace-textMuted hover:bg-workspace-accent px-2 py-1 rounded transition-colors self-end"
              >
                Rollback State
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}