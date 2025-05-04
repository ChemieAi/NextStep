import { useState } from "react";

const StepExperience = ({ data, setData }) => {
  const [exp, setExp] = useState({
    company: "",
    position: "",
    startDay: "",
    startMonth: "",
    startYear: "",
    endDay: "",
    endMonth: "",
    endYear: "",
    description: "",
    currently: false,
  });

  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setExp({ ...exp, [name]: type === "checkbox" ? checked : value });
  };

  const handleAdd = () => {
    if (!exp.company || !exp.position) return;
    const updated = [...(data.experience || []), exp];
    setData({ ...data, experience: updated });
    setExp({
      company: "",
      position: "",
      startDay: "",
      startMonth: "",
      startYear: "",
      endDay: "",
      endMonth: "",
      endYear: "",
      description: "",
      currently: false,
    });
  };

  const handleDelete = (index) => {
    const updated = data.experience.filter((_, i) => i !== index);
    setData({ ...data, experience: updated });
  };

  return (
    <div className="space-y-6">
      {/* Mevcut deneyimler */}
      {(data.experience || []).map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-md border relative dark:bg-gray-700 dark:text-white">
          <p className="font-semibold  dark:text-white">{item.company} – {item.position}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {item.startMonth}/{item.startYear} -{" "} {item.currently ? "Devam ediyor" : `${item.endMonth}/${item.endYear}`}
          </p>
          <p className="text-sm mt-2 text-gray-700 dark:text-gray-400">{item.description}</p>
          <button
            onClick={() => handleDelete(index)}
            className="text-white bg-green-300 px-3 py-1 rounded hover:bg-green-600 absolute top-2 right-2"
            title="Sil"
          >
            🗑️
          </button>
        </div>
      ))}

      {/* Yeni giriş alanı */}
      <div className="grid md:grid-cols-2 gap-4">
        <input name="company" value={exp.company} onChange={handleChange} placeholder="Şirket" className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white" />
        <input name="position" value={exp.position} onChange={handleChange} placeholder="Pozisyon" className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white" />

        {/* Tarihler */}
        <div className="flex gap-2">
          <p className="text-sm font-semibold dark:text-white">Başlangıç Tarihi</p>
          <select name="startMonth" value={exp.startMonth} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Ay</option>
            {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="startYear" value={exp.startYear} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Yıl</option>
            {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <p className="text-sm font-semibold dark:text-white">Bitiş Tarihi</p>
          <select name="endMonth" disabled={exp.currently} value={exp.endMonth} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Ay</option>
            {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="endYear" disabled={exp.currently} value={exp.endYear} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Yıl</option>
            {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex items-center ml-80 pl-64 gap-2 col-span-2">
          <input
            type="checkbox"
            checked={exp.currently}
            onChange={(e) =>
              setExp({ ...exp, currently: e.target.checked })
            }
            className="w-6 h-6 accent-green-500"
          />
          <label className="text-sm text-[18px] text-gray-700 dark:text-gray-300 mb-4">
            Halen bu pozisyonda çalışıyorum
          </label>
        </div>

        <div className="md:col-span-2">
          <textarea name="description" value={exp.description} onChange={handleChange} placeholder="İş Tanımı" className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white" />
        </div>
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

export default StepExperience;
