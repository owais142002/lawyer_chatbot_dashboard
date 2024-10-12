import axios from "axios";
import { API_BASE_URL } from "../apiConfig"; // Import the centralized URL

export const fetchNamespaces = async () => {
  return axios.get(`${API_BASE_URL}/chatbot/fetch-namespaces/`);
};

export const fetchNamespacesData = async (country, page) => {
  return axios.post(`${API_BASE_URL}/chatbot/fetch-namespaces-data/`, {
    country,
    page,
  });
};

export const deleteEmbedding = async (country, link) => {
  return axios.post(`${API_BASE_URL}/chatbot/delete-embedding/`, {
    country,
    link,
  });
};

export const embedDocument = async (fileURL, country, category, metadata) => {
  return axios.post(`${API_BASE_URL}/chatbot/embed/`, {
    fileURL,
    country,
    category,
    metadata,
  });
};

export const createNewCountry = async (country) => {
  return axios.post(`${API_BASE_URL}/chatbot/create-new-country/`, {
    country,
  });
};

export const deleteCountry = async (country) => {
  return axios.post(`${API_BASE_URL}/chatbot/delete-country/`, { country });
};

export const getUniqueLinks = async (country) => {
  return axios.post(`${API_BASE_URL}/chatbot/get-unique-links/`, {
    country,
  });
};

export const getSystemMessage = async () => {
  return axios.get(`${API_BASE_URL}/chatbot/system-message/`);
};

export const updateSystemMessage = async (system_message) => {
  return axios.post(`${API_BASE_URL}/chatbot/system-message/`, {
    system_message,
  });
};
