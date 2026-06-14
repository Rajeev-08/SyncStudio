import { Zap } from "lucide-react";

export default function ActivityPanel({ activities }) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Structural Header Row with Lucide Icon */}
      <div className="pb-3 mb-4 border-b border-workspace-border/50 flex items-center gap-2">
        <Zap className="h-4 w-4 text-workspace-accent" />
        <h3 className="text-xs uppercase tracking-wider font-bold text-workspace-textMuted">
          Telemetry Activity Monitor
        </h3>
      </div>

      {/* Primary Log Feed Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {activities.length === 0 ? (
          <div className="text-[11px] text-workspace-textMuted text-center py-6 font-mono border border-dashed border-workspace-border/40 rounded-lg">
            Silent operational bus channel
          </div>
        ) : (
          activities.map((act) => {
            // Contextually evaluate action mapping type for custom system telemetry flags
            let logEmoji = "⚙️";
            if (act.action.includes("CREATE")) logEmoji = "🟢";
            if (act.action.includes("UPDATE")) logEmoji = "🔵";
            if (act.action.includes("DELETED") || act.action.includes("DECEASED")) logEmoji = "🔴";
            if (act.action.includes("VERSION") || act.action.includes("COMMIT")) logEmoji = "📦";
            if (act.action.includes("INVITED") || act.action.includes("COLLABORATOR")) logEmoji = "🔑";

            return (
              <div 
                key={act._id} 
                className="text-xs font-mono flex flex-col gap-1 border-b border-workspace-border/30 pb-2.5 hover:bg-workspace-border/10 rounded px-1 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-workspace-accent uppercase tracking-wide flex items-center gap-1">
                    <span>{logEmoji}</span>
                    {act.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-[9px] text-workspace-textMuted">
                    {new Date(act.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-workspace-textActive text-[11px] pl-4 font-semibold truncate">
                  {act.details}
                </p>
                <span className="text-[10px] text-workspace-textMuted italic pl-4">
                  by @{act.userId?.username || "system_node"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}