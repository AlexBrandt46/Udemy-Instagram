import React, {useEffect, useState, useContext} from "react";
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile = ()=>{

    const [userProfile, setProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()

    useEffect(() => {
        fetch(`/user/${userId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result => {
            setProfile(result)
        })
    }, [])

    return (
        <>
            {userProfile ? 
                <div style={{maxWidth: "500px", margin: "0px auto"}}>
                <div id="" style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid grey"
                }}>
                    <div>
                        <img 
                            style={{width: "160px", height:"160px", borderRadius:"80px"}}
                            src="https://images.unsplash.com/photo-1475692277358-d66444784d6b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                        />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{display:"flex", justifyContent: "space-between", width:"108%"}}>
                            <h6>{userProfile.posts.length} Posts</h6>
                            <h6>40 Followers</h6>
                            <h6>40 Following</h6>
                        </div>
                    </div>
                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map(item => {
                            return (
                                <img key={item._id} className="itemPhoto" alt={item.title} src={item.photo} />
                            )
                        })
                    }
                </div>
            </div>
        : <h2>Loading</h2>}
            
        </>
    )
}

export default Profile