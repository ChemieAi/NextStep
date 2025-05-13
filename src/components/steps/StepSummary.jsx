import React from "react";

const StepSummary = ({ data, setData }) => {
  const handleChange = (e) => {
    setData({ ...data, summary: e.target.value });
  };

  return (
    <div>
      <label className="block font-semibold mb-2 dark:text-white">Kısa Profil / Özet</label>
      <textarea
        value={data.summary || ""}
        onChange={handleChange}
        rows={6}
        placeholder="Kendinizi birkaç cümle ile tanıtın..."
        className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
};

export default StepSummary;
