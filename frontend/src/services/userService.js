import axios from 'axios';

const API_URL = "http://localhost:5000/api";

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
