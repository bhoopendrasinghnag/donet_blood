
export const handlesendotp = async (formData) => {
  try {
 
    const response = await fetch("http://localhost:5000/api/auth/register",
         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
   return await response.json();

  } catch (error) {
    console.log("Connection error:", error);
  }
};



export const handleotpverification = async (formData , token, otp) => {
  try {
    
    const response = await fetch("http://localhost:5000/api/auth/verify-register-otp",
         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({formData, token, otp}),
      }
    );
   return await response.json();

  } catch (error) {
    console.log("Connection error:", error);
  }
};


export const handleUserRegistration = async (formData) => {
  try {
    
    const response = await fetch("http://localhost:5000/api/auth/saveUser",
         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
   return await response.json();

  } catch (error) {
    console.log("Connection error:", error);
  }
};
