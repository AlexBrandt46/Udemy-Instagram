import React, {useState, useEffect, useContext} from "react";
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

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

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item => {
                // Case for if the record has been updated
                if (item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
            })

            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result => {
            const newData = data.map(item => {
                // Case for if the record has been updated
                if (item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
            })

            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const makeComment = (comment, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: comment
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                // Case for if the record has been updated
                if (item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const deletePost = (postId) => {
        fetch(`/deletePost/${postId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return (
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <div style={{display: "flex"}} className="postHeader">
                                <img src={item.postedBy.pic} className="postedByImage"/>
                                <h5 className="postedByHeader"><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"  }>{item.postedBy.name}</Link></h5>
                                <div className="deleteBtnContainer">
                                    {item.postedBy._id == state._id && <i className="material-icons" style={{ float:"right" }} onClick={()=>deletePost(item._id)}>delete</i>}
                                </div>
                            </div>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color: "red"}}>favorite</i>
                                {item.likes.includes(state._id) ? 
                                    <i className="material-icons" onClick={() => {unlikePost(item._id)}}>thumb_down</i> :
                                    <i className="material-icons" onClick={() => {likePost(item._id)}}>thumb_up</i>
                                }
                                <h6>{item.likes.length} Likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <div className="commentBlock">
                                                <img src={ record.postedBy.pic } className="postedByImage"/>
                                                <h6 key={ record._id }>
                                                    <span className="commentPoster" style={{ fontWeight: "bold" }}>{record.postedBy.name}</span> 
                                                    <span className="commentContents">{record.text}</span>
                                                </h6>
                                            </div>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => { 
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="Add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home