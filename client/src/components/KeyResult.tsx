import { CheckCircle2, Circle, Activity, Target } from 'lucide-react';
import type { KeyResultType } from '../types/okr_types.tsx';

interface KeyResultProps {
  keyResult: KeyResultType;
  index: number;
}

const KeyResult = ({ keyResult, index }: KeyResultProps) => {
  const isFinished = Number(keyResult.progress) === 100;

  return (
    <div
      key={keyResult.id}
      className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
        isFinished
          ? 'bg-slate-50/40 border-slate-100 opacity-80'
          : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 hover:translate-x-1'
      }`}
    >
      <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
        {isFinished ? (
          <CheckCircle2 size={22} className="text-emerald-500" />
        ) : (
          <Circle size={22} className="text-slate-300 group-hover:text-indigo-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Target size={10} className={isFinished ? 'text-emerald-400' : 'text-indigo-400'} />
            {keyResult.metric || 'percentage'} - Target: {keyResult.target || 100}
          </span>
        </div>
        <p
          className={`text-[14px] font-semibold tracking-tight transition-all duration-300 truncate ${
            isFinished ? 'text-slate-400 line-through decoration-2' : 'text-slate-700'
          }`}
        >
          {keyResult.description}
        </p>
      </div>

      <div
        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all duration-300 ${
          isFinished
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-slate-900 text-white shadow-lg shadow-slate-200'
        }`}
      >
        {!isFinished && <Activity size={12} className="animate-pulse" />}
        <span className="font-mono tabular-nums">{keyResult.progress}</span>
        <span className="text-[10px] opacity-70">%</span>
      </div>
    </div>
  );
};

export interface KeyResultListProps {
  keyResults: KeyResultType[];
}

export function KeyResultList({ keyResults }: KeyResultListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
      {keyResults.length > 0 ? (
        keyResults.map((keyResult: KeyResultType, index: number) => (
          <KeyResult key={keyResult.id} keyResult={keyResult} index={index} />
        ))
      ) : (
        <div className="py-4 text-center">
          <p className="text-xs font-medium text-slate-400 italic">No key results defined yet.</p>
        </div>
      )}
    </div>
  );
}
