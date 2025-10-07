import axios from "axios";

const BASE_URL = process.env.REACT_APP_EVENT_SERVICE_URL || "http://localhost:8081";

const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchEvents = async (token, filters = {}) => {
  const hasFilters = Boolean(filters.city || filters.category);
  const url = hasFilters ? `/events/search` : `/events`;
  const params = {};
  if (filters.city) {
    params.city = filters.city;
  }
  if (filters.category) {
    params.category = filters.category;
  }
  const response = await axios.get(`${BASE_URL}${url}`, {
    ...withAuth(token),
    params,
  });
  return response.data;
};

export const fetchEventById = async (token, id) => {
  const response = await axios.get(`${BASE_URL}/events/${id}`, withAuth(token));
  return response.data;
};

export const createEvent = async (token, payload) => {
  const response = await axios.post(`${BASE_URL}/events`, payload, withAuth(token));
  return response.data;
};

export const updateEvent = async (token, id, payload) => {
  const response = await axios.put(`${BASE_URL}/events/${id}`, payload, withAuth(token));
  return response.data;
};

export const deleteEvent = async (token, id) => {
  await axios.delete(`${BASE_URL}/events/${id}`, withAuth(token));
};

export const SOURCE_OPTIONS = ["LOCAL", "TICKETMASTER"];
export const STATUS_OPTIONS = ["UPCOMING", "CANCELLED", "PAST"];