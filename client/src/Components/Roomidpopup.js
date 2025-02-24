import React, { useState } from "react";

const Roomidpopup = ({ setRoomId, setPopup }) => {
  const [roomToJoin, setRoomToJoin] = useState("");

  const joinRoom = () => {
    if (roomToJoin.trim() !== "") {
      setRoomId(roomToJoin);
      setPopup(false); // Close the popup after joining
    } else {
      alert("Please enter a Room ID");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button onClick={() => setPopup(false)} style={styles.closeButton}>X</button>
        <div className="flex flex-col gap-2 p-4">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomToJoin}
            onChange={(e) => setRoomToJoin(e.target.value)}
            className="p-2 border rounded-md"
          />
          <button onClick={joinRoom} className="p-2 bg-blue-500 text-white rounded-md">
            Join Room
          </button>
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
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  }
};

export default Roomidpopup;
