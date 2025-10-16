import axios from "axios";
import { API_URL } from "../components/constants/config";

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/auth/login`,
      formData,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/auth/signout`,
      {},
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error logging out.";
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/auth/signup`,
      formData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getUsers = async ({ searchData = {}, page = 1, limit = 10 }) => {
  try {
    const query = new URLSearchParams({
      searchTerm: searchData.searchTerm || "",
      role: searchData.role || "All",
      page,
      limit,
    }).toString();

    const response = await axios.get(
      `${API_URL}/mediclinic/auth/get?${query}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getUsersByID = async (userID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/auth/get/${userID}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const Activate = async (userID) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/auth/activate/${userID}`,
      {},
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error activating user.";
  }
};

export const Deactivate = async (userID) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/auth/deactivate/${userID}`,
      {},
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error deactivating user.";
  }
};

export const updateUser = async (userID, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/auth/update/${userID}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating the user.";
  }
};
