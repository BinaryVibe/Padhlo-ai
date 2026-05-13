import axios from 'axios';

// AI se Questions generate karwana (Ab content bhi bheje ga)
export const generateQuizFromAI = async (topic, content) => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.post(`${API_BASE_URL}/quizzes/generate`, 
      { topic, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

// Quiz aur Score save karna
export const saveQuizToDB = async (noteId, title, questions, score, totalQuestions) => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.post(`${API_BASE_URL}/quizzes/save`, 
      { noteId, title, questions, score, totalQuestions },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving quiz:", error);
    throw error;
  }
};  