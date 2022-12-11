import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Register from './Components/Register';
import Login from './Components/Login';
import { useEffect, useState } from 'react';
import Home from './Components/Home';
import NotFound from './Components/NotFound';
import jwtDecode from 'jwt-decode';


function App() {
  const [userData, setuserData] = useState(null);
  let navigate = useNavigate();

  function saveUserData() {
    let encodedToken = localStorage.getItem("userToken");
    let decodedToken = jwtDecode(encodedToken);
    setuserData(decodedToken);
    // console.log(decodedToken);
  }

  function logOut() {
    localStorage.removeItem("userToken");
    setuserData(null);
    navigate('/login');
  }

  useEffect(() => {//handle hide nav links when refreshing the page
    if (localStorage.getItem("userToken")) {
      saveUserData()
    }
  }, []);

  function ProtectedRoute(props) {
    if (localStorage.getItem("userToken") === null) {
      return <Navigate to="/login" /> // bring component login
    }
    else {
      return props.children
    }
  }
  return (
    < >

      <Navbar userData={userData} logOut={logOut} />
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
        <Route path='home' element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
        <Route path='login' element={<Login saveUserData={saveUserData} />}></Route>
        <Route path='register' element={<Register />}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>

    </>
  );
}

export default App;
