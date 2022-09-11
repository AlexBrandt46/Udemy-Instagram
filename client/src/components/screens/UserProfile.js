import React, {useEffect, useState, useContext} from "react";
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile = ()=>{

    const [userProfile, setProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId) : true)

    useEffect(() => {

        console.log('test')

        fetch(`/user/${userId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result => {
            setProfile(result)
        })
    })

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                followId: userId
            })
        })
        .then(res => res.json())
        .then(data => {
            dispatch({type: "UPDATE", payload: {
                following: data.following,
                followers: data.followers
            }})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        })
        .then(res => res.json())
        .then(data => {
            dispatch({type: "UPDATE", payload: {
                following: data.following,
                followers: data.followers
            }})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                const newFollowers = prevState.user.followers.filter(item => item != data._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollowers
                    }
                }
            })
            setShowFollow(true)
        })
    }

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
                            src={userProfile.user.pic}
                        />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{display:"flex", justifyContent: "space-between", width:"108%"}}>
                            <h6>{userProfile.posts.length} Posts</h6>
                            <h6>{userProfile.user.followers.length} Followers</h6>
                            <h6>{userProfile.user.following.length} Following</h6>
                        </div>
                        {
                            showFollow ?
                                <button style={{margin: "1vh"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={followUser}>Follow</button> :
                                <button style={{margin: "1vh"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={unfollowUser}>Unfollow</button>
                        }
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