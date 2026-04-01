const BASE_URL = "http://127.0.0.1:5000/api";

export const registerUser = async (data) => {
  return fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const loginUser = async (data) => {
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(res => res.json());
};