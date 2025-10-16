import axios from "axios";
import { API_URL } from "../components/constants/config";

export const getPrescriptions = async ({ page = 1, limit = 10 }) => {
  try {
    const query = new URLSearchParams({
      page,
      limit,
    }).toString();

    const response = await axios.get(
      `${API_URL}/mediclinic/prescription/get?${query}`,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getPrescriptionsByID = async (prescriptionID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/prescription/get/${prescriptionID}`,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getPrescriptionsByAppointmentID = async (appointmentID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/prescription/appointment/${appointmentID}`,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getPrescriptionsByDoctorID = async (doctorID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/prescription/doctor/${doctorID}`,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getPrescriptionsByPatientID = async (patientID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/prescription/patient/${patientID}`,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const addPrescription = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/prescription/create`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const updatePrescription = async (prescriptionID, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/prescription/update/${prescriptionID}`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const deletePrescription = async (prescriptionID) => {
  try {
    const response = await axios.delete(
      `${API_URL}/mediclinic/prescription/delete/${prescriptionID}`,
      {
        withCredentials: true,
      }
    );

    return response?.data || "";
  } catch (error) {
    throw error.response?.data?.message;
  }
};
