import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FolderTree, GitCommit, Zap, Users, ArrowLeft, Save } from "lucide-react";
import api from "../services/api";
import socket from "../services/socket";

import FileExplorer from "../components/Workspace/FileExplorer";
import CodeEditor from "../components/Workspace/CodeEditor";
import VersionPanel from "../components/Workspace/VersionPanel";
import ActivityPanel from "../components/Workspace/ActivityPanel";
import MembersPanel from "../components/Workspace/MembersPanel";
import LivePreview from "../components/Workspace/LivePreview";

export default function Workspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Core Data Cache States
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [versions, setVersions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  
  // Layout Interface Configuration UI States
  const [activeTab, setActiveTab] = useState("explorer");
  const [inviteEmail, setInviteEmail] = useState("");
  const [versionName, setVersionName] = useState("");
  const [projectName, setProjectName] = useState("sync-workspace-node");

  // Track unsaved states to prevent background overwrites
  const isDirtyRef = useRef(false);
  const selectedFileIdRef = useRef(null);

  // Core Workspace Metadata Synchronization Pipeline
  const fetchWorkspaceMeta = useCallback(async () => {
    try {
      const [filesRes, versionsRes, activitiesRes, membersRes] = await Promise.all([
        api.get(`/files/${projectId}`),
        api.get(`/projects/${projectId}/version`),
        api.get(`/projects/${projectId}/activity`),
        api.get(`/projects/${projectId}/members`),
      ]);
      
      const rawIncomingFiles = filesRes.data.files;

      // Merge background database content with local cache tracking states
      setFiles(prevFiles => {
        return rawIncomingFiles.map(incomingFile => {
          // Keep active text edit structures secure from database overrides
          if (incomingFile._id === selectedFileIdRef.current && isDirtyRef.current) {
            return { ...incomingFile, content: editorContent, isDirty: true };
          }
          // Retain historical tab-swap updates if they haven't been committed to server yet
          const existingLocalCache = prevFiles.find(f => f._id === incomingFile._id);
          return existingLocalCache 
            ? { ...incomingFile, content: existingLocalCache.content, isDirty: existingLocalCache.isDirty } 
            : incomingFile;
        });
      });

      setVersions(versionsRes.data.versions);
      setActivities(activitiesRes.data.activities);
      setMembers(membersRes.data.members);
    } catch (err) {
      console.error("Workspace configuration synchronizer connection fault:", err);
    }
  }, [projectId, editorContent]);

  useEffect(() => {
    fetchWorkspaceMeta();
    socket.emit("join-project", projectId);

    return () => {
      socket.off("file-sync-receive");
    };
  }, [projectId, fetchWorkspaceMeta]);

  // Handle local text editor typing changes safely
  const handleEditorChange = (newValue) => {
    setEditorContent(newValue);
    isDirtyRef.current = true;

    // Trigger visual notification indicator flag immediately inside the localized files cache layout map
    setFiles(prev => prev.map(f => 
      f._id === selectedFileIdRef.current ? { ...f, content: newValue, isDirty: true } : f
    ));
  };

  // Virtual Filesystem Resource Node Allocation
  const handleCreateResource = async (name, type, parentId) => {
    try {
      await api.post("/files", {
        projectId,
        name,
        type,
        parentId,
        language: name.endsWith(".json") 
          ? "json" 
          : name.endsWith(".css") 
          ? "css" 
          : name.endsWith(".html") 
          ? "html" 
          : "javascript",
      });
      fetchWorkspaceMeta();
    } catch (err) {
      alert(err.response?.data?.message || "Fault mapping core node container resource.");
    }
  };

  // Node Resource Deletion Handler Pipe
  const handleDeleteResource = async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
      if (selectedFileIdRef.current === fileId) {
        selectedFileIdRef.current = null;
        isDirtyRef.current = false;
        setSelectedFile(null);
        setEditorContent("");
      }
      fetchWorkspaceMeta();
    } catch (err) {
      console.error("Deletion task thread structural error:", err);
    }
  };

  // Explicit Cloud Database Save Handler
  const handleSaveFile = async () => {
    if (!selectedFileIdRef.current) return;
    try {
      await api.put(`/files/${selectedFileIdRef.current}`, { content: editorContent });
      
      // Release dirty buffer protection and drop visual notification dots back to silent status
      isDirtyRef.current = false;
      setFiles(prev => prev.map(f => 
        f._id === selectedFileIdRef.current ? { ...f, content: editorContent, isDirty: false } : f
      ));

      fetchWorkspaceMeta();
    } catch (err) {
      console.error("Explicit save node compilation trace drop fault:", err);
    }
  };

  const handleSaveVersion = async () => {
    try {
      await api.post(`/projects/${projectId}/version`, { versionName });
      setVersionName("");
      fetchWorkspaceMeta();
    } catch (err) {
      console.error("Checkpoints verification database track index exception:", err);
    }
  };

  const handleRestoreVersion = async (versionId) => {
    try {
      await api.post(`/projects/restore/${versionId}`);
      selectedFileIdRef.current = null;
      isDirtyRef.current = false;
      setSelectedFile(null);
      setEditorContent("");
      fetchWorkspaceMeta();
    } catch (err) {
      console.error("Recovery routine process stack freeze fault:", err);
    }
  };

  const handleInviteMember = async () => {
    try {
      await api.post(`/projects/${projectId}/invite`, { email: inviteEmail });
      setInviteEmail("");
      fetchWorkspaceMeta();
    } catch (err) {
      alert("Target user validation matching registration parameter error context.");
    }
  };

  // Extract separate static environment strings directly from files tracking data list array caches
  const htmlFileContent = files.find(f => f.name.endsWith(".html") && f.type === "file")?.content || "";
  const cssFileContent = files.find(f => f.name.endsWith(".css") && f.type === "file")?.content || "";
  const jsFileContent = files.find(f => f.name.endsWith(".js") && f.type === "file")?.content || "";

  return (
    <div className="h-screen w-screen flex flex-col bg-workspace-bg overflow-hidden text-workspace-textActive">
      
      {/* Structural IDE Header Controls Section */}
      <header className="h-12 border-b border-workspace-border/80 bg-workspace-panel/40 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-4 min-w-0">
          <button 
            onClick={() => navigate("/")}
            className="text-workspace-textMuted hover:text-workspace-accent font-mono text-sm transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Hub Dashboard</span>
          </button>
          <div className="h-4 w-[1px] bg-workspace-border" />
          <h2 className="text-sm font-bold tracking-tight text-workspace-textActive truncate font-mono">
            {projectName}
          </h2>
        </div>

        <div>
          {selectedFile && (
            <button
              onClick={handleSaveFile}
              className="bg-workspace-accent/10 hover:bg-workspace-accent text-workspace-accent hover:text-workspace-bg border border-workspace-accent/30 text-xs font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1.5 shadow-md shadow-workspace-accent/5"
            >
              <Save className="h-3.5 w-3.5" />
              Save File
            </button>
          )}
        </div>
      </header>

      {/* Main Panel Viewport Setup Box */}
      <div className="flex-1 w-full flex overflow-hidden">
        
        {/* Left Vertical App Tab Selector Sidebelt */}
        <nav className="w-12 border-r border-workspace-border/60 bg-workspace-panel/20 flex flex-col items-center py-3 gap-4 select-none">
          {[
            { id: "explorer", icon: <FolderTree className="h-4 w-4" />, label: "Files" },
            { id: "versions", icon: <GitCommit className="h-4 w-4" />, label: "Commits" },
            { id: "activities", icon: <Zap className="h-4 w-4" />, label: "Telemetry" },
            { id: "members", icon: <Users className="h-4 w-4" />, label: "Access" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all relative ${
                activeTab === tab.id 
                  ? "bg-workspace-border text-workspace-accent border border-workspace-border shadow-inner" 
                  : "text-workspace-textMuted hover:text-workspace-textActive"
              }`}
              title={tab.label}
            >
              {tab.icon}
              {activeTab === tab.id && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-workspace-accent rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Dynamic Side Drawers Context Panel Container */}
        <aside className="w-64 sm:w-72 border-r border-workspace-border/60 bg-workspace-panel/40 p-4 flex flex-col h-full overflow-hidden shadow-xl">
          {activeTab === "explorer" && (
  <FileExplorer 
    files={files} 
    currentFileId={selectedFile?.viewId || selectedFileIdRef.current} 
    onSelect={(clickedFile) => { 
      const previousFileId = selectedFileIdRef.current;
      const capturedCurrentEditorText = editorContent;

      // 1. Atomic State Sync: Shift cache buffers using the functional state architecture
      setFiles(prevFiles => {
        // Step A: Map out any unsaved edits for the file we are LEAVING
        const synchronizedCache = prevFiles.map(f => 
          f._id === previousFileId ? { ...f, content: capturedCurrentEditorText } : f
        );

        // Step B: Pull out the fresh, un-batched text buffer for the file we are ENTERING
        const targetNode = synchronizedCache.find(f => f._id === clickedFile._id);
        
        // Step C: Safely load it into the Monaco editor frame view context without timing racing
        setEditorContent(targetNode?.content || clickedFile.content || "");
        
        return synchronizedCache;
      });

      // 2. Safely lower dirty flags and re-point hardware refs
      isDirtyRef.current = false;
      selectedFileIdRef.current = clickedFile._id;
      setSelectedFile(clickedFile);
    }}
    onDelete={handleDeleteResource}
    onCreateResource={handleCreateResource}
  />
)}
          {activeTab === "versions" && (
            <VersionPanel 
              versionName={versionName} 
              setVersionName={setVersionName}
              onSaveVersion={handleSaveVersion}
              versions={versions}
              onRestore={handleRestoreVersion}
            />
          )}
          {activeTab === "activities" && <ActivityPanel activities={activities} />}
          {activeTab === "members" && (
            <MembersPanel 
              members={members}
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              onInvite={handleInviteMember}
            />
          )}
        </aside>

        {/* Split Screen Workspace Window Matrix Layout Proportions Dashboard */}
        <main className="flex-1 h-full p-4 bg-workspace-bg/20 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.02)_0,transparent_100%)] pointer-events-none" />
          
          {/* Window Pane 1: Dynamic Monaco Text Workspace View Box */}
          <div className="h-full w-full relative z-10 overflow-hidden flex flex-col rounded-xl border border-workspace-border bg-workspace-panel/30 shadow-xl transition-all hover:border-workspace-border/80">
            <CodeEditor 
              file={selectedFile}
              content={editorContent}
              onChange={handleEditorChange}
              projectId={projectId}
            />
          </div>

          {/* Window Pane 2: Live HTML Sandbox Compiler Mirror Output View Box */}
          <div className="h-full w-full relative z-10 overflow-hidden flex flex-col rounded-xl border border-workspace-border bg-workspace-panel/30 shadow-xl transition-all hover:border-workspace-border/80">
            <LivePreview 
              htmlContent={htmlFileContent}
              cssContent={cssFileContent}
              jsContent={jsFileContent}
            />
          </div>
        </main>

      </div>
    </div>
  );
}