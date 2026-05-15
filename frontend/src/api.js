import axios from "axios";

const API = "http://127.0.0.1:5000";

export const getCollections = async () => {
  const res = await axios.get(`${API}/collections`);
  return res.data.collections;
};

export const chat = async (formData) => {
  const res = await axios.post(`${API}/chat`, formData);
  return res.data;
};