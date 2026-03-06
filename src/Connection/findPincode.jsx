
const fetchAddressFromPincode = async (pincode) => {  

  try {
    const res = await fetch( `http://localhost:5000/api/auth/pincode/${pincode}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data =  await res.json();
    return data; 
  
  } catch (error) {
    console.log("Pincode fetch error:", error);
  }
};

export default fetchAddressFromPincode;

