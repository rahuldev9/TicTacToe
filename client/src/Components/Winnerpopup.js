import React, { useEffect, useState } from "react";


const Winnerpopup = ({ onClose, gamestatus,winstate,player }) => {
  const [winmsg,setwinmsg]=useState("")
  const gameStatus = gamestatus
    useEffect(()=>{
      if(gameStatus === "Opponent left the game."){
        setwinmsg("")
      }else {
        if(winstate===player){
          setwinmsg("YOU WIN");
        }else if(winstate==='Draw'){
          setwinmsg("")
        }
        else{
          setwinmsg("YOU LOSE")
        }
      }
    })
    setTimeout(() => {
        onClose();
    }, 2000); // Reset text after 2 seconds
  // Function to handle sharing via different apps
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={{display:'flex',flexDirection:'column'}}>
        {/* <div class="loader" style={{backgroundColor:'blue'}}></div> */}
        <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#333",alignSelf:'center'}}>
          {gamestatus}
        </h1>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#333",alignSelf:'center'}}>
          {winmsg}
        </h1>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    background: "#fff",
    padding: "20px",
    width: "300px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    position: "relative",
  },
};

export default Winnerpopup;
