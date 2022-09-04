import {useParams} from 'react-router-dom'
import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const EditPost = () => {

    const {postId} = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")

    useEffect(() => {
        fetch(`/post/${postId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result => {
            console.log(result)
            setTitle(result.post.title)
            setBody(result.post.body)
        })
    }, [])

    const editPost = (postId) => {

        console.log(title + " " + body)

        fetch(`/post/edit/${postId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title,
                body
            })
        }).then(res => res.json())
        .then(data=>{
            if (data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else {
                M.toast({html: "Post Successfully Updated", classes: "#43a047 green darken-1"})
                navigate('/')
            }
        }).catch(err=>{
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
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>editPost(postId)}>Edit Post</button>
        </div>
    )
}

export default EditPost

