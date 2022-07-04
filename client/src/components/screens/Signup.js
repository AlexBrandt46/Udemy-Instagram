import React, {useState, useEffect} from "react"
import {Link, useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const Login = ()=>{

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    useEffect(() => {
        if (url) {
            PostData();
        }
    }, [url])

    const CreateProfile = () => {
        if (image) {
            UploadPic();
        }
        else {
            PostData();
        }
    }

    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html: "Invalid Email", classes: "#c62828 red darken-3"})
        }
        else {
            fetch("/signup", 
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    password, 
                    email,
                    pic: url
                })
            }).then(res=>res.json())
            .then(data=>{
                if (data.error) {
                    M.toast({html: data.error, classes: "#c62828 red darken-3"})
                } 
                else {
                    M.toast({html: data.message, classes: "#43a047 green darken-1"})
                    navigate('/login')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }

    const UploadPic = () => {
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
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input 
                    type="text" 
                    placeholder="name" 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)}/>
                <input 
                    type="text" 
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)} />
                <input 
                    type="password" 
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn blue darken-1">
                        <span>Profile Picture</span>
                        <input 
                            type="file"
                            onChange={(e)=>setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>CreateProfile()}>Sign Up</button>
                <h5>
                    <Link to="/login">Already Have an Account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Login