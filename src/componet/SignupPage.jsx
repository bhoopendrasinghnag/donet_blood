import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/SignupPage.css"
import { handlesendotp, handleotpverification, handleUserRegistration } from "../Connection/SignupConnection.jsx";
import fetchAddressFromPincode from "../Connection/findPincode.jsx";
import fetchVerifyNumberStatus from "../Connection/verifyNumber.jsx"
import { Stepper, Step, StepLabel } from "@mui/material";
import Popup from "../PopUP/Popup";
import backButton from "../assets/left.png"
import cancleButton from "../assets/remove.png"

export const Signup = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [popup, setPopup] = useState({ msg: "", type: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    weight: "",
    height: "",
    address: {
      fulladdress: "",
      city: "",
      district: "",
      state: "",
      pincode: ""
    },
    bloodPressure: "",
    hemoglobinLevel: "",
    anyDisease: "No",
    diseaseDetails: "",
    isOnMedication: "No",
    medicationDetails: "",
    hasAllergy: "No",
    allergyDetails: "",
    recentSurgery: "No",
    surgeryDetails: "",
    covidVaccinated: "Yes",
    smoker: "No",
    alcoholConsumption: "No",
    availability: "Unavailable",
    lastDonated: "",
    totalDonations: 0,
    donationDate: "",
    nextEligibleDate: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    termsAccepted: false,
    privacyAccepted: false,
  });

  /* ================= RESET FUNCTION ================= */

  const reSetState = () => {
    setStep(1);
    setOtp("");
    setOtpVerified(false);
    setOtpSent(false);
    setToken("");

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      weight: "",
      height: "",
      address: {
        fulladdress: "",
        city: "",
        district: "",
        state: "",
        pincode: ""
      },
      bloodPressure: "",
      hemoglobinLevel: "",
      anyDisease: "No",
      diseaseDetails: "",
      isOnMedication: "No",
      medicationDetails: "",
      hasAllergy: "No",
      allergyDetails: "",
      recentSurgery: "No",
      surgeryDetails: "",
      covidVaccinated: "Yes",
      smoker: "No",
      alcoholConsumption: "No",
      totalDonations: 0,
      lastDonated: "",
      nextEligibleDate: "",
      donationDate: "",
      availability: "Unavailable",
      emergencyContactName: "",
      emergencyContactNumber: "",
      termsAccepted: false,
      privacyAccepted: false,
    });
  };

  // ================= AGE =================
  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // ================= BASIC FIELD =================
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= verify mobile number =================
  const handleMobileNumberChange = async (e) => {
    const phone = e.target.value;
    if (!/^\d*$/.test(phone)) return;

    if (phone.length > 10) return;

    setFormData((prev) => ({
      ...prev,
      phone
    }));
  };

  const verifyPhoneNumber = async (phone) => {
    try {

      const response = await fetchVerifyNumberStatus(phone);

      if (!response || response.phone_valid !== true) {
        setPopup({ msg: "Invalid mobile number", type: "error" });
        return false;
      }
      return true;
    } catch {
      setPopup({ msg: "Phone verification service unavailable", type: "error" });
      return false;
    }
  };

  // ================= CHECKBOX =================
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // ================= ADDRESS =================
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // ================= PINCODE =================
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    if (!/^\d*$/.test(pincode)) return;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        pincode: pincode,
      },
    }));
    try {
      const response = await fetchAddressFromPincode(pincode);

      if ((!response || !response.district) && pincode.length === 6) {
        setPopup({ msg: response.message, type: "error" })
        return;
      }

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          city: response.city || "",
          district: response.district || "",
          state: response.state || "",
        },
      }));

    } catch (error) {
      setPopup({ msg: "Pincode lookup failed", type: "error" });
    }
  };

  // ================= LAST DONATED =================
  const handleLastDonatedChange = (e) => {
    const value = e.target.value;

    if (!value) return;

    const lastDate = new Date(value);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 3);

    const today = new Date();

    setFormData((prev) => ({
      ...prev,
      lastDonated: value,
      nextEligibleDate: nextDate.toISOString().split("T")[0],
      availability: today < nextDate ? "Unavailable" : "Available",
    }));
  };

  // ================= DONATION DATE =================
  const handleDonationDateChange = (e) => {
    const selectedDate = e.target.value;

    if (!selectedDate) {
      setFormData((prev) => ({
        ...prev,
        lastDonated: "",
        nextEligibleDate: "",
        availability: "Available",
      }));
      return;
    }

    const lastDate = new Date(selectedDate);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 3);

    const today = new Date();

    setFormData((prev) => ({
      ...prev,
      lastDonated: selectedDate,
      nextEligibleDate: nextDate.toISOString().split("T")[0],
      availability: today < nextDate ? "Unavailable" : "Available",
    }));
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {

    if (!formData.name.trim())
      return setPopup({ msg: "Enter full name", type: "error" });

    if (!/\S+@\S+\.\S+/.test(formData.email))
      return setPopup({ msg: "Enter valid email", type: "error" });

    if (formData.password.length < 6)
      return setPopup({ msg: "Password must be 6+ characters", type: "error" });

    if (formData.password !== formData.confirmPassword)
      return setPopup({ msg: "Passwords do not match", type: "error" });

    if (!formData.name.trim())
      return setPopup({ msg: "Enter full name", type: "error" });

    if (formData.phone.length !== 10) {
      return setPopup({
        msg: "Enter valid 10 digit mobile number",
        type: "error"
      });
    }
    const isPhoneValid = await verifyPhoneNumber(formData.phone);
    console.log(isPhoneValid);
    if (!isPhoneValid) return;

    if (!formData.dob)
      return setPopup({ msg: "Date of Birth is required", type: "error" });

    if (calculateAge(formData.dob) < 18)
      return setPopup({ msg: "Must be 18+ years old", type: "error" });

    try {
      setLoading(true);
      const response = await handlesendotp(formData);

      if (response?.success) {
        setToken(response.token);
        setOtpSent(true);
        setStep(2);
        setPopup({ msg: response.message, type: "success" });
      } else {
        setPopup({ msg: response.message, type: "error" });
      }
    } catch {
      setPopup({ msg: "Server Error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {

    if (otp.length !== 6)
      return setPopup({ msg: "Enter valid 6-digit OTP", type: "error" });

    try {
      setLoading(true);
      const response = await handleotpverification(formData, token, otp);

      if (response?.success) {
        setOtpVerified(true);
        setStep(3);
      } else {
        setPopup({ msg: "Invalid OTP", type: "error" });
      }
    } catch {
      setPopup({ msg: "Verification Failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.gender || formData.gender === "Choose Gender") {
      return setPopup({ msg: "Gender must be needed", type: "error" });
    }

    if (!formData.bloodGroup || formData.bloodGroup === "Blood Group") {
      return setPopup({ msg: "Blood Group must be needed", type: "error" });
    }

    if (!formData.address.fulladdress) {
      return setPopup({ msg: "Full Address must be needed", type: "error" });
    }

    if (!formData.address.city) {
      return setPopup({ msg: "City must be needed", type: "error" });
    }

    if (!formData.address.district) {
      return setPopup({ msg: "District must be needed", type: "error" });
    }

    if (!formData.address.state) {
      return setPopup({ msg: "State must be needed", type: "error" });
    }

    if (!formData.address.pincode) {
      return setPopup({ msg: "Pincode must be needed", type: "error" });
    }

    if (!formData.termsAccepted)
      return setPopup({ msg: "Accept Terms & Privacy Policy", type: "error" });

    try {
      const response = await handleUserRegistration(formData);

      if (response?.success) {
        setPopup({ msg: "Registration Successful", type: "success" });
        setTimeout(() => navigate("/homePage"), 1000);
      } else {
        setPopup({ msg: "Registration Failed", type: "error" });
      }
    } catch {
      setPopup({ msg: "Server Error", type: "error" });
    }
  };

  const steps = ["Account Info", "OTP Verification", "Medical History", "Address & Finalize"];

  return (
    <section className="signup-container">
      <Popup message={popup.msg} type={popup.type}
        onClose={() => setPopup({ msg: "", type: "" })} />

      <div>
        <div className="signup-header">
          <h1><img width="26" height="26" src="https://img.icons8.com/emoji/96/drop-of-blood-emoji.png" alt="drop-of-blood-emoji" /> Join as a Blood Donor</h1>
          <p>Donate Blood. Save Lives. Be a Hero.</p>
        </div>

        <div className="component-container">


          <Stepper activeStep={step - 1} alternativeLabel >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="signup-card">
            {/* ================= STEP 1 ================= */}
            {step === 1 && !otpSent && !otpVerified && (

              <div className="form-step">
                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleBasicChange} />
                <input name="email" placeholder="Email" value={formData.email} onChange={handleBasicChange} />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleBasicChange} />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleBasicChange} />
                <input name="phone" type="tel" maxLength="10" minLength="10" inputMode="numeric" value={formData.phone} placeholder="Phone" onChange={handleMobileNumberChange} />
                <input name="dob" type="date" value={formData.dob} onChange={handleBasicChange} />
                <div className="button-group">
                  <button type="button" className="back-btn" onClick={() => navigate("/")}><img src={backButton} alt="Back" /></button>
                  <button className="done-btn" type="button" onClick={handleSendOtp} disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* ================= OTP ================= */}
            {otpSent && step === 2 && (
              <div className="form-step">
                <input
                  name="otp-input"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  maxLength="6"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <div className="button-group">
                  <button type="button" className="back-btn" onClick={reSetState}><img src={cancleButton} alt="cancle"></img></button>
                  <button className="done-btn" type="button" onClick={handleVerifyOtp}> {loading ? "Verifying..." : "Verify OTP"}</button>
                </div>
              </div>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 3 && otpVerified && (
              <div className="form-step">
                <select name="anyDisease" value={formData.anyDisease} onChange={handleBasicChange} >
                  <option value="No">Any Disease? - No</option>
                  <option value="Yes">Yes</option>
                </select>

                {formData.anyDisease === "Yes" && (
                  <input name="diseaseDetails" value={formData.diseaseDetails}  placeholder="Disease Details" onChange={handleBasicChange} />
                )}

                <select name="isOnMedication" value={formData.isOnMedication} onChange={handleBasicChange}>
                  <option value="No">On Medication? - No</option>
                  <option value="Yes">Yes</option>
                </select>

                {formData.isOnMedication === "Yes" && (
                  <input name="medicationDetails" value={formData.medicationDetails} placeholder="Medication Details" onChange={handleBasicChange} />
                )}

                <select name="hasAllergy" value={formData.hasAllergy} onChange={handleBasicChange}>
                  <option value="No">Any Allergy? - No</option>
                  <option value="Yes">Yes</option>
                </select>

                {formData.hasAllergy === "Yes" && (
                  <input name="allergyDetails" value={formData.allergyDetails} placeholder="Allergy Details" onChange={handleBasicChange} />
                )}

                <select name="recentSurgery" value={formData.recentSurgery} onChange={handleBasicChange}>
                  <option value="No">Recent Surgery? - No</option>
                  <option value="Yes">Yes</option>
                </select>

                {formData.recentSurgery === "Yes" && (
                  <input name="surgeryDetails" value={formData.surgeryDetails} placeholder="Surgery Details" onChange={handleBasicChange} />
                )}

                <select name="covidVaccinated" value={formData.covidVaccinated} onChange={handleBasicChange}>
                  <option value="Yes">Covid Vaccinated - Yes</option>
                  <option value="No">No</option>
                </select>

                <select name="smoker" value={formData.smoker} onChange={handleBasicChange}>
                  <option value="No">Smoker - No</option>
                  <option value="Yes">Yes</option>
                </select>

                <select name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleBasicChange}>
                  <option value="No">Alcohol Consumption - No</option>
                  <option value="Yes">Yes</option>
                </select>

                <input name="totalDonations" value={formData.totalDonations} type="number" placeholder="Total Donations" onChange={handleBasicChange} />

                {formData.totalDonations > 0 && (
                  <input name="lastDonated" value={formData.lastDonated} type="date" placeholder="Enter Your last Donated Date" onChange={handleLastDonatedChange} />
                )}

                <select name="availability" value={formData.availability} onChange={handleBasicChange} >
                  <option value="Unavailable">Unavailable</option>
                  <option value="Available">Available</option>
                </select>

                {formData.availability === "Available" && (
                  <p >
                    <input name="donationDate" type="date" placeholder="Enter Your last Donated Date" value={formData.donationDate} min={formData.nextEligibleDate} onChange={handleDonationDateChange} />
                    {/* You can donate again after {formData.nextEligibleDate} */}
                  </p>
                )}

                <div className="button-group">
                  <button className="back-btn" onClick={reSetState}><img alt="" src={backButton} /></button>
                  <button className="done-btn" onClick={() => setStep(4)}>Next</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <form onSubmit={handleSubmit} className="form-step">

                <select name="gender" value={formData.gender} placeholder="Gender" onChange={handleBasicChange}>
                  <option>Choose Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <select name="bloodGroup" onChange={handleBasicChange}>
                  <option value="">Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>

                <input name="weight" type="number" placeholder="Weight (kg)" onChange={handleBasicChange} />
                <input name="height" type="number" placeholder="Height (cm)" onChange={handleBasicChange} />

                <input name="fulladdress" placeholder="Address" value={formData.address.fulladdress} onChange={handleAddressChange} />
                <input name="city" placeholder="City" value={formData.address.city} onChange={handleAddressChange} />
                <input name="district" placeholder="District" value={formData.address.district} onChange={handleAddressChange} />
                <select name="state" value={formData.address.state} onChange={handleAddressChange}>
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu"> Dadra and Nagar Haveli and Daman and Diu </option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option>
                </select>
                <input name="pincode" maxLength="6" inputMode="numeric" value={formData.address.pincode} placeholder="Enter 6-digit Pincode" onChange={handlePincodeChange} />

                <input name="emergencyContactName" placeholder="Emergency Contact Name" onChange={handleBasicChange} />
                <input name="emergencyContactNumber" placeholder="Emergency Contact Number" onChange={handleBasicChange} />

                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  I agree to the <a href="hello">Terms</a> & <a href="hello">Privacy Policy</a>
                </label>

                <div className="button-group">
                  <button type="button" className="back-btn" onClick={()=>setStep(3)}><img alt="" src={backButton} />
                  </button>
                  <button className="done-btn" onClick={handleSubmit} type="submit">
                    Complete Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
      <div className="notes-section">
        <h2>📝 Important Donor Guidelines</h2>

        <div className="guidelines-scroll">
          <ul>
            <li>✔ Age must be between 18 – 65 years.</li>
            <li>✔ Minimum weight should be at least 50 kg.</li>
            <li>✔ Hemoglobin level should be 12.5 g/dL or higher.</li>
            <li>✔ Minimum gap between donations: 3 months.</li>
            <li>✔ Must be in good general health at the time of donation.</li>
            <li>✔ No fever, cold, or infection in the last 7 days.</li>
            <li>✔ No recent major surgery (within 6 months).</li>
            <li>✔ Not currently under heavy medication.</li>
            <li>✔ Avoid alcohol 24 hours before donation.</li>
            <li>✔ Carry valid government ID proof during donation.</li>
            <li>✔ Stay hydrated and eat a healthy meal before donating.</li>
          </ul>
        </div>

        <div className="eligibility-note">
          <h3>⚠ Temporary Deferrals</h3>
          <div className="eligibility-scroll">
            <ul>
              <li>• Received vaccination within 14 days.</li>
              <li>• Had dental extraction within 3 days.</li>
              <li>• Got a tattoo or piercing in the last 6 months.</li>
              <li>• Tested positive for COVID-19 within 28 days.</li>
              <li>• Got a tattoo or piercing in the last 6 months.</li>
              <li>• Tested positive for COVID-19 within 28 days.</li>
            </ul>
          </div>
        </div>

        <div className="emergency-box">
          <h3>🚨 Emergency Helpline</h3>
          <p>
            In case of urgent blood requirement, contact your nearest blood bank or
            hospital immediately.
          </p>
          <p><strong>National Blood Helpline (India): 104</strong></p>
        </div>
      </div>
    </section>
  );
};






// test