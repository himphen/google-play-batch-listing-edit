import React from 'react';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIPromptModal: React.FC<AIPromptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const promptText = `Please translate the content I provide. Your output must strictly follow this format: each language block must be separated by '---'. The line immediately following '---' must be the language code, followed by a new line with a JSON object containing the translated 'title', 'shortDescription', and 'fullDescription'. Do not add any extra text or explanations.

Example of the required output format:
---
en-US
{
  "title": "Your Translated Title",
  "shortDescription": "Your translated short description.",
  "fullDescription": "Your translated full description."
}
---
zh-TW
{
  "title": "你的翻譯標題",
  "shortDescription": "你的翻譯簡短描述。",
  "fullDescription": "你的翻譯完整描述。"
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    alert('Prompt copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl max-w-2xl w-full text-slate-200">
        <h2 className="text-xl font-bold mb-4 text-teal-400">AI Translation Prompt</h2>
        <textarea
          readOnly
          className="w-full h-64 p-2 border border-slate-600 rounded-md bg-slate-900 font-mono text-sm text-slate-300"
          value={promptText}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
          >
            Copy Prompt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPromptModal; 