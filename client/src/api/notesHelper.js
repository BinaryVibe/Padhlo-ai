import axios from 'axios';

const getNotesFromAI = async (topic, roughNotes) => {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem("userId");
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.post(`${API_BASE_URL}/generate-summary`, 
      {
        topic,
        notes: roughNotes,
        userId
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
      return response.data.summary;

  } catch (error) {
      console.error("Error fetching notes: ", error);
      return "Failed to generate notes. Please try again!";
  }
};

// =======================================================
// CATEGORY WALA FRONTEND PART (ADDED BELOW, CODE IS SAFE)
// =======================================================

const getUserCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    const response = await axios.get(`${API_BASE_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw error;
  }
};

const createCategory = async (categoryData) => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category: ", error);
    throw error;
  }
};

// Sab functions ko ek hi jagah export kar diya
export { getNotesFromAI, getUserCategories, createCategory };