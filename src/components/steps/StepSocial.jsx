import { useState } from "react";

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

  return (
    <div className="space-y-4 ">
      {/* Mevcut linkler */}
      {(data.socials || []).map((item, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 items-center">
          <input
            type="text"
            value={item.name}
            disabled
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={item.url}
              disabled
              className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={() => handleDelete(index)}
              className="text-white bg-green-300 px-3 py-1 rounded hover:bg-green-500"
            >
              🗑️
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
        className="w-full border-2 border-green-500 text-green-500 py-2 rounded hover:bg-green-100 font-semibold dark:hover:bg-gray-600"
      >
        EKLE
      </button>
    </div>
  );
};

export default StepSocial;
