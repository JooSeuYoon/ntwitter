import { authService } from "fbInstance";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";

const inputStyles = { };

const AuthForm = () => {

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


    return (
        <>
        <form onSubmit={onSubmit} className="container">
            <input name = "email" type = "text" placeholder="Email" required = "email" value = {email} onChange={onChange} className="authInput"></input>
            <input name = "password" type = "password" placeholder="Password" required = "password" value = {password} onChange={onChange} className="authInput"></input>
            <input type = "submit" className="authInput authSubmit" value={newAccout ? "Create Account" : "Log In"} />
            {error && <span className="authError">{error}</span>}
        </form>
        <span onClick={toggleAccount} className="authSwitch">{newAccout ? "Sign In" : "Create Account"}</span>
        </>
    )
};

export default AuthForm;