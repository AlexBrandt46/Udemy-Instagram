import React, {useEffect, createContext, useReducer, useContext} from 'react'
import NavBar from './components/Navbar'
import './App.css'
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'
import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

// Runs on the initial rendering of the app
const Routing = ()=>{

  const navigate = useNavigate()
  const {state, dispatch} = useContext(UserContext)

  useEffect(()=>{
    // Gets the user that was stored in localStorage when /login API call was made
    const user = JSON.parse(localStorage.getItem("user"))

    if (user) {
      dispatch({type:"USER", payload:user})
    }
    else {
      navigate('/login')
    }
  },[])

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/myfollowerspost" element={<SubscribedUserPosts />} />
    </Routes>
  )
}

function App() {
  // Have to use square brackets so function is stored and can be referenced
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
