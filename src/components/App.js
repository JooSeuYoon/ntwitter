import React, {useState, useEffect} from "react";
import AppRouter from "components/Router";
import {authService} from "fbInstance"
import { updateProfile } from "firebase/auth";

function App() {
  const [initialized, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(()=>{
    authService.onAuthStateChanged((user) =>{
      if(user){
        setIsLoggedIn(true);
        setUserObj({
          displayName : user.displayName,
          uid : user.uid,
          updateProfile : (args) => updateProfile(user, {displayName: user.displayName}),
        });
      }else{
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  },[])
  // setInterval(()=>{
  //   console.log(authService.currentUser);
  // }, 200)

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName : user.displayName,
      uid : user.uid,
      updateProfile : (args) => updateProfile(user, {displayName: user.displayName}),
    });
  };

  return (
    <>
    {initialized ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."}
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
