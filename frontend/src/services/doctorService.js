import axios from "axios";
import { API_URL } from "../components/constants/config";

export const getDoctors = async ({ searchTerm = "", page = 1, limit = 10 }) => {
  try {
    const query = new URLSearchParams({
      searchTerm,
      page,
      limit,
    }).toString();

    const response = await axios.get(
      `${API_URL}/mediclinic/doctor/get?${query}`,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getDoctorsByID = async (doctorID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/doctor/get/${doctorID}`,
      { withCredentials: true }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getDoctorsByDepartmentID = async (departmentID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/doctor/get/department/${departmentID}`,
      { withCredentials: true }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const addDoctor = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/doctor/create`,
      formData,
      { withCredentials: true }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const updateDoctor = async (doctorID, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/doctor/update/${doctorID}`,
      formData,
      { withCredentials: true }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const deleteDoctor = async (doctorID) => {
  try {
    const response = await axios.delete(
      `${API_URL}/mediclinic/doctor/delete/${doctorID}`,
      { withCredentials: true }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};
