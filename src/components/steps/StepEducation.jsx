import { useState } from "react";

const StepEducation = ({ data, setData }) => {
  const [edu, setEdu] = useState({
    school: "",
    country: "",
    startDay: "",
    startMonth: "",
    startYear: "",
    endDay: "",
    endMonth: "",
    endYear: "",
  });

  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleChange = (e) => {
    setEdu({ ...edu, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!edu.school || !edu.country) return;
    const updated = [...(data.education || []), edu];
    setData({ ...data, education: updated });
    setEdu({
      school: "",
      country: "",
      startDay: "",
      startMonth: "",
      startYear: "",
      endDay: "",
      endMonth: "",
      endYear: "",
    });
  };

  const handleDelete = (index) => {
    const updated = data.education.filter((_, i) => i !== index);
    setData({ ...data, education: updated });
  };

  return (
    <div className="space-y-6">
      {/* Listelenmiş eğitimler */}
      {(data.education || []).map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-md border relative">
          <p className="font-semibold">{item.school} – {item.country}</p>
          <p className="text-sm text-gray-600">
            {item.startDay}/{item.startMonth}/{item.startYear} - {item.endDay}/{item.endMonth}/{item.endYear}
          </p>
          <button
            onClick={() => handleDelete(index)}
            className="absolute top-2 right-2 text-red-600 text-sm hover:underline"
          >
            Sil
          </button>
        </div>
      ))}

      {/* Yeni giriş alanları */}
      <div className="grid md:grid-cols-2 gap-4">
        <input name="school" value={edu.school} onChange={handleChange} placeholder="School Name" className="p-3 border rounded bg-gray-50" />
        <input name="country" value={edu.country} onChange={handleChange} placeholder="Country" className="p-3 border rounded bg-gray-50" />

        {/* Start Date */}
        <div className="flex gap-2 col-span-1">
          <select name="startDay" value={edu.startDay} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Day</option>
            {generateOptions(1, 31).map(d => <option key={d}>{d}</option>)}
          </select>
          <select name="startMonth" value={edu.startMonth} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Month</option>
            {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="startYear" value={edu.startYear} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Year</option>
            {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        {/* End Date */}
        <div className="flex gap-2 col-span-1">
          <select name="endDay" value={edu.endDay} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Day</option>
            {generateOptions(1, 31).map(d => <option key={d}>{d}</option>)}
          </select>
          <select name="endMonth" value={edu.endMonth} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Month</option>
            {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="endYear" value={edu.endYear} onChange={handleChange} className="p-2 border rounded bg-gray-50">
            <option value="">Year</option>
            {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
          </select>
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

export default StepEducation;
