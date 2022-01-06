import React, {useState, useEffect} from "react";
import AppRouter from "components/Router";
import {authService} from "fbInstance"

function App() {
  const [initialized, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(()=>{
    authService.onAuthStateChanged((user) =>{
      if(user){
        setIsLoggedIn(true);
        setUserObj(user);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[])
  // setInterval(()=>{
  //   console.log(authService.currentUser);
  // }, 200)
  return (
    <>
    {initialized ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
