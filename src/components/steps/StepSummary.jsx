import React from "react";
import { useTranslation } from "react-i18next";

const StepSummary = ({ data, setData }) => {
  const { t } = useTranslation();

  const handleChange = (e) => {
    setData({ ...data, summary: e.target.value });
  };

  return (
    <div>
      <label className="block font-semibold mb-2 dark:text-white">
        {t("stepSummary.label")}
      </label>
      <textarea
        value={data.summary || ""}
        onChange={handleChange}
        rows={6}
        placeholder={t("stepSummary.placeholder")}
        className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
};

export default StepSummary;
