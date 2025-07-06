import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const StepProjects = ({ data, setData }) => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    link: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editedProject, setEditedProject] = useState(null);

  const handleChange = (e) =>
    setProject({ ...project, [e.target.name]: e.target.value });

  const handleEditChange = (e) =>
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });

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

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...data.projects];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setData({ ...data, projects: updated });
  };

  const moveDown = (index) => {
    if (index === data.projects.length - 1) return;
    const updated = [...data.projects];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setData({ ...data, projects: updated });
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditedProject({ ...data.projects[index] });
  };

  const saveEdit = () => {
    const updated = [...data.projects];
    updated[editIndex] = editedProject;
    setData({ ...data, projects: updated });
    setEditIndex(null);
    setEditedProject(null);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditedProject(null);
  };

  return (
    <div className="space-y-6">
      {(data.projects || []).map((p, i) => (
        <div key={i} className="bg-gray-50 p-4 pt-10 rounded-md border relative dark:bg-gray-700 dark:text-white">
          {/* Sağ üstte sabit butonlar */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => moveUp(i)}
              title="Yukarı Taşı"
              className="bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
            >
              <ChevronUpIcon className="w-5 h-5 text-gray-100" />
            </button>
            <button
              onClick={() => moveDown(i)}
              title="Aşağı Taşı"
              className="bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
            >
              <ChevronDownIcon className="w-5 h-5 text-gray-100" />
            </button>
            <button
              onClick={() => handleDelete(i)}
              title="Sil"
              className="bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
            >
              <TrashIcon className="w-5 h-5 text-gray-100" />
            </button>
          </div>

          {editIndex === i ? (
            <div className="space-y-2">
              <input
                name="title"
                value={editedProject.title}
                onChange={handleEditChange}
                placeholder="Proje Başlığı"
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
              />
              <textarea
                name="description"
                value={editedProject.description}
                onChange={handleEditChange}
                placeholder="Açıklama"
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
              />
              <input
                name="link"
                value={editedProject.link}
                onChange={handleEditChange}
                placeholder="Proje Linki"
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button onClick={saveEdit} className="px-3 py-1 bg-green-600 text-white rounded">Kaydet</button>
                <button onClick={cancelEdit} className="px-3 py-1 bg-gray-500 text-white rounded">İptal</button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-semibold dark:text-white">{p.title}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{p.description}</p>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline text-center block"
                >
                  {p.link}
                </a>
              )}
              <button
                title="Düzenle"
                onClick={() => startEdit(i)}
                className="absolute top-2 left-2 bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
              >
                <PencilIcon className="w-5 h-5 text-gray-100" />
              </button>
            </>
          )}
        </div>
      ))}

      {/* Yeni proje alanı */}
      <div className="grid gap-4">
        <input
          name="title"
          value={project.title}
          onChange={handleChange}
          placeholder="Proje Başlığı"
          className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <textarea
          name="description"
          value={project.description}
          onChange={handleChange}
          placeholder="Proje Açıklaması"
          className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <input
          name="link"
          value={project.link}
          onChange={handleChange}
          placeholder="Proje Linki (isteğe bağlı)"
          className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <button
        onClick={handleAdd}
        className="w-full border-2 border-green-500 dark:border-green-400 text-green-500 dark:text-green-400 py-2 rounded hover:bg-green-100 font-semibold dark:hover:bg-gray-600"
      >
        EKLE
      </button>
    </div>
  );
};

export default StepProjects;
