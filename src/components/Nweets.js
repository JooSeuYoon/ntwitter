import React, { useState } from "react";
import { dbService, storageService } from "fbInstance";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash, faPencilAlt} from "@fortawesome/free-solid-svg-icons"

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

            if(nweetObj.attachmentUrl){
                console.log(`사진 삭제`);
                const urlRef = ref(storageService, nweetObj.attachmentUrl);
                await deleteObject(urlRef);
            }
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
    <div className="nweet">
        {editing ? (
            <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <input type="text" placeholder="Edit your nweet" value = {newNweet} required autoFocus onChange={onChange} className="formInput"/>
                    <input type="submit" value="Update Nweet" className="formBtn"/>
                </form>
                <button onClick={toggleEditing} className="forBtn cancelBtn">Cancel</button>
            </>
        ) : (
        <>
        <h4>{nweetObj.text}</h4>
        {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
        {isOwner && (
        <div className="nweet__actions">
            <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon = {faTrash} />
            </span>
            <span onClick={toggleEditing}>
                <FontAwesomeIcon icon = {faPencilAlt} />
            </span>
        </div>
        )}
        </>
        )}
    </div>
    );
}

export default Nweet;