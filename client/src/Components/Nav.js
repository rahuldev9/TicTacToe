import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Changename from "./Changename";

function Nav() {
  const [auth, setAuth] = useState(null);
  const [name,setname]=useState(false);

  const navigate = useNavigate();
  const maleAvatar = "/male.png"; // Update with the actual path
  const femaleAvatar = "/female.png"; // Update with the actual path

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setAuth(JSON.parse(user));
    }
  }, []);
  const leaveroom=()=>{
    navigate('/')
    window.location.reload();
  }
  const changename=()=>{
    setname(true)
  }
  const onclose = () => {
    setname(false)
    
  };

  return (
    <div>
      {auth ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent:'space-between'
          }}
        >
          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            
          }}>
            <img
              src={auth.gender === "male" ? maleAvatar : femaleAvatar}
              alt="Profile"
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                margin: "5px",
                cursor:'pointer',
              }}
              onClick={changename}
            />
            <p style={{ margin: "2px", textAlign: "center" }} >@{auth.name}</p>
          </div>
          <button onClick={leaveroom} className="Btn"><i class="fa-solid fa-right-from-bracket"></i></button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "row" }}></div>
      )}
      {name && <Changename close={onclose}/>}
    </div>
  );
}

export default Nav;
