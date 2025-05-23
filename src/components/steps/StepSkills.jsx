import { useState } from "react";

const StepSkills = ({ data, setData }) => {
  const [skillInput, setSkillInput] = useState("");
  const [lang, setLang] = useState({ name: "", level: "" });

  const addSkill = () => {
    if (!skillInput) return;
    setData({ ...data, skills: [...(data.skills || []), skillInput] });
    setSkillInput("");
  };

  const removeSkill = (i) => {
    const updated = data.skills.filter((_, idx) => idx !== i);
    setData({ ...data, skills: updated });
  };

  const addLang = () => {
    if (!lang.name || !lang.level) return;
    setData({ ...data, languages: [...(data.languages || []), lang] });
    setLang({ name: "", level: "" });
  };

  const removeLang = (i) => {
    const updated = data.languages.filter((_, idx) => idx !== i);
    setData({ ...data, languages: updated });
  };

  return (
    <div className="space-y-6">
      {/* Skills */}
      <div>
        <h3 className="text-lg font-semibold mb-2 ">Yetenekler</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g. React, JavaScript"
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
          <button onClick={addSkill} title="Ekle" className="bg-green-500 dark:bg-green-600 text-white px-4 rounded hover:bg-green-600 dark:hover:bg-green-700 font-semibold ">
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2 ">
          {(data.skills || []).map((s, i) => (
            <div key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2 ">
              {s}
              <button onClick={() => removeSkill(i)} title="Sil" className="text-sm font-semibold text-red-600">X</button>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Dil</h3>
        <div className="grid md:grid-cols-2 gap-2 mb-3">
          <input
            type="text"
            name="name"
            value={lang.name}
            onChange={(e) => setLang({ ...lang, name: e.target.value })}
            placeholder="Dil (e.g. English)"
            className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
          <select
            name="level"
            value={lang.level}
            onChange={(e) => setLang({ ...lang, level: e.target.value })}
            className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seviye</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Native">Native</option>
          </select>
        </div>
        <button onClick={addLang} className="border-2 border-green-500 dark:border-green-400 text-green-500 dark:text-green-400 px-4 py-1 rounded hover:bg-green-100 font-semibold dark:hover:bg-gray-600">
          Dil Ekle
        </button>
        <div className="mt-3 space-y-2">
          {(data.languages || []).map((l, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded border dark:bg-gray-700 dark:text-white">
              <span>{l.name} – {l.level}</span>
              <button onClick={() => removeLang(i)} title="Sil" className="text-white bg-green-300 px-3 py-1 rounded hover:bg-green-500 absolute:right">🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSkills;
