import axios from "axios";

const API_BASE_URL =
  "https://render-dev-ke.rehanisoko-internal.com/api/v1/chatbot/lawyer";

export const fetchNamespaces = async () => {
  return axios.get(`${API_BASE_URL}/fetch-namespaces/`);
};

export const fetchNamespacesData = async (country, namespace, page) => {
  return axios.post(`${API_BASE_URL}/fetch-namespaces-data/`, {
    country,
    namespace,
    page,
  });
};

export const deleteEmbedding = async (country, namespace, link) => {
  return axios.post(`${API_BASE_URL}/delete-embedding/`, {
    country,
    namespace,
    link,
  });
};

export const embedDocument = async (fileURL, country, namespace, metadata) => {
  return axios.post(`${API_BASE_URL}/embed/`, {
    fileURL,
    country,
    namespace,
    metadata,
  });
};

export const createNewCountry = async (country, namespace) => {
  return axios.post(`${API_BASE_URL}/create-new-country/`, {
    country,
    namespace,
  });
};

export const addNamespace = async (country, namespace) => {
  return axios.post(`${API_BASE_URL}/add-namespace/`, { country, namespace });
};

export const deleteNamespace = async (country, namespace) => {
  return axios.post(`${API_BASE_URL}/delete-namespace/`, {
    country,
    namespace,
  });
};

export const deleteCountry = async (country) => {
  return axios.post(`${API_BASE_URL}/delete-country/`, { country });
};

export const getUniqueLinks = async (country, namespace) => {
  return axios.post(`${API_BASE_URL}/get-unique-links/`, {
    country,
    namespace,
  });
};

export const getSystemMessage = async () => {
  return axios.get(`${API_BASE_URL}/system-message/`);
};

export const updateSystemMessage = async (system_message) => {
  return axios.post(`${API_BASE_URL}/system-message/`, {
    system_message,
  });
};
