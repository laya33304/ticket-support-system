const API_BASE_URL = "https://ticket-support-system-l63v.onrender.com";

const getToken = () => {
  return localStorage.getItem("token");
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ---------------- AUTH ----------------

export const registerUser = async (userData) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// ---------------- TICKETS ----------------

export const getTickets = async () => {
  return request("/tickets");
};

export const getTicketById = async (id) => {
  return request(`/tickets/${id}`);
};

export const createTicket = async (ticketData) => {
  return request("/tickets", {
    method: "POST",
    body: JSON.stringify(ticketData),
  });
};

export const updateTicket = async (id, ticketData) => {
  return request(`/tickets/${id}`, {
    method: "PUT",
    body: JSON.stringify(ticketData),
  });
};

export const deleteTicket = async (id) => {
  return request(`/tickets/${id}`, {
    method: "DELETE",
  });
};

// ---------------- COMMENTS ----------------

export const getComments = async (ticketId) => {
  return request(`/tickets/${ticketId}/comments`);
};

export const createComment = async (ticketId, comment) => {
  return request(`/tickets/${ticketId}/comments`, {
    method: "POST",
    body: JSON.stringify({
      comment,
    }),
  });
};

// ---------------- USERS ----------------

export const getUsers = async () => {
  return request("/users");
};

export const getAgents = async () => {
  return request("/users/agents");
};
