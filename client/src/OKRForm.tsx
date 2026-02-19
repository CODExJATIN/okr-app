import {useContext, useEffect, useState} from 'react';

import KeyResultForm from './components/KeyResultForm.tsx';
import {KeyResultContext} from './providers/KeyResultProvider.tsx';
import type {OKRType} from './types/okr_types.tsx';
import {createOkr, updateOkr, createKeyResults, generateOkr} from './services/okr.service.ts';
import FormSkeleton from "./components/FormSkeleton.tsx";

interface OKRFormProps {
    onSuccess: () => void;
    setOkrs: (value: ((prevState: OKRType[]) => OKRType[]) | OKRType[]) => void;
    editingOkr: OKRType | null;
}

function OKRForm({onSuccess, setOkrs, editingOkr}: OKRFormProps) {
    const [objective, setObjective] = useState('');
    const context = useContext(KeyResultContext);
    const [loading, setLoading] = useState(false);

    if (!context) {
        throw new Error('OKRForm must be used within KeyResultProvider');
    }

    const {keyResultList, resetKeyResults, setAllKeyResults} = context;

    useEffect(() => {
        if (editingOkr) {
            setObjective(editingOkr.title);
            setAllKeyResults(editingOkr.keyResults);
        }
    }, [editingOkr]);

    function addObjective() {
        if (!objective.trim()) {
            alert('Please enter an objective');
            return;
        }

        setLoading(true);

        if (editingOkr) {
            updateOkr({id: editingOkr.id, title: objective})
                .then((response) => {

                    const updatedOkr = {...response};
                    setOkrs((prev) => prev.map((okr) => (okr.id === editingOkr.id ? updatedOkr : okr)));

                    resetKeyResults();
                    setObjective('');
                    onSuccess();
                })
                .catch((err) => {
                    console.error(err);
                    alert('Error Updating OKR');
                })
                .finally(() => setLoading(false));

            return;
        }

        createOkr({title: objective},keyResultList)
            .then(async (response) => {

                setOkrs((prev) => [response, ...prev]);

                if (keyResultList.length > 0) {
                        setOkrs((prev) =>
                            prev.map((okr) =>
                                okr.id === response.id
                                    ? {...okr, keyResults: keyResultList}
                                    : okr
                            )
                        );
                }

                resetKeyResults();
                setObjective('');
                onSuccess();
            })
            .catch((err) => {
                console.error(err);
                alert('Error creating okr');
            })
            .finally(() => setLoading(false));
    }

    if (loading) {
        return <FormSkeleton/>
    }

    async function handleGeneratingOkr() {

        if(!objective) {
            alert('Please enter an objective prompt');
            return;
        }
        setLoading(true);

        try {
            const response = await generateOkr(objective);
            setObjective(response.title);
            setAllKeyResults(response.keyResults);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }


    }

    return (
        <form
            className="w-full p-6 selection:bg-indigo-100 selection:text-indigo-900"
            onSubmit={(e) => {
                e.preventDefault();
                addObjective();
            }}
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">OKR Planner</h2>
                <p className="text-gray-400 font-medium text-sm">Define your path to success</p>
            </div>

            <div className="mb-8">
                <label className="block text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4 ml-1">
                    Main Objective
                </label>
                <div className="relative group">
          <span
              className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl transition-transform group-focus-within:scale-125 duration-300">

          </span>
                    <input
                        type="text"
                        placeholder="What's the big goal?"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        className="w-full border-2 border-gray-100 bg-gray-50/50 py-4 pl-16 pr-16 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all duration-300 placeholder-gray-400 text-gray-800 text-lg font-semibold shadow-inner"
                    />
                    <button
                        type={'button'}
                        onClick={handleGeneratingOkr}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl transition-transform group-focus-within:scale-125 duration-300 cursor-pointer hover:scale-150">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <text
                                x="3"
                                y="16"
                                font-family="Inter, sans-serif"
                                font-size="14"
                                font-weight="600"
                                fill="#4F46E5">
                                AI
                            </text>
                            <path
                                d="M18 4L19 7L22 8L19 9L18 12L17 9L14 8L17 7L18 4Z"
                                fill="#6366F1"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-4xl border border-gray-100 mb-8">
                <KeyResultForm objectiveId={editingOkr?.id || ''}/>
            </div>

            <div className="relative flex py-4 items-center mb-6">
                <div className="grow border-t border-gray-100"></div>
                <span className="shrink mx-4 text-gray-300 text-xs font-bold uppercase tracking-widest">
          Finalize
        </span>
                <div className="grow border-t border-gray-100"></div>
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-3xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transform transition-all active:scale-[0.98] duration-200 cursor-pointer text-lg"
            >
                {editingOkr ? 'Update OKR' : 'Create OKR'}
            </button>
        </form>
    );
}

export default OKRForm;
