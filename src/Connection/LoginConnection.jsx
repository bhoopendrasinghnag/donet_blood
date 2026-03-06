
const handle = async (payload) => {
  try {
 
    const response = await fetch("http://localhost:5000/api/auth/logIn",
         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
   return await response.json();

  } catch (error) {
    console.log("Connection error:", error);
  }
};
export default handle;