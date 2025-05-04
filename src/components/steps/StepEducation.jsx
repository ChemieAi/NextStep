import { useState } from "react";

const StepEducation = ({ data, setData }) => {
  const [edu, setEdu] = useState({
    school: "",
    department: "",
    startDay: "",
    startMonth: "",
    startYear: "",
    endDay: "",
    endMonth: "",
    endYear: "",
    currently: false,
  });

  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setEdu({ ...edu, [name]: type === "checkbox" ? checked : value });
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...data.education]; // veya experience
    updated[index][field] = value;
    setData({ ...data, education: updated }); // veya experience
  };


  const handleAdd = () => {
    if (!edu.school || !edu.department) return;
    const updated = [...(data.education || []), edu];
    setData({ ...data, education: updated });
    setEdu({
      school: "",
      department: "",
      startDay: "",
      startMonth: "",
      startYear: "",
      endDay: "",
      endMonth: "",
      endYear: "",
      currently: false,
    });
  };

  const handleDelete = (index) => {
    const updated = data.education.filter((_, i) => i !== index);
    setData({ ...data, education: updated });
  };

  return (
    <div className="space-y-6 ">
      {/* Listelenmiş eğitimler */}
      {(data.education || []).map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-md border relative dark:bg-gray-700 dark:text-white">
          <p className="font-semibold dark:text-white">{item.school} – {item.department}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {item.startDay}/{item.startMonth}/{item.startYear} -{" "} {item.currently ? "Devam ediyor" : `${item.endDay}/${item.endMonth}/${item.endYear}`}
          </p>

          <button
            onClick={() => handleDelete(index)}
            className="text-white bg-green-300 px-3 py-1 rounded hover:bg-green-600 absolute top-2 right-2"
            title="Sil"
          >
            🗑️
          </button>
        </div>
      ))}

      {/* Yeni giriş alanları */}
      <div className="grid md:grid-cols-2 gap-4 ">
        <input name="school" value={edu.school} onChange={handleChange} placeholder="Okul Adı" className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white" />
        <input name="department" value={edu.department} onChange={handleChange} placeholder="Bölüm adı" className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white" />

        {/* Start Date */}
        <div className="flex gap-2 col-span-1">
          <p className="font-semibold dark:text-white">Başlangıç Tarihi</p>
          <select name="startDay" value={edu.startDay} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Gün</option>
            {generateOptions(1, 31).map(d => <option key={d}>{d}</option>)}
          </select>
          <select name="startMonth" value={edu.startMonth} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Ay</option>
            {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="startYear" value={edu.startYear} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Yıl</option>
            {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        {/* End Date */}
        <div className="flex gap-2 col-span-1">
          <p className="font-semibold dark:text-white">Bitiş Tarihi</p>
          <select name="endDay" disabled={edu.currently} value={edu.endDay} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Gün</option>
            {generateOptions(1, 31).map(d => <option key={d}>{d}</option>)}
          </select>
          <select name="endMonth" disabled={edu.currently} value={edu.endMonth} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Ay</option>
            {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="endYear" disabled={edu.currently} value={edu.endYear} onChange={handleChange} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white">
            <option value="">Yıl</option>
            {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex items-center ml-80 pl-80 gap-2 col-span-2">
          <input
            type="checkbox"
            name="currently"
            checked={edu.currently}
            onChange={handleChange}
            className="w-6 h-6 accent-green-500"
          />
          <label className="text-sm text-[18px] text-gray-700 dark:text-gray-300 mb-4">
            Halen devam ediyorum
          </label>
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

export default StepEducation;
