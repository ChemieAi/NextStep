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
  });

  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleChange = (e) => {
    setExp({ ...exp, [e.target.name]: e.target.value });
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
        <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
          <p className="font-semibold">{item.company} – {item.position}</p>
          <p className="text-sm text-gray-600">
            {item.startMonth}/{item.startYear} - {item.endMonth}/{item.endYear}
          </p>
          <p className="text-sm mt-2 text-gray-700">{item.description}</p>
          <button
            onClick={() => handleDelete(index)}
            className="absolute top-2 right-2 text-red-600 text-sm hover:underline"
          >
            Sil
          </button>
        </div>
      ))}

      {/* Yeni giriş alanı */}
      <div className="grid md:grid-cols-2 gap-4">
        <input name="company" value={exp.company} onChange={handleChange} placeholder="Company" className="p-3 border rounded bg-gray-50" />
        <input name="position" value={exp.position} onChange={handleChange} placeholder="Position" className="p-3 border rounded bg-gray-50" />

        {/* Tarihler */}
        <div className="flex gap-2">
          <select name="startMonth" value={exp.startMonth} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Month</option>
            {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="startYear" value={exp.startYear} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Year</option>
            {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <select name="endMonth" value={exp.endMonth} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Month</option>
            {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="endYear" value={exp.endYear} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Year</option>
            {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <textarea name="description" value={exp.description} onChange={handleChange} placeholder="Job Description" className="w-full p-3 border rounded bg-gray-50" />
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="w-full border-2 border-orange-500 text-orange-500 py-2 rounded hover:bg-orange-50 font-semibold"
      >
        EKLE
      </button>
    </div>
  );
};

export default StepExperience;
