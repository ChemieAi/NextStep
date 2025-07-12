import { useState } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTranslation } from "react-i18next";

const StepSkills = ({ data, setData }) => {
  const [skillInput, setSkillInput] = useState("");
  const [lang, setLang] = useState({ name: "", level: "" });
  const [editMode, setEditMode] = useState(false); // Yeni: Edit modu
  const { t } = useTranslation();

  const addSkill = () => {
    if (!skillInput) return;
    setData({ ...data, skills: [...(data.skills || []), skillInput] });
    setSkillInput("");
  };

  const removeSkill = (i) => {
    const updated = data.skills.filter((_, idx) => idx !== i);
    setData({ ...data, skills: updated });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updated = Array.from(data.skills);
    const [reordered] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, reordered);
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

  const moveLangUp = (i) => {
    if (i === 0) return;
    const updated = [...data.languages];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    setData({ ...data, languages: updated });
  };

  const moveLangDown = (i) => {
    if (i === data.languages.length - 1) return;
    const updated = [...data.languages];
    [updated[i + 1], updated[i]] = [updated[i], updated[i + 1]];
    setData({ ...data, languages: updated });
  };

  return (
    <div className="space-y-6">
      {/* Skills */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{t("skills.title")}</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-sm text-white bg-gray-600 px-3 py-1 rounded hover:bg-green-700"
          >
            {editMode ? t("skills.done") : t("skills.edit")}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-center mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder={t("skills.placeholder")}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={addSkill}
            title={t("skills.addTitle")}
            className="bg-green-500 dark:bg-green-600 text-white px-3 py-2 mb-4 rounded hover:bg-green-600 dark:hover:bg-green-700 font-semibold "
          >
            <PlusIcon className="w-5 h-5 inline-block" />
          </button>
        </div>

        {/* Drag & Drop Alanı */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="skills">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${editMode ? "space-y-2" : "flex flex-wrap gap-2"}`}
              >
                {(data.skills || []).map((s, i) => (
                  <Draggable key={s + i} draggableId={s + i} index={i} isDragDisabled={!editMode}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-gray-500 dark:bg-gray-600 text-gray-100 px-3 py-1 rounded-full flex items-center justify-between ${editMode ? "w-full" : ""
                          }`}
                      >
                        <span>{s}</span>
                        <button
                          onClick={() => removeSkill(i)}
                          title={t("skills.delete")}
                          className="text-sm ml-1 font-semibold text-red-400 dark:text-red-300"
                        >
                          <XCircleIcon className="w-5 h-5 inline-block" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold mb-2">{t("skills.languages")}</h3>
        <div className="grid md:grid-cols-2 gap-2 mb-3">
          <input
            type="text"
            name="name"
            value={lang.name}
            onChange={(e) => setLang({ ...lang, name: e.target.value })}
            placeholder={t("skills.languagePlaceholder")}
            className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
          <select
            name="level"
            value={lang.level}
            onChange={(e) => setLang({ ...lang, level: e.target.value })}
            className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t("skills.levels.select")}</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
            <option value="Native">Native</option>
          </select>
        </div>
        <button
          onClick={addLang}
          className="border-2 border-green-500 dark:border-green-400 text-green-500 dark:text-green-400 px-4 py-1 rounded hover:bg-green-100 font-semibold dark:hover:bg-gray-600"
        >
          {t("skills.addLanguage")}
        </button>

        <div className="mt-3 space-y-2">
          {(data.languages || []).map((l, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-50 p-2 rounded border dark:bg-gray-700 dark:text-white"
            >
              <span>
                {l.name} – {l.level}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => moveLangUp(i)}
                  className="bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
                  title={t("skills.moveUp")}
                >
                  <ChevronUpIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveLangDown(i)}
                  className="bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
                  title={t("skills.moveDown")}
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeLang(i)}
                  title={t("skills.delete")}
                  className="bg-gray-500 hover:bg-green-700 text-white p-1 rounded"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSkills;
