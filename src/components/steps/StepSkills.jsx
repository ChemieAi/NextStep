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
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g. React, JavaScript"
            className="w-full p-2 border rounded bg-gray-50"
          />
          <button onClick={addSkill} className="bg-green-500 text-white px-4 rounded hover:bg-green-600">
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.skills || []).map((s, i) => (
            <div key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
              {s}
              <button onClick={() => removeSkill(i)} className="text-sm text-red-600">X</button>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Languages</h3>
        <div className="grid md:grid-cols-2 gap-2 mb-3">
          <input
            type="text"
            name="name"
            value={lang.name}
            onChange={(e) => setLang({ ...lang, name: e.target.value })}
            placeholder="Language (e.g. English)"
            className="p-2 border rounded bg-gray-50"
          />
          <select
            name="level"
            value={lang.level}
            onChange={(e) => setLang({ ...lang, level: e.target.value })}
            className="p-2 border rounded bg-gray-50"
          >
            <option value="">Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Native">Native</option>
          </select>
        </div>
        <button onClick={addLang} className="border-2 border-green-500 text-green-500 px-4 py-1 rounded hover:bg-green-100 font-semibold">
          Add Language
        </button>
        <div className="mt-3 space-y-2">
          {(data.languages || []).map((l, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
              <span>{l.name} – {l.level}</span>
              <button onClick={() => removeLang(i)} className="text-sm text-red-600">Sil</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSkills;
