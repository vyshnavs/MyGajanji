// utils/auth.js
export function getToken() {
  const token = localStorage.getItem("token");
  const expiryTime = localStorage.getItem("tokenExpiry");

  // If token is missing or expired
  if (!token || !expiryTime || Date.now() > parseInt(expiryTime)) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    return null; // Token is invalid or expired
  }

  return token; // Token is valid
}
