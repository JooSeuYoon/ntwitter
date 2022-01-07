import { dbService, storageService } from "fbInstance";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState } from "react";
import { v4 as uuidv4} from 'uuid';

const NweetFactory = ({userObj}) => {
    const[nweet, setNweet] = useState("");
    const[attachment, setattachment] = useState();

    const onSubmit = async (event) =>{
        event.preventDefault();
        let attachmentUrl = "";
        console.log(`느윗 : ${nweet}`);
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
        setattachment(null);
        
    }

    return (
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type = "text" placeholder="What's on your mind? " maxLength={120} />
            <input type = "file" accept="image/*" onChange={onFileChange}/>
            <input type = "submit" value="Nweet"/>
            {attachment && (
                <div>
                    <img src = {attachment} width="50px" height="50px" />
                    <button onClick={onDeleteUpload}>Cancel upload</button>
                </div>
            )}
        </form>
    )
};

export default NweetFactory;