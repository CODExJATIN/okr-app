import Modal from './components/Modal.tsx';
import OKRForm from './OKRForm.tsx';
import {OkrList} from './components/OKRList.tsx';
import {useEffect, useState} from 'react';
import type {OKRType} from './types/okr_types.tsx';
import {KeyResultProvider} from './providers/KeyResultProvider.tsx';
import {deleteObjective, getAllOkrs} from './services/okr.service.ts';
import {Target, Plus, LayoutDashboard, Sparkles, BotIcon} from 'lucide-react';
import {AiChatBot} from "./components/AiChatBot.tsx";
import type {KeyResultType} from './types/okr_types';
import KeyResultProgressModalContent from './components/KeyResultProgressModalContent';

const HomePage = () => {
    const [okrs, setOkrs] = useState<OKRType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOkr, setEditingOkr] = useState<OKRType | null>(null);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [selectedKr, setSelectedKr] = useState<KeyResultType | null>(null);
    const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);
    const [isKrModalOpen, setIsKrModalOpen] = useState(false);


    const loadOkrs = () => {
        getAllOkrs()
            .then((data) => {
                setOkrs([...data].reverse());
            })
            .catch((error) => {
                console.error(error);
                alert('Failed to load OKRs');
            });
    };

    const handleDeleteOkr = async (okrId: string) => {
        const previous = okrs;

        setOkrs(prev => prev.filter(o => o.id !== okrId));

        try {
            await deleteObjective(okrId);
        } catch (err) {
            setOkrs(previous); // rollback if failed
        }
    };


    useEffect(() => {
        loadOkrs();
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingOkr(null);
        loadOkrs();
    };

    const handleKeyResultClick = (kr: KeyResultType, objectiveId: string) => {
        setSelectedKr(kr);
        setSelectedObjectiveId(objectiveId);
        setIsKrModalOpen(true);
    };


    return (
        <KeyResultProvider>
            <div className="min-h-screen bg-[#FDFDFF] font-sans selection:bg-indigo-100 selection:text-indigo-900">
                <div
                    className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>

                <nav className="bg-white/70 border-b border-slate-100 sticky top-0 z-50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                                    <Target className="w-6 h-6 text-white"/>
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                                        OKR Tracker
                                    </h1>
                                    <span
                                        className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Objectives & Key Results
                </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="group relative bg-slate-900 hover:bg-indigo-600 text-white font-black py-3 px-8 rounded-2xl transition-all duration-300 active:scale-95 flex items-center gap-3 shadow-xl shadow-slate-200 hover:shadow-indigo-200"
                                >
                                    <Plus size={18} className="group-hover:rotate-90 transition-transform"/>
                                    <span className="text-sm uppercase tracking-widest">New Objective</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div className="space-y-3">
                            <div
                                className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.3em]">
                                <LayoutDashboard size={14}/>
                                <span>A glorified to-do app</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                Objectives & Key Results
                            </h2>
                            <p className="text-slate-500 font-medium max-w-xl">
                                Monitor high-level objectives and key results in real-time. Optimize your workflow and
                                maximize operational impact.
                            </p>
                        </div>

                        <div
                            className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
                            <div className="px-4 py-2 bg-slate-50 rounded-xl">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                Total Goals
              </span>
                                <span className="text-xl font-black text-slate-900">{okrs.length}</span>
                            </div>
                            <div className="px-4 py-2 bg-indigo-50/50 rounded-xl border border-indigo-50">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block">
                Success Rate
              </span>
                                <span className="text-xl font-black text-indigo-600">
{(() => {
    const allKRs = okrs.flatMap(o => o.keyResults);
    if (allKRs.length === 0) return 0;

    const completed = allKRs.filter(
        kr => kr.progress === kr.target
    ).length;

    return Math.round((completed / allKRs.length) * 100);
})()}


                                    %
              </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {okrs.length > 0 && (
                            <div className="absolute -left-4 top-0 bottom-0 w-px bg-slate-100 hidden xl:block"></div>
                        )}
                        <OkrList
                            okrs={okrs}
                            onEdit={(okr: OKRType) => {
                                setEditingOkr(okr);
                                setIsModalOpen(true);
                            }}
                            onDelete={handleDeleteOkr}
                            onKeyResultClick={handleKeyResultClick}
                        />
                    </div>
                </main>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                >
                    <div className="relative">
                        <div className="absolute -top-12 -right-12 p-4 text-slate-200 pointer-events-none opacity-50">
                            <Sparkles size={120}/>
                        </div>

                        <OKRForm
                            onSuccess={handleCloseModal}
                            setOkrs={setOkrs}
                            editingOkr={editingOkr}
                        />
                    </div>
                </Modal>

                <Modal
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                >
                    <div className="h-[90vh] max-w-full">
                        <AiChatBot/>
                    </div>
                </Modal>

                <Modal
                    isOpen={isKrModalOpen}
                    onClose={() => setIsKrModalOpen(false)}
                >
                    {selectedKr && selectedObjectiveId && (
                        <KeyResultProgressModalContent
                            objectiveId={selectedObjectiveId}
                            keyResult={selectedKr}
                            onClose={() => {
                                setIsKrModalOpen(false);
                                loadOkrs(); // optional refresh
                            }}
                        />
                    )}
                </Modal>


                <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">OKR APP</p>
                </footer>
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 z-50"
                >
                    <BotIcon/>
                </button>

            </div>
        </KeyResultProvider>
    );
};

export default HomePage;
