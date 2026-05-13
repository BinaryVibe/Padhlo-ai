import axios from "axios";

const getToken = () => localStorage.getItem('token');
const getBaseUrl = () => import.meta.env.VITE_API_URL;

export const getUserCategories = async () => {
  try {
    const response = await axios.get(`${getBaseUrl()}/categories`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) { throw error; }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${getBaseUrl()}/categories`, categoryData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) { throw error; }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${getBaseUrl()}/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) { throw error; }
};

export const renameCategory = async (categoryId, newName) => {
  try {
    const response = await axios.put(`${getBaseUrl()}/categories/${categoryId}`, 
      { name: newName },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data;
  } catch (error) { throw error; }
};