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

const getUserCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${API_BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) { throw error; }
};

const createCategory = async (categoryData) => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const response = await axios.post(`${API_BASE_URL}/categories`, categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) { throw error; }
};

const deleteCategory = async (categoryId) => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) { throw error; }
};

// NEW: Rename Category Function
const renameCategory = async (categoryId, newName) => {
  try {
    const token = localStorage.getItem('token');
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}`, 
      { name: newName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) { throw error; }
};

export { getNotesFromAI, getUserCategories, createCategory, deleteCategory, renameCategory };