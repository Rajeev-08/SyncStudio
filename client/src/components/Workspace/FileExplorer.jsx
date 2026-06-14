import { useState } from "react";
import { Folder, FolderOpen, FileCode, ChevronDown, ChevronRight, FilePlus, FolderPlus, Trash2 } from "lucide-react";

export default function FileExplorer({ files, onSelect, onDelete, onCreateResource, currentFileId }) {
  const [openFolders, setOpenFolders] = useState({});
  const [showInput, setShowInput] = useState({ visible: false, type: null, parentId: null });
  const [resourceName, setResourceName] = useState("");

  const toggleFolder = (folderId) => {
    setOpenFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!resourceName.trim()) return;
    onCreateResource(resourceName, showInput.type, showInput.parentId);
    setResourceName("");
    setShowInput({ visible: false, type: null, parentId: null });
  };

  const renderTree = (parentId = null, depth = 0) => {
    const currentNodes = files.filter((f) => f.parentId === parentId);

    return currentNodes.map((node) => {
      const isFolder = node.type === "folder";
      const isOpen = openFolders[node._id];
      const isActive = node._id === currentFileId;

      if (isFolder) {
        return (
          <div key={node._id} className="w-full select-none">
            <div 
              style={{ paddingLeft: `${depth * 12 + 6}px` }}
              className="flex items-center justify-between group hover:bg-workspace-border/30 rounded px-2 py-1.5 cursor-pointer transition-colors"
              onClick={() => toggleFolder(node._id)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-workspace-textMuted">
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </span>
                <span className="text-amber-400">
                  {isOpen ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                </span>
                <span className="text-sm font-medium text-workspace-textActive truncate font-mono">
                  {node.name}
                </span>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowInput({ visible: true, type: "file", parentId: node._id }); }}
                  className="p-0.5 text-workspace-textMuted hover:text-workspace-accent"
                >
                  <FilePlus className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowInput({ visible: true, type: "folder", parentId: node._id }); }}
                  className="p-0.5 text-workspace-textMuted hover:text-workspace-accent"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(node._id); }}
                  className="p-0.5 text-workspace-textMuted hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {isOpen && <div className="w-full">{renderTree(node._id, depth + 1)}</div>}
          </div>
        );
      }

      return (
        <div 
          key={node._id}
          style={{ paddingLeft: `${depth * 12 + 26}px` }}
          className={`flex items-center justify-between group rounded px-2 py-1.5 cursor-pointer transition-all ${
            isActive 
              ? "bg-workspace-accent/10 border border-workspace-accent/20 text-workspace-accent" 
              : "hover:bg-workspace-border/30 border border-transparent text-workspace-textMuted"
          }`}
          onClick={() => onSelect(node)}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileCode className={`h-4 w-4 shrink-0 ${isActive ? "text-workspace-accent" : "text-workspace-textMuted"}`} />
            <span className={`text-sm truncate font-mono transition-colors ${isActive ? "text-workspace-accent font-semibold" : "group-hover:text-workspace-textActive"}`}>
              {node.name}
            </span>
            
            {/* CLASSIC IDE INDICATOR: Render a crisp white dot if the file has unsaved edits */}
            {node.isDirty && (
              <span 
                className="h-1.5 w-1.5 rounded-full bg-workspace-textActive shadow-sm shrink-0 ml-1.5 animate-pulse" 
                title="Unsaved Changes Detected"
              />
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(node._id); }}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-workspace-textMuted hover:text-red-400 transition-opacity ml-2"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-workspace-border/50">
        <h3 className="text-xs uppercase tracking-wider font-bold text-workspace-textMuted">
          Workspace Filesystem
        </h3>
        <div className="flex gap-1">
          <button 
            onClick={() => setShowInput({ visible: true, type: "file", parentId: null })}
            className="p-1 rounded text-workspace-textMuted hover:text-workspace-accent hover:bg-workspace-bg"
          >
            <FilePlus className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setShowInput({ visible: true, type: "folder", parentId: null })}
            className="p-1 rounded text-workspace-textMuted hover:text-workspace-accent hover:bg-workspace-bg"
          >
            <FolderPlus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showInput.visible && (
        <form onSubmit={handleCreate} className="mb-2 flex gap-1 px-1">
          <input
            type="text"
            placeholder={showInput.type === "folder" ? "Folder name..." : "File name..."}
            className="ide-input text-xs w-full py-1 font-mono bg-workspace-bg"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            autoFocus
            onBlur={() => setTimeout(() => setShowInput({ visible: false, type: null, parentId: null }), 200)}
          />
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
        {files.length === 0 ? (
          <div className="text-[11px] text-workspace-textMuted text-center py-4 font-mono">
            Empty File Container Tree
          </div>
        ) : (
          renderTree(null, 0)
        )}
      </div>
    </div>
  );
}