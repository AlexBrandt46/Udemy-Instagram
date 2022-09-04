import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = ()=> {

    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    // Happens when we successfully update the url value with setUrl function in postDetails which is called whenever the post button is pressed
    useEffect(()=>{
        if (url) {
            fetch('/createpost', {
                method:"post",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt") // Gets the token stored when user logs in in server/auth with /login and stores the authorization info in the http header
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if (data.error) {
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }
                else {
                    M.toast({html: "Post Successfully Created", classes: "#43a047 green darken-1"})
                    navigate('/')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },[url])

    const postDetails = () => {
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
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return (
        <div className="card input-filed" id="post-create-card">
            <input 
                type="text" 
                placeholder="Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)} />
            <input 
                type="text" 
                placeholder="Body"
                value={body}
                onChange={(e)=>setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn blue darken-1">
                    <span>Upload Image</span>
                    <input 
                        type="file"
                        onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>postDetails()}>Submit Post</button>
        </div>
    )
}

export default CreatePost