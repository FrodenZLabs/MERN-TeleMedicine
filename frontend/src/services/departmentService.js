import axios from "axios";
import { API_URL } from "../components/constants/config";

export const getDepartments = async ({
  searchTerm = "",
  page = 1,
  limit = 10,
}) => {
  try {
    const query = new URLSearchParams({
      searchTerm,
      page,
      limit,
    }).toString();

    const response = await axios.get(
      `${API_URL}/mediclinic/department/get?${query}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getDepartmentsByID = async (departmentID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/department/get/${departmentID}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const addDepartment = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/department/create`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const updateDepartment = async (departmentID, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/department/update/${departmentID}`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const deleteDepartment = async (departmentID) => {
  try {
    const response = await axios.delete(
      `${API_URL}/mediclinic/department/delete/${departmentID}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};
