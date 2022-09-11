import React, {useContext, useRef, useEffect, useState} from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = ()=>{

    // State has the details about the user if there's a JWT token
    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const searchModal = useRef(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        M.Modal.init(searchModal.current)
    })

    const renderList = () => {
        if (state) {
            return [
                <li key="1"><i data-target="modal1" className='large material-icons modal-trigger' style={{color: "black"}}>search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowerspost">My Following Posts</Link></li>,
                <li key="5">
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
                <li key="6"><Link to="/login">Login</Link></li>,
                <li key="7"><Link to="/signup">Sign Up</Link></li>
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
            <div id="modal1" className="modal" ref={searchModal}>
                <div className="modal-content" style={{color: 'black'}}>
                    <input 
                        type="text" 
                        placeholder="Search Users"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                    <ul className="collection">
                        <li className="collection-item">Alvin</li>
                        <li className="collection-item">Alvin</li>
                        <li className="collection-item">Alvin</li>
                        <li className="collection-item">Alvin</li>
                        <li className="collection-item">Alvin</li>
                        <li className="collection-item">Alvin</li>
                        <li className="collection-item">Alvin</li>
                        <li className="collection-item">Alvin</li>
                        <li className="collection-item">Alvin</li>
                        <li className="collection-item">Alvin</li>
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat">Agree</button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;