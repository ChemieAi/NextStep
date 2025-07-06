import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const StepSocial = ({ data, setData }) => {
  const [social, setSocial] = useState({ name: "", url: "" });

  const handleChange = (e) => {
    setSocial({ ...social, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!social.name || !social.url) return;
    const updated = [...(data.socials || []), social];
    setData({ ...data, socials: updated });
    setSocial({ name: "", url: "" });
  };

  const handleDelete = (index) => {
    const updated = data.socials.filter((_, i) => i !== index);
    setData({ ...data, socials: updated });
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...data.socials];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setData({ ...data, socials: updated });
  };

  const moveDown = (index) => {
    if (index === data.socials.length - 1) return;
    const updated = [...data.socials];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setData({ ...data, socials: updated });
  };

  return (
    <div className="space-y-4 ">
      {/* Mevcut linkler */}
      {(data.socials || []).map((item, index) => (
        <div key={index} className="flex flex-col md:flex-row gap-2 items-center">
          <input
            type="text"
            value={item.name}
            disabled
            className="flex-1 p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white w-full"
          />
          <input
            type="text"
            value={item.url}
            disabled
            className="flex-1 p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white w-full"
          />
          <div className="flex gap-1 mb-4">
            <button
              onClick={() => moveUp(index)}
              title="Yukarı Taşı"
              className="bg-gray-500 hover:bg-green-700 text-white p-2 rounded"
            >
              <ChevronUpIcon className="w-5 h-5 text-gray-100" />
            </button>
            <button
              onClick={() => moveDown(index)}
              title="Aşağı Taşı"
              className="bg-gray-500 hover:bg-green-700 text-white p-2 rounded"
            >
              <ChevronDownIcon className="w-5 h-5 text-gray-100" />
            </button>
            <button
              onClick={() => handleDelete(index)}
              title="Sil"
              className="bg-gray-500 hover:bg-green-700 text-white p-2 rounded"
            >
              <TrashIcon className="w-5 h-5 text-gray-100" />
            </button>
          </div>
        </div>
      ))}

      {/* Yeni giriş alanı */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={social.name}
          onChange={handleChange}
          placeholder="Link Adı (e.g. LinkedIn)"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          name="url"
          value={social.url}
          onChange={handleChange}
          placeholder="Link URL (e.g. https://linkedin.com/in/burak-kızılay)"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Ekle butonu */}
      <button
        onClick={handleAdd}
        className="w-full border-2 border-green-500 dark:border-green-400 text-green-500 dark:text-green-400 py-2 rounded hover:bg-green-100 font-semibold dark:hover:bg-gray-600"
      >
        EKLE
      </button>
    </div >
  );
};

export default StepSocial;
