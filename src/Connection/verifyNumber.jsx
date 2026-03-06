const handleverifyNumber = async (phone) => {
  try {
    const response = await fetch(`http://localhost:5000/api/auth/verify-phone/${phone}`,
         {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    );
   return await response.json();

  } catch (error) {
    console.log("verification failed", error);
  }
};
export default handleverifyNumber;