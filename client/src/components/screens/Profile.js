import React, {useEffect, useState, useContext} from "react";
import {UserContext} from '../../App'

const Profile = ()=>{

    const [posts, setPosts] = useState([])
    const {state, dispatch} = useContext(UserContext)

    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setPosts(result.myPosts)
        })
    }, [])

    return (
        <div style={{maxWidth: "600px", margin: "0px auto"}}>
            <div id="" style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div style={{width: "160px", borderRadius:"80px"}}>
                    <img 
                        style={{width: "160px", height:"160px", borderRadius:"80px"}}
                        src={state ? state.pic : "Loading"}
                    />
                    <button style={{marginBottom: "1vh"}} className="btn waves-effect waves-light #64b5f6 blue darken-1">Update Profile Pic</button>
                </div>
                <div style={{    
                    justifyContent: "space-around",
                    display: "flex",
                    flexDirection: "column"}}>
                    <h4>{state ? state.name : 'loading' }</h4>
                    <h4>{state ? state.email : 'loading' }</h4>
                    <div style={{display:"flex", justifyContent: "space-between", width:"108%"}}>
                        <h6>{posts.length} Posts</h6>
                        <h6>{state ? state.followers.length : "0"} Followers</h6>
                        <h6>{state ? state.following.length : "0"} Following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    posts.map(item => {
                        return (
                            <img key={item._id} className="itemPhoto" alt={item.title} src={item.photo} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile