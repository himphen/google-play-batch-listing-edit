import React from 'react';

interface LocaleCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  locales: string[];
}

const LocaleCodesModal: React.FC<LocaleCodesModalProps> = ({ isOpen, onClose, locales }) => {
  if (!isOpen) return null;

  const localeText = locales.join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(localeText);
    alert('Locales copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl max-w-md w-full text-slate-200">
        <h2 className="text-xl font-bold mb-4 text-teal-400">Locale Codes</h2>
        <textarea
          readOnly
          className="w-full h-48 p-2 border border-slate-600 rounded-md bg-slate-900 font-mono text-sm text-slate-300"
          value={localeText}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
          >
            Copy Codes
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

export default LocaleCodesModal; 