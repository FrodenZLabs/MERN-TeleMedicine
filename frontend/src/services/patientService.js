import axios from "axios";
import { API_URL } from "../components/constants/config";

export const getPatients = async ({
  searchData = {},
  page = 1,
  limit = 10,
}) => {
  try {
    const query = new URLSearchParams({
      searchTerm: searchData.searchTerm || "",
      patient_gender: searchData.patient_gender || "All",
      page,
      limit,
    }).toString();

    const response = await axios.get(
      `${API_URL}/mediclinic/patient/get?${query}`,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getPatientsByID = async (patientID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/patient/get/${patientID}`,
      { withCredentials: true }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const addPatient = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/patient/create`,
      formData,
      { withCredentials: true }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const updatePatient = async (patientID, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/patient/update/${patientID}`,
      formData,
      { withCredentials: true }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const deletePatient = async (patientID) => {
  try {
    const response = await axios.delete(
      `${API_URL}/mediclinic/patient/delete/${patientID}`,
      { withCredentials: true }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};
