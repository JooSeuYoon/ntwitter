import React, {useEffect, useState} from "react";
import { dbService } from "fbInstance";
import { collection ,getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import Nweet from "components/Nweets";
import NweetFactory from "components/NweetFactory";


const Home = ({userObj}) => {
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


    return (
        <div>
            <NweetFactory userObj={userObj} />
            <div>
                {nweets.map( (nweet) => (
                <Nweet key = {nweet.id} nweetObj = {nweet} isOwner = {nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};
export default Home;