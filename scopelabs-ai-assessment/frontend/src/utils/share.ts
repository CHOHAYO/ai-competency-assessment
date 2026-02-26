import { AssessmentState, SharedData } from '../context/AssessmentContext';

// Only encode necessary data to keep URL short
interface UrlData {
  n: string; // name
  a: Record<number, number>; // answers
}

export const encodeData = (userInfo: AssessmentState['userInfo'], answers: AssessmentState['answers']): string => {
  const data: UrlData = {
    n: userInfo.name,
    a: answers
  };
  
  try {
    const jsonString = JSON.stringify(data);
    // Simple Base64 encoding. For production, consider compression like lz-string
    return btoa(encodeURIComponent(jsonString));
  } catch (e) {
    console.error('Failed to encode data', e);
    return '';
  }
};

export const decodeData = (encoded: string): SharedData | null => {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    const data: UrlData = JSON.parse(jsonString);
    
    return {
      userInfo: { 
        name: data.n, 
        email: '', 
        // Add default values for required fields if any, or optional fields
      } as any, // Type assertion to bypass strict checks for optional fields if needed, but UserInfo has optional fields except name/email
      answers: data.a
    };
  } catch (e) {
    console.error('Failed to decode data', e);
    return null;
  }
};
