import React, { useEffect, useState } from "react";

const Changename = ({ close }) => {
  const [name, setName] = useState("");
  const [auth, setAuth] = useState(null);
  const [input, setinput]=useState(false)
  

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setAuth(parsedUser);
      setName(parsedUser.name);
    }
  }, []);

  const maleAvatar = "/male.png"; // Update with the actual path
  const femaleAvatar = "/female.png"; // Update with the actual path

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSave = () => {
    if (auth) {
      const updatedUser = { ...auth, name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAuth(updatedUser);
    }
    close();
    setName(false)
    window.location.reload();
  };

  const showinput=()=>{
    setinput(true)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div>
          {auth ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection:'column',
                  alignItems: "center",
                }}
              >
                <img
                  src={auth.gender === "male" ? maleAvatar : femaleAvatar}
                  alt="Profile"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    margin: "5px",
                  }}
                />
                <p style={{ margin: "2px", textAlign: "center" }}>
                  @{auth.name}
                </p>
              </div>
             <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
             <button className="Btn" onClick={showinput}>Change Name</button>
             <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "30px",
                    cursor: "pointer",
                  }}
                >
                  <svg height="25px" viewBox="0 0 384 512" onClick={close}>
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
                  </svg>
                </div>
             </div>
              {input && 
              <div>
              <div class="input-container">
              <input
                type="text"
                id="input"
                placeholder="Name"
                autoComplete="off"
                spellCheck="false"
                value={name}
                onChange={handleChange}
              ></input>
              <label for="input" class="label">
              Enter new name
              </label>
              <div class="underline"></div>
            </div>
              <button onClick={handleSave} className="Btn">
                Save
              </button>
              </div>}

            </div>
          ) : (
            <p>Please log in to change your name.</p>
          )}
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

export default Changename;
