import { useState } from "react";
import { sendOtpAPI, verifyOtpAPI, updatePassAPI} from "../Connection/ForgotPasswordConnection.jsx";
import {useNavigate}  from 'react-router-dom'
import Popup from "../PopUP/Popup.jsx"

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setNewPassword] = useState("");
  const [message, setPopup] = useState("");
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  const [result, setResult] = useState({
    email: "",
    password: "",
  });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await sendOtpAPI({ email });
    setLoading(false);

    if (result.success) {
      setPopup(result.message);
      setStep(2);
    } else {
      setPopup(result.message);
    }
  };




  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await verifyOtpAPI({email, otp})
    setLoading(false);
    if (result.success) {
      setPopup(result.message);
      setStep(3);
    } else {
      setPopup(result.message);
    }
  }


  

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(false)
    const result = await updatePassAPI({email,password: password,
    });
    setLoading(true)

    if (result.success) {
      setPopup(result.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      setPopup(result.message);
    }
  };



  return (
      <section>

        <Popup 
        message={Popup.msg} 
        type={Popup.type} 
        onClose={() => setPopup({ msg: "", type: "" })} 
      />

    <div>
      <div className="login-content active-style">
      <h1 className="site-content">🩸 Blood Donation <span>Portal</span></h1>
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">
              {loading ? "Sending..." : "Send OTP"}
            </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">{loading ? "Verifying..." : "Verify OTP"}</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">{loading ? "Updating..." : "Reset Password"}</button>
        </form>
      )}
      </div>
    </div>
      </section>
  );
};

export default ForgotPassword;