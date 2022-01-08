import { dbService, storageService } from "fbInstance";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState } from "react";
import { v4 as uuidv4} from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    const[nweet, setNweet] = useState("");
    const[attachment, setattachment] = useState();

    const onSubmit = async (event) =>{
        event.preventDefault();
        let attachmentUrl = "";
        
        if(nweet === "") {
            return;
        }

        if(!(attachment == "" || attachment == undefined)){
            console.log(`이미지 파일 작업 진입`)
            const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);

            const attachmentRef = await uploadString(fileRef, attachment, "data_url");
            //console.log(response);

            attachmentUrl = await getDownloadURL(attachmentRef.ref);
        }

        await addDoc(collection(dbService, "nweets"),{
            text: nweet, 
            createdAt: Date.now(),
            creatorId : userObj.uid,
            attachmentUrl,
        });
        setNweet("");
        setattachment("");
    };

    const onChange = (event) => {
        const {target : {value}, } = event;
        setNweet(value);
    }

    const onFileChange = (event) => {
        const {target : {files},} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result},} = finishedEvent;
            setattachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onDeleteUpload = () => {
        setattachment("");
        
    }

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="factoryInput__input" value={nweet} onChange={onChange} type = "text" placeholder="What's on your mind?" maxLength={120} />
                <input type = "submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add Photos</span>
                <FontAwesomeIcon icon = {faPlus} />
            </label>
            <input id = "attach-file" type="file" accept="image/*" onChange={onFileChange} style= {{opacity : 0}} />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img src = {attachment} style = {{backgroundImage : attachment,}} />
                    <div className="factoryForm__clear" onClick={onDeleteUpload}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon = {faTimes} />
                    </div>
                </div>
            )}
        </form>
    )
};

export default NweetFactory;