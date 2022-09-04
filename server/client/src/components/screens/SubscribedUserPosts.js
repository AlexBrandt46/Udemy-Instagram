import React, {useState, useEffect, useContext} from "react";
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import Post from '../Post'

const Home = () => {

    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)

    // Verifies that user is logged in only when page is first rendered
    useEffect(()=>{
        fetch('/subscribedposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt") // Gets the token stored when user logs in in server/auth with /login
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    }, [])

    return (
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <Post item={ item } data={data} setData={setData} />
                    )
                })
            }
        </div>
    )
}

export default Home