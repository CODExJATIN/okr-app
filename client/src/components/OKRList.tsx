import {Edit3, TrendingUp, Layers} from 'lucide-react';
import type {OKRType} from '../types/okr_types.tsx';
import {KeyResultList} from './KeyResult.tsx';

interface OkrListProps {
    okrs: OKRType[];
    onEdit: (okr: OKRType) => void;
}

export const OkrList = ({okrs, onEdit}: OkrListProps) => {
    if (!okrs.length) {
        return (
            <div
                className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 group hover:border-indigo-200 transition-colors duration-500">
                <div
                    className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Layers className="text-slate-300 group-hover:text-indigo-400" size={32}/>
                </div>
                <p className="text-slate-900 text-xl font-bold tracking-tight">Your roadmap is empty</p>
                <p className="text-slate-500 text-sm mt-1 max-w-55 text-center">
                    Every great achievement begins with the decision to try.
                </p>
            </div>
        );
    }

    return (
        <div
            className="relative space-y-12 before:absolute before:-left-px before:top-4 before:bottom-4 before:w-0.5 before:bg-linear-to-b before:from-slate-100 before:via-indigo-100 before:to-slate-100 ml-4 md:ml-0">
            {okrs.map((okr: OKRType, index: number) => {
                const completedKRs = okr.keyResults.filter((kr) => kr.progress === kr.target);
                const totalKRs = okr.keyResults.length;
                const progress =
                    totalKRs > 0
                        ? Math.round(
                            completedKRs.reduce(
                                (sum: number, kr) => sum + (kr.progress ?? 0),
                                0
                            ) / totalKRs
                        )
                        : 0;


                return (
                    <div
                        key={okr.id || index}
                        className="group relative pl-8 md:pl-12 transition-all duration-500"
                    >
                        <div className="absolute -left-2.25 top-2 z-10">
                            <div
                                className={`w-4 h-4 rounded-full border-4 border-white shadow-sm transition-all duration-500 group-hover:scale-125 ${
                                    progress === 100
                                        ? 'bg-emerald-500 ring-4 ring-emerald-50'
                                        : 'bg-slate-300 ring-4 ring-slate-50'
                                }`}
                            />
                        </div>

                        <div
                            className={`bg-white rounded-4xl p-6 md:p-10 shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 ${
                                progress === 100 ? 'bg-emerald-50/20' : ''
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                    <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            progress === 100
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-indigo-50 text-indigo-600'
                        }`}
                    >
                      {progress === 100 ? 'Mission Complete' : 'Active Objective'}
                    </span>
                                        {totalKRs > 0 && (
                                            <span
                                                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <TrendingUp size={12}/>
                                                {completedKRs.length}/{totalKRs} KRs
                      </span>
                                        )}
                                    </div>

                                    <h3
                                        className={`text-2xl md:text-3xl font-bold tracking-tight leading-tight transition-all duration-300 ${
                                            progress === 100
                                                ? 'text-slate-400 line-through decoration-emerald-500/30'
                                                : 'text-slate-900'
                                        }`}
                                    >
                                        {okr.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-1">
                      <span
                          className={`text-3xl font-black transition-colors ${progress === 100 ? 'text-emerald-600' : 'text-slate-900'}`}
                      >
                        {progress}
                      </span>
                                            <span className="text-sm font-bold text-slate-400">%</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Progress
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onEdit(okr)}
                                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn shadow-inner"
                                    >
                                        <Edit3 size={18}/>
                                    </button>
                                </div>
                            </div>

                            <div
                                className="relative w-full h-3 bg-slate-100 rounded-full mb-10 overflow-hidden shadow-inner">
                                <div
                                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
                                        progress === 100
                                            ? 'bg-linear-to-r from-emerald-400 to-emerald-500'
                                            : 'bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-600'
                                    }`}
                                    style={{width: `${progress}%`}}
                                >
                                    <div
                                        className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-size-[20px_20px] animate-[shimmer_2s_linear_infinite]"/>
                                </div>
                            </div>


                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Breakdown
                                    </h4>
                                    <div className="flex-1 h-px bg-slate-100/80"></div>
                                </div>

                                <div
                                    className="bg-slate-50/40 rounded-3xl p-2 md:p-6 border border-slate-100/50 backdrop-blur-sm">
                                    <KeyResultList keyResults={okr.keyResults}/>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
