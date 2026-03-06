import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WelcomePage } from "./componet/WelcomePage.jsx"
import { Signup } from "./componet/SignupPage.jsx"
import {HomePage } from "./componet/HomePage.jsx"
import ForgetPass from "./componet/ForgotPassword.jsx"

export default function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/signUp" element={<Signup />} />
            <Route path="/logIn" element={<Signup />} /> 
            <Route path='/homePage' element={<HomePage/>} />
            <Route path='/forget-Password' element={<ForgetPass/>} />
          </Routes>
        </Router>
    </div>
  );
}


