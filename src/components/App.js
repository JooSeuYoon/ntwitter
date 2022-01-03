import React, {useState, useEffect} from "react";
import AppRouter from "components/Router";
import {authService} from "fbInstance"

function App() {
  const [initialized, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
    authService.onAuthStateChanged((user) =>{
      if(user){
        setIsLoggedIn(true);
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
    {initialized ? <AppRouter isLoggedIn={isLoggedIn}/> : "Initializing..."}
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
