const API_BASE_URL = 'http://localhost:5000/api';

export interface UserInfo {
  name: string;
  email: string;
  affiliation?: string | null;
  job?: string | null;
  task?: string | null;
  industry?: string | null;
  age?: string | null;
  marketing?: boolean;
}

export const startDiagnosis = async (userInfo: UserInfo): Promise<{ session_id: string }> => {
  const response = await fetch(`${API_BASE_URL}/diagnosis/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo),
  });

  if (!response.ok) {
    throw new Error('Failed to start diagnosis');
  }

  return response.json();
};

export const updateProgress = async (sessionId: string, questionId: number, answerValue: number): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/diagnosis/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      question_id: questionId,
      answer_value: answerValue
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update progress');
  }

  return response.json();
};

export const submitDiagnosis = async (sessionId: string, resultData: any): Promise<{ success: boolean; data: any }> => {
  const response = await fetch(`${API_BASE_URL}/diagnosis/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      result_data: resultData
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit diagnosis');
  }

  return response.json();
};
