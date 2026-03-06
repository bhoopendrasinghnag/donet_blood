
const fetchAddressFromPincode = async (pincode, setFormData, setIsPincodeValid) => {

  if (pincode.length !== 6) return;

  try {
    console.log(pincode);
    
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const data = await res.json();

    if (data[0].Status === "Success") {
      const postOffice = data[0].PostOffice[0];

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          city: postOffice.Block || postOffice.District,
          district: postOffice.District,
          state: postOffice.State,
          
        },
      }));
    }

  } catch (error) {
    console.log("Pincode fetch error:", error);
    setIsPincodeValid(false);
  }
};

export default fetchAddressFromPincode;