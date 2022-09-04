import React, {useContext} from "react";
import {UserContext} from '../App'
import {Link} from 'react-router-dom'

const Post = (item) => {

    const {state, dispatch} = useContext(UserContext)

    return (
        <div className="card home-card" key={item.item._id}>
            <div style={{display: "flex"}} className="postHeader">
                <img src={item.item.postedBy.pic} className="postedByImage"/>
                <h5 className="postedByHeader"><Link to={item.item.postedBy._id !== state._id ? "/profile/" + item.item.postedBy._id : "/profile"  }>{item.item.postedBy.name}</Link></h5>
                <div className="deleteBtnContainer">
                    {item.item.postedBy._id == state._id && <Link to={"/editPost/" + item.item._id}><i className="material-icons" style={{ float:"right" }}>edit</i></Link>}
                    {item.item.postedBy._id == state._id && <i className="material-icons" style={{ float:"right" }} onClick={()=>deletePost(item.item._id, item.data, item.setData)}>delete</i>}
                </div>
            </div>
            <div className="card-image">
                <img src={item.item.photo} />
            </div>
            <div className="card-content">
                <i className="material-icons" style={{color: "red"}}>favorite</i>
                {item.item.likes.includes(state._id) ? 
                    <i className="material-icons" onClick={() => {unlikePost(item.item._id, item.data, item.setData)}}>thumb_down</i> :
                    <i className="material-icons" onClick={() => {likePost(item.item._id, item.data, item.setData)}}>thumb_up</i>
                }
                <h6>{item.item.likes.length} Likes</h6>
                <h6>{item.item.title}</h6>
                <p>{item.item.body}</p>
                {
                    item.item.comments.map(record => {
                        return (
                            <div className="commentBlock">
                                <img src={ record.postedBy.pic } className="postedByImage"/>
                                <h6 key={ record._id }>
                                    <span className="commentPoster" style={{ fontWeight: "bold" }}><Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"  }>{record.postedBy.name}</Link></span> 
                                    <span className="commentContents">{record.text}</span>
                                </h6>
                            </div>
                        )
                    })
                }
                <form onSubmit={(e) => { 
                    e.preventDefault()
                    makeComment(e.target[0].value, item.item._id, item.data, item.setData)
                }}>
                    <input type="text" placeholder="Add a comment" />
                </form>
            </div>
        </div>
    )
}

const likePost = (id, data, setData)=> {
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

const unlikePost = (id, data, setData)=> {
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

const makeComment = (comment, postId, data, setData)=> {
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

const deletePost = (postId, data, setData)=> {
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

export default Post