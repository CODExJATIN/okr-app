import type {KeyResultType, OKRType} from '../types/okr_types.tsx';
import type {ChatDto} from "../components/AiChatBot.tsx";


const SERVER_URL = 'http://localhost:3000';

export const getAllOkrs = async (): Promise<OKRType[]> => {
  const response = await fetch(`${SERVER_URL}/objective`);

  if (!response.ok) {
    throw new Error('Failed to fetch OKRs');
  }

  return response.json();
};

export const createOkr = async (objective: {title: string}, keyResults:KeyResultType[])=>{
  const response = await fetch(`${SERVER_URL}/objective/many`,{
    method: 'POST',
    body: JSON.stringify({objective:{title:objective.title}, keyResults:keyResults}),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to create objective');
  }
  return response.json();
}

export const deleteObjective = async (objectiveId: string)=>{
  const response = await fetch(`${SERVER_URL}/objective/${objectiveId}`,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete objective');
  }
  return response.json();
}

export const updateOkr = async (objective: {id: string; title: string})=>{
  const response = await fetch(`${SERVER_URL}/objective/${objective.id}`,{
    method:'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title: objective.title})
  });

  if (!response.ok) {
    throw new Error('Failed to update objective');
  }
  return response.json();
}

export const createKeyResults = async (
    objectiveId: string,
    keyResult: Pick<KeyResultType, 'description' | 'progress' | 'target' | 'metric'>
): Promise<KeyResultType> => {
  const response = await fetch(
      `${SERVER_URL}/objective/${objectiveId}/key-result`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyResult),
      }
  );

  if (!response.ok) {
    throw new Error('Failed to create key result');
  }

  return response.json();
};

export const updateKeyResults = async (objectiveId:string, keyResultId:string, keyResult:KeyResultType): Promise<OKRType[]> => {
  const response = await fetch(`${SERVER_URL}/objective/${objectiveId}/key-result/${keyResultId}`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(keyResult)
  });
  if (!response.ok) {
    throw new Error('Failed to update key results');
  }
  return response.json();
}

export const deleteKeyResults = async (objectiveId:string, keyResultId:string): Promise<OKRType[]> => {
  const result = await fetch(`${SERVER_URL}/objective/${objectiveId}/key-result/${keyResultId}`,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!result.ok) {
    throw new Error('Failed to delete objective');
  }
  return result.json();
}

export const sendToAi = async (data: ChatDto[]) => {
  const response = await fetch(`${SERVER_URL}/ai/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      );

  if (!response.ok) {
    throw new Error('Failed to get ai');
  }
  return response.json();
}

export const generateOkr = async (prompt:string) => {

  const response = await fetch(`${SERVER_URL}/ai/generate`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title: prompt}),
  })

  if (!response.ok) {
    throw new Error('Failed to generate okr');
  }
  return response.json();
}
