import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid authentication credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-workspace-bg px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0,transparent_100%)] pointer-events-none" />
      
      <div className="w-full max-w-md glass-panel p-8 rounded-xl shadow-2xl relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-workspace-textActive">
            Sync<span className="text-workspace-accent">Studio</span>
          </h1>
          <p className="text-sm text-workspace-textMuted mt-2">
            Sign in to access your collaborative engineering hub
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-workspace-textMuted">
              Email Address
            </label>
            <input
              type="email"
              placeholder="developer@syncstudio.io"
              className="ide-input w-full"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-workspace-textMuted">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="ide-input w-full"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ide-button-primary w-full py-2.5 mt-2 flex justify-center items-center font-semibold disabled:opacity-50"
          >
            {loading ? "Authenticating Node..." : "Initialize Session"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-workspace-textMuted">
          New system user?{" "}
          <Link to="/register" className="text-workspace-accent hover:underline">
            Register Workspace Node
          </Link>
        </div>
      </div>
    </div>
  );
}