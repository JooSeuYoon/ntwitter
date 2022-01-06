import React, {useEffect, useState} from "react";
import { dbService } from "fbInstance";
import { addDoc, collection ,doc,getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import Nweet from "components/Nweets";

const Home = ({userObj}) => {
    const[nweet, setNweet] = useState("");
    const[nweets, setNweets] = useState([]);
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
        await addDoc(collection(dbService, "nweets"),{
            text: nweet, 
            createdAt: Date.now(),
            creatorId : userObj.uid,
        });
        setNweet("");
    };

    const onChange = (event) => {
        const {target : {value}, } = event;
        setNweet(value);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type = "text" placeholder="What's on your mind? " maxLength={120} />
                <input type = "submit" value="Nweet"/>
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