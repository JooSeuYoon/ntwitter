import { authService, dbService } from "fbInstance";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react/cjs/react.development";


export default ( { refreshUser, userObj} ) => {
    const history = useHistory();

    const[newDisplayName, setDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const getMyNweets = async() => {
        const q = query(collection(dbService, "nweets"), where("creatorId","==",userObj.uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        });
    };

    useEffect(() => {
        getMyNweets();
    },[])

    const onChange = (event) => {
        const { target : {value}, } = event;
        setDisplayName(value);
    };

    const onSubmit = async(event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser, {displayName : newDisplayName});
            refreshUser();
        }
    }

    return (
        <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type = "text" placeholder="Display name" value={newDisplayName}/>
            <input type = "submit" value="Update Profile" />
        </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}