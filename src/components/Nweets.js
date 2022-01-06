import React, { useState } from "react";
import { dbService } from "fbInstance";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Nweet = ({nweetObj, isOwner}) => {
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete?");
        if(ok){
            //delete nweet
            console.log(NweetTextRef.id)
            await deleteDoc(NweetTextRef);
        }
    };

    const onSubmit = async(event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef, { text : newNweet });
        setEditing(false);
    }

    const onChange = (event) => {
        const {
            target : { value },
        } = event;
        setNewNweet(value);
    }

    const toggleEditing = () => setEditing((prev) => !prev);

    return (
    <div>
        {editing ? (
            <>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Edit your nweet" value = {newNweet} required onChange={onChange}/>
                    <input type="submit" value="Update Nweet" />
                </form>
                <button onClick={toggleEditing}>Cancel</button>
            </>
        ) : (
        <>
        <h4>{nweetObj.text}</h4>
        {isOwner && ( <><button onClick={onDeleteClick}>Delete Nweet</button></> ) }
        {isOwner && ( <><button onClick={toggleEditing}>Edit Nweet</button></> ) }
        </>
        )}
    </div>
    );
}

export default Nweet;