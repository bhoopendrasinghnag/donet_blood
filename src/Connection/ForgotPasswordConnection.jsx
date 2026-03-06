const BASE_URL = "http://localhost:5000/api/auth";

export const sendOtpAPI = async (data) => {
  console.log(data);
  
  const res = await fetch(`${BASE_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await res.json();
};

export const verifyOtpAPI = async (data) => {
  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await res.json();
};

export const updatePassAPI = async (data) => {
 const res = await fetch(`${BASE_URL}/reset-password`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});
  return await res.json();
};