import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

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

  // Düzenleme için state
  const [editIndex, setEditIndex] = useState(null);
  const [editedExp, setEditedExp] = useState(null);

  const startEdit = (index) => {
    setEditIndex(index);
    setEditedExp({ ...data.experience[index] });
  };

  const saveEdit = () => {
    const updated = [...data.experience];
    updated[editIndex] = editedExp;
    setData({ ...data, experience: updated });
    setEditIndex(null);
    setEditedExp(null);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditedExp(null);
  };

  const handleEditChange = (e) => {
    const { name, type, checked, value } = e.target;
    setEditedExp({ ...editedExp, [name]: type === "checkbox" ? checked : value });
  };
  // Düzenleme için state bitiş

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

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...data.experience];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setData({ ...data, experience: updated });
  };

  const moveDown = (index) => {
    if (index === data.experience.length - 1) return;
    const updated = [...data.experience];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setData({ ...data, experience: updated });
  };


  return (
    <div className="space-y-6">
      {(data.experience || []).map((item, index) => (
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
                name="company"
                value={editedExp.company}
                onChange={handleEditChange}
                placeholder="Şirket"
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
              />
              <input
                name="position"
                value={editedExp.position}
                onChange={handleEditChange}
                placeholder="Pozisyon"
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
              />
              {/* Başlangıç Tarihi */}
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold dark:text-white">Başlangıç</p>
                <select
                  name="startMonth"
                  value={editedExp.startMonth}
                  onChange={handleEditChange}
                  className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">Ay</option>
                  {generateOptions(1, 12).map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <select
                  name="startYear"
                  value={editedExp.startYear}
                  onChange={handleEditChange}
                  className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">Yıl</option>
                  {generateOptions(1980, 2025).map(y => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Bitiş Tarihi */}
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold dark:text-white">Bitiş</p>
                <select
                  name="endMonth"
                  value={editedExp.endMonth}
                  onChange={handleEditChange}
                  disabled={editedExp.currently}
                  className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">Ay</option>
                  {generateOptions(1, 12).map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <select
                  name="endYear"
                  value={editedExp.endYear}
                  onChange={handleEditChange}
                  disabled={editedExp.currently}
                  className="p-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
                >
                  <option value="">Yıl</option>
                  {generateOptions(1980, 2025).map(y => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="currently"
                  checked={editedExp.currently}
                  onChange={handleEditChange}
                  className="w-5 h-5 accent-green-500"
                />
                <label className="text-sm dark:text-white">
                  Halen bu pozisyonda çalışıyorum
                </label>
              </div>

              <textarea
                name="description"
                value={editedExp.description}
                onChange={handleEditChange}
                placeholder="Açıklama"
                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-600 dark:text-white"
              />
              <div className="flex gap-2">
                <button onClick={saveEdit} className="px-3 py-1 bg-green-600 text-white rounded">Kaydet</button>
                <button onClick={cancelEdit} className="px-3 py-1 bg-gray-500 text-white rounded">İptal</button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-semibold dark:text-white ">{item.company} – {item.position}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.startMonth}/{item.startYear} -{" "}
                {item.currently ? "Devam ediyor" : `${item.endMonth}/${item.endYear}`}
              </p>
              <p className="text-sm mt-2 text-gray-700 dark:text-gray-400">{item.description}</p>

              <button title="Düzenle" onClick={() => startEdit(index)} className="absolute top-2 left-2 bg-gray-500 hover:bg-green-700 text-white p-1 rounded">
                <PencilIcon className="w-5 h-5 text-gray-100" />
              </button>
            </>
          )}
        </div>

      ))}

      {/* Yeni giriş alanı */}
      <div className="grid md:grid-cols-2 gap-4">
        <input name="company" value={exp.company} onChange={handleChange} placeholder="Şirket" className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white" />
        <input name="position" value={exp.position} onChange={handleChange} placeholder="Pozisyon" className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white" />

        {/* Tarihler */}
        <div className="flex gap-2 max-md:col-span-2">
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
        <div className="flex gap-2 max-md:col-span-2">
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
        <div className="flex items-center lg:ml-80 lg:pl-64 gap-2 col-span-2">
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

        <div className="col-span-2">
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
