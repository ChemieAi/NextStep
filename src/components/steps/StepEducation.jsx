import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

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

  // Düzenleme için state
  const [editIndex, setEditIndex] = useState(null);
  const [editedEdu, setEditedEdu] = useState(null);

  const startEdit = (index) => {
    setEditIndex(index);
    setEditedEdu({ ...data.education[index] });
  };

  const saveEdit = () => {
    const updated = [...data.education];
    updated[editIndex] = editedEdu;
    setData({ ...data, education: updated });
    setEditIndex(null);
    setEditedEdu(null);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditedEdu(null);
  };

  const handleEditChange = (e) => {
    const { name, type, checked, value } = e.target;
    setEditedEdu({ ...editedEdu, [name]: type === "checkbox" ? checked : value });
  };
  // Düzenleme için state bitiş

  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setEdu({ ...edu, [name]: type === "checkbox" ? checked : value });
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
  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...data.education];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setData({ ...data, education: updated });
  };

  const moveDown = (index) => {
    if (index === data.education.length - 1) return;
    const updated = [...data.education];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setData({ ...data, education: updated });
  };


  const handleDelete = (index) => {
    const updated = data.education.filter((_, i) => i !== index);
    setData({ ...data, education: updated });
  };

  return (
    <div className="space-y-6">
      {(data.education || []).map((item, index) => (
        <div key={index} className="bg-gray-50 p-4 pt-10 rounded-md border relative dark:bg-gray-700 dark:text-white">
          {/* Sağ üstte sabit buton grubu */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => moveUp(index)}
              title="Yukarı Taşı"
              className="bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
            >
              <ChevronUpIcon className="w-5 h-5 text-gray-100" />
            </button>
            <button
              onClick={() => moveDown(index)}
              title="Aşağı Taşı"
              className="bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
            >
              <ChevronDownIcon className="w-5 h-5 text-gray-100" />
            </button>
            <button
              onClick={() => handleDelete(index)}
              title="Sil"
              className="bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
            >
              <TrashIcon className="w-5 h-5 text-gray-100" />
            </button>
          </div>

          {editIndex === index ? (
            <div className="space-y-2">
              <input
                name="school"
                value={editedEdu.school}
                onChange={handleEditChange}
                placeholder="Okul"
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
              />
              <input
                name="department"
                value={editedEdu.department}
                onChange={handleEditChange}
                placeholder="Bölüm"
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
              />
              {/* Başlangıç */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold dark:text-white">Başlangıç</span>
                <select name="startDay" value={editedEdu.startDay} onChange={handleEditChange} className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white">
                  <option value="">Gün</option>
                  {generateOptions(1, 31).map(d => <option key={d}>{d}</option>)}
                </select>
                <select name="startMonth" value={editedEdu.startMonth} onChange={handleEditChange} className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white">
                  <option value="">Ay</option>
                  {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
                </select>
                <select name="startYear" value={editedEdu.startYear} onChange={handleEditChange} className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white">
                  <option value="">Yıl</option>
                  {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              {/* Bitiş */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold dark:text-white">Bitiş</span>
                <select name="endDay" value={editedEdu.endDay} onChange={handleEditChange} disabled={editedEdu.currently} className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white">
                  <option value="">Gün</option>
                  {generateOptions(1, 31).map(d => <option key={d}>{d}</option>)}
                </select>
                <select name="endMonth" value={editedEdu.endMonth} onChange={handleEditChange} disabled={editedEdu.currently} className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white">
                  <option value="">Ay</option>
                  {generateOptions(1, 12).map(m => <option key={m}>{m}</option>)}
                </select>
                <select name="endYear" value={editedEdu.endYear} onChange={handleEditChange} disabled={editedEdu.currently} className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white">
                  <option value="">Yıl</option>
                  {generateOptions(1980, 2025).map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              {/* Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="currently"
                  checked={editedEdu.currently}
                  onChange={handleEditChange}
                  className="w-5 h-5 accent-green-500"
                />
                <label className="text-sm dark:text-white">Halen devam ediyorum</label>
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdit} className="px-3 py-1 bg-green-600 text-white rounded">Kaydet</button>
                <button onClick={cancelEdit} className="px-3 py-1 bg-gray-500 text-white rounded">İptal</button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-semibold dark:text-white">{item.school} – {item.department}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.startDay}/{item.startMonth}/{item.startYear} -{" "}
                {item.currently ? "Devam ediyor" : `${item.endDay}/${item.endMonth}/${item.endYear}`}
              </p>
              <button title="Düzenle" onClick={() => startEdit(index)} className="absolute top-2 left-2 bg-gray-500 hover:bg-green-700 text-white p-1 rounded">
                <PencilIcon className="w-5 h-5 text-gray-100" />
              </button>
            </>
          )}
        </div>

      ))}

      {/* Yeni giriş alanları */}
      <div className="grid grid-cols-2 gap-4 ">
        <input name="school" value={edu.school} onChange={handleChange} placeholder="Okul Adı" className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white" />
        <input name="department" value={edu.department} onChange={handleChange} placeholder="Bölüm adı" className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white" />

        {/* Start Date */}
        <div className="flex gap-2 col-span-1 max-md:col-span-2">
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
        <div className="flex gap-2 col-span-1 max-md:col-span-2">
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
        <div className="flex items-center lg:ml-80 lg:pl-80 gap-2 col-span-2">
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
