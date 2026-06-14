import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { FileCode } from "lucide-react";
import socket from "../../services/socket";

export default function CodeEditor({ file, content, onChange, projectId }) {
  const editorRef = useRef(null);
  const isIncomingChange = useRef(false);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (!file) return;

    socket.on("file-sync-receive", (data) => {
      if (data.fileId === file._id) {
        isIncomingChange.current = true;
        const position = editorRef.current?.getPosition();
        onChange(data.content);
        
        setTimeout(() => {
          if (position) editorRef.current?.setPosition(position);
          isIncomingChange.current = false;
        }, 0);
      }
    });

    return () => { socket.off("file-sync-receive"); };
  }, [file, onChange]);

  const handleLocalChange = (newValue) => {
    onChange(newValue || "");
    if (!isIncomingChange.current && file) {
      socket.emit("file-edit", {
        projectId,
        fileId: file._id,
        content: newValue || "",
      });
    }
  };

  if (!file) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-workspace-bg text-workspace-textMuted border border-workspace-border rounded-xl">
        <FileCode className="h-10 w-10 mb-2 text-workspace-textMuted/30" />
        <p className="text-xs font-mono">Select a cluster node resource from the filesystem tree</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-workspace-panel rounded-xl overflow-hidden border border-workspace-border shadow-2xl">
      <div className="bg-workspace-bg/40 px-4 py-2 border-b border-workspace-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-workspace-accent" />
          <span className="text-xs font-mono font-bold text-workspace-textActive">{file.name}</span>
          <span className="text-[10px] font-mono bg-workspace-border px-1.5 py-0.5 rounded text-workspace-textMuted">
            {file.language}
          </span>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="flex-1 w-full pt-2">
        <Editor
          height="100%"
          width="100%"
          language={file.language}
          value={content}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleLocalChange}
          options={{
            fontSize: 13,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            minimap: { enabled: true },
            scrollbar: { verticalWidth: 6, horizontalHeight: 6 },
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 8, bottom: 8 },
          }}
        />
      </div>
    </div>
  );
}