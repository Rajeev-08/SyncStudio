import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.error("Dashboard out-of-sync:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setError("");

    try {
      await api.post("/projects", form);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError("Cluster synchronization failure during container initialization.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-workspace-bg relative overflow-y-auto">
      {/* Structural Background Ambient Highlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-workspace-accent/5 rounded-full filter blur-3xl pointer-events-none" />
      
      {/* Persistent Operational Nav-Header */}
      <header className="w-full border-b border-workspace-border bg-workspace-panel/40 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-workspace-accent to-workspace-darkAccent flex items-center justify-center font-bold text-workspace-bg shadow-lg shadow-workspace-accent/20">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-workspace-textActive">
            Sync<span className="text-workspace-accent">Studio</span>
          </h1>
          <span className="px-2 py-0.5 rounded bg-workspace-border border border-workspace-border/60 text-[10px] text-workspace-accent font-mono">
            v1.1.0-PRO
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-workspace-textActive">{user?.username}</span>
            <span className="text-[11px] text-workspace-textMuted font-mono">{user?.email}</span>
          </div>
          <button 
            onClick={logout}
            className="ide-button-secondary py-1 px-3 text-xs border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
          >
            Terminate Session
          </button>
        </div>
      </header>

      {/* Main Structural Framework Layout Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Project Container Deployment Controller Panel */}
        <section className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-xl sticky top-24 shadow-xl">
            <h2 className="text-lg font-bold text-workspace-textActive mb-1">Provision Workspace</h2>
            <p className="text-xs text-workspace-textMuted mb-5">
              Launch a shared cloud cluster filesystem node container instance.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={createProject} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-workspace-textMuted">
                  Project Workspace Identifier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., hyper-ledger-engine"
                  className="ide-input w-full font-mono text-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-workspace-textMuted">
                  Target Intent Description
                </label>
                <textarea
                  placeholder="Describe workspace task operations scope..."
                  className="ide-input w-full text-sm resize-none h-24"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button type="submit" className="ide-button-primary w-full py-2 font-semibold mt-2">
                Initialize Project Workspace Node
              </button>
            </form>
          </div>
        </section>

        {/* Available Clustered Active Projects Stream Nodes */}
        <section className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-workspace-textActive tracking-tight">
              Active Synchronized Repositories
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-workspace-panel border border-workspace-border text-workspace-textMuted">
              Total Managed Nodes: {projects.length}
            </span>
          </div>

          {loading ? (
            <div className="w-full py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-workspace-accent border-workspace-border" />
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-panel rounded-xl py-16 px-6 text-center flex flex-col items-center justify-center border-dashed border-2">
              <div className="text-3xl mb-3 text-workspace-textMuted/40">📂</div>
              <h3 className="text-base font-bold text-workspace-textActive">No Cluster Nodes Verified</h3>
              <p className="text-xs text-workspace-textMuted max-w-sm mt-1">
                Deploy an operational container system using the controller map vector layout configurations pane.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div 
                  key={project._id}
                  className="glass-panel p-5 rounded-xl hover:border-workspace-accent/40 transition-all duration-300 group flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-workspace-textActive group-hover:text-workspace-accent transition-colors truncate">
                        {project.name}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-workspace-bg border border-workspace-border text-workspace-textMuted">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-workspace-textMuted line-clamp-2 mb-6">
                      {project.description || "No core structural operation objectives documented."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-workspace-border/50">
                    <span className="text-[10px] font-mono text-workspace-textMuted">
                      REF ID: {project._id.substring(0, 8)}...
                    </span>
                    <button
                      onClick={() => navigate(`/workspace/${project._id}`)}
                      className="text-xs bg-workspace-accent/10 hover:bg-workspace-accent text-workspace-accent hover:text-workspace-bg font-semibold px-3 py-1.5 rounded transition-all flex items-center gap-1.5"
                    >
                      Mount Mirror Base
                      <span className="text-sm font-mono leading-none">&rarr;</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}