import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed due to structural resource conflict");
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
            Create an identity node to link clustered files
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
              Username
            </label>
            <input
              type="text"
              placeholder="linus_torvalds"
              className="ide-input w-full"
              required
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

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
            {loading ? "Registering Cluster node..." : "Provision Node"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-workspace-textMuted">
          Already registered?{" "}
          <Link to="/login" className="text-workspace-accent hover:underline">
            Execute Login Sequence
          </Link>
        </div>
      </div>
    </div>
  );
}