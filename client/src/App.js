import React from 'react'
import NavBar from './components/Navbar'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
