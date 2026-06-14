import { useEffect, useState } from "react";
import { Play, ShieldAlert } from "lucide-react";

export default function LivePreview({ htmlContent = "", cssContent = "", jsContent = "" }) {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    // 500ms compilation debounce prevents iframe layout flashing or freezing while typing
    const compileTimeout = setTimeout(() => {
      // Inside client/src/components/Workspace/LivePreview.jsx
const combinedDocument = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        ${cssContent}
      </style>
    </head>
    <body>
      
      ${htmlContent}

      <script>
        window.addEventListener('error', function (e) {
          console.error("Runtime Error Context caught inside sandboxed frame context:", e.error);
        });

        document.addEventListener('DOMContentLoaded', function() {
          try {
            ${jsContent}
          } catch (err) {
            console.error("Execution Compilation Interrupt Exception:", err);
          }
        });
      </script>
    </body>
  </html>
`;
      setSrcDoc(combinedDocument);
    }, 500);

    return () => clearTimeout(compileTimeout);
  }, [htmlContent, cssContent, jsContent]);

  return (
    <div className="h-full w-full flex flex-col bg-workspace-panel rounded-xl overflow-hidden border border-workspace-border shadow-2xl">
      
      {/* Live Preview Bar Title Layout Header */}
      <div className="bg-workspace-bg/40 px-4 py-2 border-b border-workspace-border/60 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400/20" />
          <span className="text-xs font-mono font-bold text-workspace-textActive">Interactive Live View Monitor</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-workspace-textMuted font-mono bg-workspace-bg px-2 py-0.5 rounded border border-workspace-border">
          <ShieldAlert className="h-3 w-3 text-workspace-accent" />
          sandboxed-environment
        </div>
      </div>

      {/* Embedded Render Sandbox Surface Frame Viewport */}
      <div className="flex-1 w-full bg-white relative">
        <iframe
          srcDoc={srcDoc}
          title="SyncStudio Real-time Sandboxed Sandbox Workspace Screen Pipeline Output Container"
          /* Isolate execution cookies and root tokens tokens securely */
          sandbox="allow-scripts"
          className="w-full h-full border-none bg-white"
        />
      </div>
    </div>
  );
}