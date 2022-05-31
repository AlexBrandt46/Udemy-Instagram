import React, {useContext} from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {UserContext} from '../App'

const logout = () => {
    
}

const NavBar = ()=>{

    // State has the details about the user if there's a JWT token
    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const renderList = () => {
        if (state) {
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Create Post</Link></li>,
                <li><Link to="/myfollowerspost">My Following Posts</Link></li>,
                <li>
                    <button className="btn #c62828 red darken-3" 
                        onClick={()=>{
                            localStorage.clear()
                            dispatch({type: "CLEAR"})
                            navigate('/login')
                        }}>
                        Logout
                    </button>
                </li>
            ]
        }
        else {
            return [
                <li><Link to="/login">Login</Link></li>,
                <li><Link to="/signup">Sign Up</Link></li>
            ]
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={ state? "/" : "/login" } className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;