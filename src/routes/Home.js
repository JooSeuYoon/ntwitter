import React, {useEffect, useState} from "react";
import { dbService, storageService } from "fbInstance";
import { addDoc, collection ,doc,getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import Nweet from "components/Nweets";
import { ref, uploadString, getDownloadURL} from "@firebase/storage"
import { v4 as uuidv4} from 'uuid';

const Home = ({userObj}) => {
    const[nweet, setNweet] = useState("");
    const[nweets, setNweets] = useState([]);
    const [attachment, setattachment] = useState();

    const que = query(collection(dbService, "nweets"), orderBy('createdAt', 'desc'));    
    
    const getNweets = async() => {
        const querySnapshot = await getDocs(que);
        querySnapshot.forEach( (document) => {
            const nweetObj = {
                ...document.data(),
                id : document.id,
            };
            setNweets(prev => [nweetObj, ...prev]);
        });
    }
    useEffect(() => {
        getNweets();
        
        onSnapshot(que, (snapshot) =>{
            const nweetArray = snapshot.docs.map((doc) => ({
                id : doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        }
    );

    },[]);

    const onSubmit = async (event) =>{
        event.preventDefault();
        console.log(`느윗 : ${nweet}`);
        const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);

        const response = await uploadString(fileRef, attachment, "data_url");
        //console.log(response);

        const attachmentUrl = await getDownloadURL(response.ref);
        console.log(attachmentUrl)

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
        <div>
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

            <div>
                {nweets.map( (nweet) => (
                <Nweet key = {nweet.id} nweetObj = {nweet} isOwner = {nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};
export default Home;