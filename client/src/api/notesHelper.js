import axios from 'axios';

const getNotesFromAI = async (topic, roughNotes, categoryId) => {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem("userId");
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.post(`${API_BASE_URL}/generate-summary`, 
      { topic, notes: roughNotes, userId, categoryId }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.summary;
  } catch (error) {
      console.error("Error fetching notes: ", error);
      return "Failed to generate notes. Please try again!";
  }
};

export { getNotesFromAI };