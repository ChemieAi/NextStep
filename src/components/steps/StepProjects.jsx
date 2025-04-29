import { useState } from "react";

const StepProjects = ({ data, setData }) => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    link: "",
  });

  const handleChange = (e) =>
    setProject({ ...project, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!project.title || !project.description) return;
    const updated = [...(data.projects || []), project];
    setData({ ...data, projects: updated });
    setProject({ title: "", description: "", link: "" });
  };

  const handleDelete = (index) => {
    const updated = data.projects.filter((_, i) => i !== index);
    setData({ ...data, projects: updated });
  };

  return (
    <div className="space-y-6">
      {/* Listelenmiş projeler */}
      {(data.projects || []).map((p, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-md border relative">
          <p className="font-semibold">{p.title}</p>
          <p className="text-sm text-gray-700">{p.description}</p>
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 underline"
            >
              {p.link}
            </a>
          )}
          <button
            onClick={() => handleDelete(i)}
            className="text-white bg-green-300 px-3 py-1 rounded hover:bg-green-600 absolute top-2 right-2"
          >
            🗑️
          </button>
        </div>
      ))}

      {/* Yeni proje alanı */}
      <div className="grid gap-4">
        <input
          name="title"
          value={project.title}
          onChange={handleChange}
          placeholder="Proje Başlığı"
          className="p-3 border rounded bg-gray-50"
        />
        <textarea
          name="description"
          value={project.description}
          onChange={handleChange}
          placeholder="Proje Açıklaması"
          className="p-3 border rounded bg-gray-50"
        />
        <input
          name="link"
          value={project.link}
          onChange={handleChange}
          placeholder="Proje Linki (isteğe bağlı)"
          className="p-3 border rounded bg-gray-50"
        />
      </div>

      <button
        onClick={handleAdd}
        className="w-full border-2 border-green-500 text-green-500 py-2 rounded hover:bg-green-100 font-semibold"
      >
        EKLE
      </button>
    </div>
  );
};

export default StepProjects;
