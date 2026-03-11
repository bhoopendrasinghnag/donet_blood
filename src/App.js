import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WelcomePage } from "./componet/WelcomePage.jsx"
import { Signup } from "./componet/SignupPage.jsx"
import { HomePage } from "./componet/HomePage.jsx"
import ForgetPass from "./componet/ForgotPassword.jsx"
import SearchMap from "./componet/Map.jsx"

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          {/* <LocationPermission /> */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signUp" element={<Signup />} />
          <Route path='/homePage' element={<HomePage />} />
          <Route path='/forget-Password' element={<ForgetPass />} />
          <Route path='/search-map' element={<SearchMap />} />


        </Routes>
      </Router>
    </div>
  );
}


