import { useState } from "react";
import type { KeyResultType } from "../types/okr_types";
import { useContext } from "react";
import { KeyResultContext } from "../providers/KeyResultProvider";

interface Props {
    objectiveId: string;
    keyResult: KeyResultType;
    onClose: () => void;
}

const KeyResultProgressModalContent = ({
                                           objectiveId,
                                           keyResult,
                                           onClose,
                                       }: Props) => {
    const [progress, setProgress] = useState<number>(
        keyResult.progress ?? 0
    );
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(KeyResultContext);
    if (!context) throw new Error("Must be used inside provider");

    const { updateKeyResult } = context;

    const percentage =
        keyResult.target && keyResult.target > 0
            ? Math.min((progress / keyResult.target) * 100, 100)
            : 0;

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateKeyResult(objectiveId, keyResult.id, {
                ...keyResult,
                progress,
            });
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-10 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">
                Update Progress
            </h2>

            <div>
                <p className="text-sm font-semibold text-slate-500">
                    {keyResult.description}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    Target: {keyResult.target} {keyResult.metric}
                </p>
            </div>

            {/* Percentage Display */}
            <div className="text-center">
        <span className="text-5xl font-black text-indigo-600">
          {Math.round(percentage)}
        </span>
                <span className="text-lg font-bold text-slate-400">%</span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Slider Based On Target */}
            <input
                type="range"
                min="0"
                max={keyResult.target ?? 100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-indigo-600"
            />

            <div className="text-center text-sm font-semibold text-slate-600">
                {progress} / {keyResult.target}
            </div>

            <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-indigo-600 transition-all disabled:opacity-50"
            >
                {isLoading ? "Updating..." : "Save Progress"}
            </button>
        </div>
    );
};

export default KeyResultProgressModalContent;