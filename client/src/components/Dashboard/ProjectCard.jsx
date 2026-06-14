import { useNavigate } from "react-router-dom";

export default function ProjectCard({
  project,
}) {
  const navigate =
    useNavigate();

  return (
    <div className="border p-4 rounded">
      <h2>{project.name}</h2>

      <p>{project.description}</p>

      <button
        onClick={() =>
          navigate(
            `/workspace/${project._id}`
          )
        }
      >
        Open Project
      </button>
    </div>
  );
}