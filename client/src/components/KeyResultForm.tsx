import { useContext, useState } from 'react';
import type { KeyResultType } from '../types/okr_types';
import { KeyResultContext } from '../providers/KeyResultProvider';
import { deleteKeyResults } from '../services/okr.service';

type Props = {
    objectiveId?: string;
};

const KeyResultForm = ({ objectiveId = '' }: Props) => {
    const [keyResult, setKeyResult] = useState<Partial<KeyResultType>>({
        id: '',
        description: '',
        progress: 0,
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(KeyResultContext);

    if (!context) {
        throw new Error('KeyResultForm must be used within KeyResultProvider');
    }

    const {
        keyResultList,
        addKeyResult,
        updateKeyResult,
        deleteKeyResult,
    } = context;

const handleAddOrUpdate = async () => {
  if (!keyResult.description?.trim()) return;

  setIsLoading(true);

  try {
    if (editingId) {
      const updatePromise = updateKeyResult(objectiveId, editingId, {
        description: keyResult.description,
        progress: keyResult.progress ?? 0,
      });
      
      await updatePromise;

      await new Promise(resolve => setTimeout(resolve, 100));

      setEditingId(null);
      setKeyResult({
        id: '',
        description: '',
        progress: 0,
      });
    } else {
      await addKeyResult(objectiveId, {
        description: keyResult.description,
        progress: keyResult.progress ?? 0,
      });

      setKeyResult({
        id: '',
        description: '',
        progress: 0,
      });
    }
  } finally {
    setIsLoading(false);
  }
};


    const handleDelete = async (krId: string) => {
        if (!confirm('Are you sure you want to delete this key result?')) {
            return;
        }

        setIsLoading(true);
        try {
            if (objectiveId) {
                const krToDelete = keyResultList.find(kr => kr.id === krId);
                if (krToDelete) {
                    await deleteKeyResults(objectiveId, krId);
                }
            }
            deleteKeyResult(krId);
        } catch (error) {
            console.error('Error deleting key result:', error);
            alert('Error deleting key result');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <span className="text-xl">🎯</span>
                </div>
                <h3 className="text-sm font-black text-indigo-900 uppercase tracking-[0.15em]">
                    Key Results
                </h3>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Describe a key result (min 5 characters)"
                    value={keyResult.description}
                    onChange={(e) =>
                        setKeyResult((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
                    }
                    disabled={isLoading}
                    className="w-full border-2 border-gray-100 bg-white p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400 text-gray-700 font-medium disabled:opacity-50"
                />

                <input
                    type="number"
                    placeholder="Progress (0–100)"
                    value={keyResult.progress}
                    onChange={(e) =>
                        setKeyResult((prev) => ({
                            ...prev,
                            progress: Number(e.target.value),
                        }))
                    }
                    disabled={isLoading}
                    className="w-full border-2 border-gray-100 bg-white p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400 text-gray-700 font-medium disabled:opacity-50"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => {
                        setKeyResult({
                            id: '',
                            description: '',
                            progress: 0,
                        });
                        setEditingId(null);
                    }}
                    disabled={isLoading}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl transition-all duration-300 text-sm disabled:opacity-50"
                >
                    Clear
                </button>

                <button
                    type="button"
                    onClick={handleAddOrUpdate}
                    disabled={isLoading}
                    className="w-full bg-white border-2 border-indigo-100 hover:border-indigo-600 text-indigo-600 font-bold py-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-indigo-100 text-sm disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : (editingId ? 'Update' : 'Add')}
                </button>
            </div>

            <div className="space-y-3 pt-2">
                {keyResultList.map((kr, index) => {
                    const displayKr = editingId === kr.id ? keyResult : kr;
                    return (
                    <div
                        key={kr.id}
                        className={`bg-white border-2 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center ${
                            editingId === kr.id 
                                ? 'border-indigo-500 bg-indigo-50' 
                                : 'border-gray-100'
                        }`}
                    >
                        <div className="flex-1">
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                                Key Result #{index + 1}
                            </p>
                            <p className="text-gray-800 font-semibold leading-snug">
                                {displayKr.description}
                            </p>
                        </div>

                        <div className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-black">
                            {displayKr.progress}%
                        </div>

                        <div className="flex gap-2 ml-2">
                            <button
                                type="button"
                                className={`text-white px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50 ${
                                    editingId === kr.id
                                        ? 'bg-orange-500'
                                        : 'bg-blue-600'
                                }`}
                                disabled={isLoading}
                                onClick={() => {
                                    if (editingId === kr.id) {
                                        setEditingId(null);
                                        setKeyResult({
                                            id: '',
                                            description: '',
                                            progress: 0,
                                        });
                                    } else {
                                        setKeyResult(kr);
                                        setEditingId(kr.id);
                                    }
                                }}
                            >
                                {editingId === kr.id ? 'Cancel' : 'Edit'}
                            </button>

                            <button
                                type="button"
                                className="bg-red-500 text-white px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
                                disabled={isLoading || editingId === kr.id}
                                onClick={() => handleDelete(kr.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KeyResultForm;
