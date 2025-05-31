
export const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:1000/api/v1"
    : "https://notification-1-rtqp.onrender.com/api/v1";