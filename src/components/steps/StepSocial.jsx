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
    <div className="space-y-4">
      {/* Mevcut linkler */}
      {(data.socials || []).map((item, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 items-center">
          <input
            type="text"
            value={item.name}
            disabled
            className="w-full p-3 border rounded bg-gray-100"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={item.url}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />
            <button
              onClick={() => handleDelete(index)}
              className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
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
          placeholder="Link Name"
          className="w-full p-3 border rounded bg-gray-50"
        />
        <input
          type="text"
          name="url"
          value={social.url}
          onChange={handleChange}
          placeholder="Link URL"
          className="w-full p-3 border rounded bg-gray-50"
        />
      </div>

      {/* Ekle butonu */}
      <button
        onClick={handleAdd}
        className="mt-2 w-full border-2 border-orange-500 text-orange-500 py-2 rounded hover:bg-orange-50 font-semibold"
      >
        EKLE
      </button>
    </div>
  );
};

export default StepSocial;
