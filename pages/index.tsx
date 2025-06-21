import { useState, useEffect, Fragment } from 'react';
import React from 'react';
import AIPromptModal from '../components/AIPromptModal';
import LocaleCodesModal from '../components/LocaleCodesModal';
import { GithubIcon } from '../components/icons/GithubIcon';

// As per PRD 5.2
interface ListingPayload {
  language: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

const HomePage = () => {
  const [remoteData, setRemoteData] = useState<ListingPayload[]>([]);
  const [localDraft, setLocalDraft] = useState<ListingPayload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAIPromptModalOpen, setAIPromptModalOpen] = useState(false);
  const [isLocaleCodesModalOpen, setLocaleCodesModalOpen] = useState(false);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initializeCheckedState = (data: ListingPayload[]) => {
    const initialCheckedState = data.reduce((acc, item) => {
      acc[item.language] = false;
      return acc;
    }, {} as { [key: string]: boolean });
    setChecked(initialCheckedState);
  };

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/listings');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Error: ${res.status}`);
        }
        const data: ListingPayload[] = await res.json();
        setRemoteData(data);
        // Create a deep copy for the draft state to avoid direct mutation
        setLocalDraft(JSON.parse(JSON.stringify(data)));
        initializeCheckedState(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleGenerateForTranslation = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(remoteData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to generate file.');
      }

      setSuccessMessage(result.message);

    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleImportTranslations = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch('/api/import');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to import translations.');
      }

      const newDraft: ListingPayload[] = await res.json();
      if (newDraft.length === 0 && remoteData.length > 0) {
        setSuccessMessage('Import finished. The pending.txt file was empty or not found. No changes have been made to the draft.');
        return;
      }
      
      const updatedDraft = localDraft.map(original => {
          const found = newDraft.find(n => n.language === original.language);
          return found || original;
      });

      setLocalDraft(updatedDraft);
      setSuccessMessage('Translations imported successfully.');

    } catch (e: any) {
      setError(`Import failed: ${e.message}`);
    }
  };

  const handleUpdateToPlayStore = async () => {
    const listingsToUpdate = localDraft.filter(draft => checked[draft.language]);

    if (listingsToUpdate.length === 0) {
      alert('Please select at least one language to update.');
      return;
    }

    if (confirm('Are you sure you want to update the selected listings on the Play Store? This action is permanent.')) {
      setError(null);
      setSuccessMessage(null);
      try {
        const res = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ remoteData, localDraft: listingsToUpdate }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update listings.');
        }

        alert('Update successful! The remote data will now be refreshed.');
        setSuccessMessage(null);
        
        // Refresh data from server
        const fetchRes = await fetch('/api/listings');
        const data: ListingPayload[] = await fetchRes.json();
        setRemoteData(data);
        setLocalDraft(JSON.parse(JSON.stringify(data)));
        initializeCheckedState(data);

      } catch (e: any) {
        setError(`Update failed: ${e.message}`);
      }
    }
  };

  const handleShowLocaleCodes = () => {
    setLocaleCodesModalOpen(true);
  };

  const handleDraftChange = (index: number, field: keyof ListingPayload, value: string) => {
    const updatedDraft = [...localDraft];
    updatedDraft[index] = { ...updatedDraft[index], [field]: value };
    setLocalDraft(updatedDraft);
  };

  const handleCheckChange = (language: string) => {
    setChecked(prevState => ({
      ...prevState,
      [language]: !prevState[language],
    }));
  };

  const hasCheckedItems = Object.values(checked).some(v => v);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-teal-400">Google Play Batch Listing Edit</h1>
            <a href="https://github.com/himphen/google-play-batch-listing-edit" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors">
              <GithubIcon className="h-6 w-6" />
            </a>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleShowLocaleCodes}
              className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition"
            >
              Show Locale Codes
            </button>
            <button
              onClick={() => setAIPromptModalOpen(true)}
              className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition"
            >
              Get AI Prompt
            </button>
            <button
              onClick={handleGenerateForTranslation}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
            >
              Generate for Translation
            </button>
            <button
              onClick={handleImportTranslations}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
            >
              Import Translations
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-4 pb-32">
        {loading && <p>Loading data from Google Play...</p>}
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md mb-4">{error}</p>}
        {successMessage && <p className="text-green-400 bg-green-900/50 p-3 rounded-md mb-4">{successMessage}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            {/* Headers */}
            <h2 className="text-xl font-semibold mb-4 text-slate-300">Remote Data (Read-only)</h2>
            <h2 className="text-xl font-semibold mb-4 text-slate-300">Local Draft (Editable)</h2>

            {/* Content Items */}
            {remoteData.map((listing, index) => {
              const draft = localDraft[index];
              if (!draft) return null;

              return (
                <Fragment key={listing.language}>
                  {/* Remote Column Cell */}
                  <div
                    className="bg-slate-800 border border-slate-700 p-4 rounded-lg mb-6 flex flex-col cursor-pointer"
                    onClick={() => handleCheckChange(listing.language)}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-400 mr-3"
                        checked={checked[listing.language] || false}
                        onChange={() => handleCheckChange(listing.language)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <h3 className="font-bold text-lg text-slate-200">{listing.language}</h3>
                    </div>
                    <div className="mt-2 flex-grow flex flex-col space-y-2">
                      <p className="font-semibold p-2 border border-transparent min-h-[40px]">{listing.title}</p>
                      <p className="text-sm text-slate-400 p-2 border border-transparent min-h-[56px]">{listing.shortDescription}</p>
                      <p className="text-sm mt-2 whitespace-pre-wrap p-2 border border-slate-700 rounded-md bg-slate-900 h-40 overflow-y-auto">{listing.fullDescription}</p>
                    </div>
                  </div>

                  {/* Draft Column Cell */}
                  <div
                    className="bg-slate-800 border border-slate-700 p-4 rounded-lg mb-6 flex flex-col cursor-pointer"
                    onClick={() => handleCheckChange(listing.language)}
                  >
                    <h3 className="font-bold text-lg text-transparent select-none mb-2">{listing.language}</h3> {/* Spacer */}
                    <div className="mt-2 flex-grow flex flex-col space-y-2">
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => handleDraftChange(index, 'title', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-slate-200 focus:ring-teal-400 focus:border-teal-400"
                      />
                      <textarea
                        value={draft.shortDescription}
                        onChange={(e) => handleDraftChange(index, 'shortDescription', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-slate-200 focus:ring-teal-400 focus:border-teal-400"
                        rows={2}
                      />
                      <textarea
                        value={draft.fullDescription}
                        onChange={(e) => handleDraftChange(index, 'fullDescription', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full p-2 border border-slate-600 rounded-md bg-slate-700 text-slate-200 focus:ring-teal-400 focus:border-teal-400 h-40"
                      />
                    </div>
                  </div>
                </Fragment>
              )
            })}
          </div>
        )}
        
        {!loading && !error && (
            <footer className="fixed bottom-0 right-0 p-8">
                <button
                    onClick={handleUpdateToPlayStore}
                    disabled={!hasCheckedItems}
                    className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition text-lg font-semibold disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed shadow-lg"
                >
                    Update to Play Store
                </button>
            </footer>
        )}
      </main>
      <AIPromptModal isOpen={isAIPromptModalOpen} onClose={() => setAIPromptModalOpen(false)} />
      <LocaleCodesModal isOpen={isLocaleCodesModalOpen} onClose={() => setLocaleCodesModalOpen(false)} locales={remoteData.map(d => d.language)} />
    </div>
  );
};

export default HomePage; 