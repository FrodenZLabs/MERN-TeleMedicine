import axios from "axios";
import { API_URL } from "../components/constants/config";

export const getAppointments = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/appointment/get?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch appointments."
    );
  }
};

export const getAppointmentsByID = async (appointmentID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/appointment/get/${appointmentID}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getAppointmentsByPatientID = async (
  patientID,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/appointment/patient/${patientID}?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch patient appointments."
    );
  }
};

export const getAppointmentsByDoctorID = async (
  doctorID,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/appointment/doctor/${doctorID}?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch doctor appointments."
    );
  }
};

export const addAppointment = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/appointment/create`,
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

export const updateAppointment = async (appointmentID, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/appointment/update/${appointmentID}`,
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

export const deleteAppointment = async (appointmentID) => {
  try {
    const response = await axios.delete(
      `${API_URL}/mediclinic/appointment/delete/${appointmentID}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};
