import React from 'react';

export function LanguageSelect() {
  return (
    <div className="w-[256px]">
      <select
        className="w-full border-2 border-gray-300 py-2 px-4 rounded-lg text-[14px] focus:outline-none focus:border-indigo-500 transition-colors bg-white"
        defaultValue=""
      >
        <option value="" disabled>
          Select a language
        </option>
        {languages.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const languages = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "es",
    label: "Spanish",
  },
  {
    value: "fr",
    label: "French",
  },
  {
    value: "de",
    label: "German",
  },
  {
    value: "zh",
    label: "Chinese",
  },
  {
    value: "ja",
    label: "Japanese",
  },
  {
    value: "ru",
    label: "Russian",
  },
  {
    value: "hi",
    label: "Hindi",
  },
];
