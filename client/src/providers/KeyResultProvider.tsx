import { createContext, useState, type ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import type { KeyResultType } from '../types/okr_types.tsx';
import { createKeyResults, updateKeyResults } from '../services/okr.service.ts';

interface KeyResultContextType {
  keyResultList: KeyResultType[];
  keyResultHistory: KeyResultType[][];
  addKeyResult: (objectiveId: string, keyResult: Omit<KeyResultType, 'id' | 'objectiveId'>) => Promise<void>;
  updateKeyResult: (objectiveId: string, keyResultId: string, keyResult: Omit<KeyResultType, 'id' | 'objectiveId'>) => Promise<void>;
  deleteKeyResult: (keyResultId: string) => void;
  resetKeyResults: () => void;
  setAllKeyResults: (keyResults: KeyResultType[]) => void;
  undo: () => void;
  redo: () => void;
}

export const KeyResultContext = createContext<KeyResultContextType | undefined>(undefined);

interface KeyResultProviderProps {
  children: ReactNode;
}

export const KeyResultProvider = ({ children }: KeyResultProviderProps) => {
  const [keyResultList, setKeyResultList] = useState<KeyResultType[]>([]);
  const [keyResultHistory, setKeyResultHistory] = useState<KeyResultType[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addKeyResult = async (objectiveId: string, keyResult: Omit<KeyResultType, 'id' | 'objectiveId'>) => {
    if (objectiveId && objectiveId.trim()) {
      try {
        const response = await createKeyResults(objectiveId, {
          description: keyResult.description,
          progress: keyResult.progress,
        });
        setKeyResultList((prev) => {
          const updated = [...prev, response];
          addToHistory(updated);
          return updated;
        });
      } catch (error) {
        console.error('Failed to create key result:', error);
      }
    } else {
      const newKeyResult: KeyResultType = {
        ...keyResult,
        id: uuid(),
        objectiveId: '',
      };
      setKeyResultList((prev) => {
        const updated = [...prev, newKeyResult];
        addToHistory(updated);
        return updated;
      });
    }
  };


const addToHistory = (newList: KeyResultType[]) => {
  setKeyResultHistory((prev) => {
    const updatedHistory = prev.slice(0, historyIndex + 1);
    return [...updatedHistory, [...newList]];
  });

  setHistoryIndex((prev) => prev + 1);
};


const updateKeyResult = async (objectiveId: string, keyResultId: string, keyResult: Omit<KeyResultType, 'id' | 'objectiveId'>) => {
  const updatedKeyResult = {
    id: keyResultId,
    objectiveId,
    ...keyResult,
  };

  console.log('Updating key result:', updatedKeyResult);

  setKeyResultList((prev) => {
    const updatedList = prev.map((kr) => (kr.id === keyResultId ? updatedKeyResult : kr));

    console.log('Updated key result list:', updatedList);
  
    setKeyResultHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        return [...newHistory, [...updatedList]];
    });
    setHistoryIndex((prevIdx) => prevIdx + 1);
    
    return updatedList;
  });

  if (objectiveId?.trim()) {
    try {
      await updateKeyResults(objectiveId, keyResultId, updatedKeyResult);
    } catch (error) {
      console.error('Failed to update key result:', error);
    }
  }
};

  const deleteKeyResult = (keyResultId: string) => {
    setKeyResultList((prev) => {
      const updated = prev.filter((kr) => kr.id !== keyResultId);
      addToHistory(updated);
      return updated;
    });
  };

  const resetKeyResults = () => {
    setKeyResultList(() => {
      const updated: KeyResultType[] = [];
      addToHistory(updated);
      return updated;
    });
  };

  const setAllKeyResults = (keyResults: KeyResultType[]) => {
    setKeyResultList(() => {
      const updated = [...keyResults];
      addToHistory(updated);
      return updated;
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setKeyResultList([...keyResultHistory[newIndex]]);
    }
  };

  const redo = () => {
    if (historyIndex < keyResultHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setKeyResultList([...keyResultHistory[newIndex]]);
    }
  };

  const value: KeyResultContextType = {
    keyResultList,
    keyResultHistory,
    addKeyResult,
    updateKeyResult,
    deleteKeyResult,
    resetKeyResults,
    setAllKeyResults,
    undo,
    redo,
  };

  return <KeyResultContext.Provider value={value}>{children}</KeyResultContext.Provider>;
};
