import axios from "axios";
import { API_URL } from "../components/constants/config";

export const getPayments = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/payment/get?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getPaymentsByPatientID = async (
  patientID,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/payment/patient/${patientID}?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const addPayment = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mediclinic/payment/create`,
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
