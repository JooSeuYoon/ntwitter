import { authService } from "fbInstance";
import React, {useState} from "react";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup
    } from 'firebase/auth';

const Auth = () => { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccout, setNewAccout] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) =>{
        const {target : {name, value}} = event;
        if(name == "email"){
            setEmail(value)
        }else if (name == "password"){
            setPassword(value)
        }
    }
    const onSubmit = async(event) =>{
        event.preventDefault();
        try{
            let data;
            if(newAccout){
                //create account
                data = await createUserWithEmailAndPassword(authService, email, password);
            }else{
                //log in
                data = await signInWithEmailAndPassword(authService, email, password);
            }
            console.log(data);
        }catch(error){
            setError(error.message);

        }
    }

    const toggleAccount = () => setNewAccout(prev => !prev);
    const onSocialClick = async(event) =>{
        const {target :{name },} = event;
        let provider;
        if(name === "google"){
            provider = new GoogleAuthProvider();
        }else if (name === "github"){
            provider = new GithubAuthProvider();
        }
        
        const data = await signInWithPopup(authService, provider);
        console.log(data);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name = "email" type = "text" placeholder="Email" required = "email" value = {email} onChange={onChange}></input>
                <input name = "password" type = "password" placeholder="Password" required = "password" value = {password} onChange={onChange}></input>
                <input type = "submit" value={newAccout ? "Create Account" : "Log In"} />
            </form>
            {error}
            <span onClick={toggleAccount}>{newAccout ? "Sign In" : "Create Account"}</span>
            <div>
                <button onClick={onSocialClick} name = "google">Continue with Google</button>
                <button onClick={onSocialClick} name = "github">Continue with GitHub</button>
            </div>
        </div>
        );
};
export default Auth;