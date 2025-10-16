import axios from "axios";
import { API_URL } from "../components/constants/config";

export const getVideoConsultations = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/video/get?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getVideoConsultationsByID = async (videoConsultationID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/video/get/${videoConsultationID}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getVideoConsultationsByDoctorID = async (
  doctorID,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/video/doctor/${doctorID}?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getVideoConsultationsByPatientID = async (
  patientID,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/video/patient/${patientID}?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const addVideoConsultations = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/video/create`,
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

export const updateVideoConsultations = async (
  videoConsultationID,
  formData
) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/video/update/${videoConsultationID}`,
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
