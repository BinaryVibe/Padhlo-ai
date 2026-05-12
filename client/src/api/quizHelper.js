import axios from 'axios';

// AI se Questions generate karwane ki API
export const generateQuizFromAI = async (topic) => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.post(`${API_BASE_URL}/quizzes/generate`, 
      { topic },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

// Quiz ko Score ke sath Database mein save karne ki API
export const saveQuizToDB = async (title, questions) => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.post(`${API_BASE_URL}/quizzes/save`, 
      { title, questions },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving quiz:", error);
    throw error;
  }
};