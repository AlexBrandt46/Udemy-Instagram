import React, {useEffect, useState, useContext} from "react";
import {UserContext} from '../../App'

const Profile = ()=>{

    const [posts, setPosts] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")

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

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "dz3kbar9h")
            fetch("https://api.cloudinary.com/v1_1/dz3kbar9h/image/upload",
            {
                method: "post",
                body: data
            })
            .then(res=>res.json())
            .then(data=>{
                fetch('/updatePic', {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                }).then(res => res.json())
                .then(result => {
                    console.log(result)
                    localStorage.setItem('user',JSON.stringify({
                        ...state,
                        pic: data.pic
                    }))

                    dispatch({
                        type: "UPDATEPIC",
                        payload: result.pic
                    })
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }, [image])

    const UpdatePhoto = (file) => {
        setImage(file)
    }

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
                    <div className="file-field input-field">
                        <div style={{marginBottom: "1vh", width: "160px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1">
                            <span>Update Profile Pic</span>
                            <input 
                                type="file"
                                onChange={(e)=>UpdatePhoto(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
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