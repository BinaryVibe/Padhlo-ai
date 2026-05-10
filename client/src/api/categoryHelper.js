import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/categories`;

export const createCategory = async (categoryData, token) => {
  const response = await axios.post(API_URL, categoryData, {
    headers: { 'x-auth-token': token },
  });
  return response.data;
};

export const getUserCategories = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { 'x-auth-token': token },
  });
  return response.data;
};

export const deleteCategory = async (categoryId, token) => {
  const response = await axios.delete(`${API_URL}/${categoryId}`, {
    headers: { 'x-auth-token': token },
  });
  return response.data;
};