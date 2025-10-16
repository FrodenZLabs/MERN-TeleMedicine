import axios from "axios";
import { API_URL } from "../components/constants/config";

export const getNotificationsByID = async (notificationID) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/notification/get/${notificationID}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getNotificationsByUserID = async (userID, page, limit) => {
  try {
    const response = await axios.get(
      `${API_URL}/mediclinic/notification/user/${userID}?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const markNotification = async (notificationID) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/notification/mark/${notificationID}`,
      {},
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const markAllNotifications = async (userID) => {
  try {
    const response = await axios.put(
      `${API_URL}/mediclinic/notification/markAll/${userID}`,
      {},
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const deleteNotification = async (notificationID) => {
  try {
    const response = await axios.delete(
      `${API_URL}/mediclinic/notification/delete/${notificationID}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const deleteAllNotifications = async (userID) => {
  try {
    const response = await axios.delete(
      `${API_URL}/mediclinic/notification/deleteAll/${userID}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};
