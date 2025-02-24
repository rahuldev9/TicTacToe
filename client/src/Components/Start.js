import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Popup from "./Popup";
import Nav from "./Nav";
import Winnerpopup from "./Winnerpopup";
import { useNavigate } from "react-router-dom";
import Roomidpopup from "./Roomidpopup";

const socket = io("http://localhost:4000");

function Start() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [gameStatus, setGameStatus] = useState();
  const [gameOver, setGameOver] = useState(false);
  const [gameboard, setGameboard] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [winnerpopup, setWinnerPopup] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [roomCreatorId, setRoomCreatorId] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [players, setPlayers] = useState([]);
  const [input, setinput] = useState(false);
  const [error, seterror] = useState(false);
  const [winmsg, setwinmsg] = useState("");
  const [roomToJoin, setRoomToJoin] = useState("");
  const [chatbox, setchatbox] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const [chathist, setchathist] = useState(false);
  const maleAvatar = "/male.png"; // Update with the actual path
  const femaleAvatar = "/female.png"; // Update with the actual path
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const playerName = user?.name || "Guest"; // Default to "Guest" if no name is found
  const gender = user?.gender;
  const profile = user?.image;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [latestMessage, setLatestMessage] = useState(null);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (chathist) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    if (chatbox) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chathist]);

  useEffect(() => {
    socket.on("connect", () => {
      setPlayerId(socket.id);
    });

    socket.on("roomCreated", (id) => {
      setRoomId(id);
      setRoomCreatorId(socket.id); // Store room creator's ID
      setGameStatus("Waiting for a friend to connect...");
    });

    socket.on("startGame", ({ creatorId, players }) => {
      setinput(false);
      setGameStatus("Game Started!");
      setCurrentPlayer(creatorId);
      setBoard(Array(9).fill(null));
      setGameOver(false);
      setGameboard(true);
      setGameStarted(true);
      setPlayers(players); // ✅ Store players in state
      const isCreator = socket.id === creatorId;
      setPlayerSymbol(isCreator ? "X" : "O");
      setIsMyTurn(isCreator);
    });

    socket.on("moveMade", ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setIsMyTurn(currentPlayer === socket.id); // Update turn
    });

    socket.on("gameOver", ({ winner }) => {
      setGameStatus(winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`);
      setwinmsg(winner);
      setGameOver(true);
      setWinnerPopup(true);
    });

    socket.on("opponentLeft", () => {
      setGameStatus("Opponent left the game.");
      setWinnerPopup(true);
    });

    socket.on("error", (message) => {
      seterrormessage(message);
      seterror(true);
    });

    socket.on("gameReset", ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setGameStatus("Game Restarted!");
      setGameboard(true);
      setGameOver(false);
      setIsMyTurn(currentPlayer === socket.id); // Reset turn logic
    });

    socket.on("receiveMessage", (chatMessage) => {
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
      setLatestMessage(chatMessage);
      console.log("Latest Message:", chatMessage);
      handleShowNotification(chatMessage.text, chatMessage.player);
    });

    return () => {
      socket.off();
    };
  }, []);

  const createRoom = () => {
    socket.emit("createRoom", playerName, gender,profile); // ✅ Send player name
    setShowPopup(true);
  };

  const joinRoom = () => {
    if (!roomToJoin.trim()) {
      seterrormessage("Please Provide Code");
      return;
    }
    socket.emit("joinRoom", { roomId: roomToJoin, playerName, gender,profile }); // ✅ Send player name
    setRoomId(roomToJoin);
  };
  const showinput = () => {
    setinput(true);
  };

  const makeMove = (index) => {
    if (board[index] === null && isMyTurn) {
      socket.emit("makeMove", { roomId, index });
    }
  };

  const resetGame = () => {
    socket.emit("resetGame", roomId);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setWinnerPopup(false);
  };

  const closeWinnerPopup = () => {
    setWinnerPopup(false);
    if (gameStatus === "Opponent left the game.") {
      navigate("/");
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && roomId) {
      socket.emit("sendMessage", { roomId, playerName, message: messageInput });
      // setMessages((prevMessages) => [...prevMessages, { playerName: "You", message: messageInput }]);
      setMessageInput("");
    }
  };

  const openchatbox = () => {
    setchatbox(true);
  };
  const onClose = () => {
    setchatbox(false);
    setchathist(false);
    
  };

  const [notification, setNotification] = useState({
    show: false,
    text: "",
    sender: "",
  });

  const handleShowNotification = (text, player) => {
    setNotification({ show: true, text, player });
    setTimeout(
      () => setNotification({ show: false, text: "", sender: "" }),
      3000
    );
  };
  return (
    <>
      <Nav />
      {roomId && !error && (
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            // height: "100px",
          }}
        >
          <p style={{ color: "black", paddingRight: "20px" }}>
            <strong>Room ID: </strong>
            {roomId}
          </p>

          {gameStarted && (
            <div style={{ paddingRight: "20px" }}>
              <button class="chatBtn" onClick={openchatbox}>
                <svg
                  height="1.6em"
                  fill="white"
                  viewBox="0 0 1000 1000"
                  y="0px"
                  x="0px"
                  version="1.1"
                >
                  <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
                </svg>
                <span class="tooltip">Chat</span>
              </button>
            </div>
          )}
        </div>
      )}
      {error && (
        <p style={{ color: "red", alignSelf: "center" }}>{errormessage}</p>
      )}
      <div
        className="App"
        style={{
          height: "650px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <h2>
          {gameOver
            ? "Game Over"
            : gameStarted
            ? "Game Started!"
            : "Play with Friend!"}
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {players.length >= 2 && (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {/* Player 1 */}
              <div style={{ textAlign: "center", position: "relative" }}>
                {/* Notification Message */}
                {notification.show &&
                  latestMessage &&
                  latestMessage.player === players[0].name && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "70px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "black",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        zIndex: 10,
                        minWidth: "100px",
                        textAlign: "center",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <p style={{ fontSize: "10px", margin: 0 }}>
                        {latestMessage.text}
                      </p>
                    </div>
                  )}
                <img
                  src={
                    players[0].profile
                      ? players[0].profile
                      : players[0].gender === "male"
                      ? maleAvatar
                      : femaleAvatar
                  }
                  
                  alt="Player Profile"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                />
                <p style={{ margin: "2px", textAlign: "center" }}>
                  {players[0].name}
                </p>
                
              </div>

              {/* VS Symbol (Always in the middle) */}
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: "0 10px",
                }}
              >
                VS
              </p>

              {/* Player 2 */}
              <div style={{ textAlign: "center", position: "relative" }}>
                {/* Notification Message */}
                {notification.show &&
                  latestMessage &&
                  latestMessage.player === players[1].name && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "70px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "black",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        zIndex: 10,
                        minWidth: "100px",
                        textAlign: "center",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <p style={{ fontSize: "12px", margin: 0 }}>
                        {latestMessage.text}
                      </p>
                    </div>
                  )}
                <img
                  src={
                    players[1].profile
                      ? players[1].profile
                      : players[1].gender === "female"
                      ? femaleAvatar
                      : maleAvatar
                  }
                  
                  alt="Player Profile"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                />
                <p style={{ margin: "2px", textAlign: "center" }}>
                  {players[1].name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* <h1>
          {gameOver
            ? "Game Over"
            : gameStarted
            ? "Game Started!"
            : "Play with Friend!"}
        </h1> */}
        {/* Show player symbol and turn status */}
        {playerSymbol && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <p>
                You are: <strong>{playerSymbol}</strong>
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: isMyTurn ? "green" : "red",
                }}
              >
                {isMyTurn ? "Your Turn" : "Opponent's Turn"}
              </p>
            </div>
          </>
        )}
        {/* Show Create and Join buttons before game starts */}
        {!gameStarted && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button className="Btn" onClick={createRoom}>
              Create Room
            </button>
            <button className="Btn" onClick={showinput}>
              Join With Code
            </button>
          </div>
        )}
        {input && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div class="input-container">
              <input
                type="text"
                id="input"
                placeholder="Code"
                autoComplete="off"
                spellCheck="false"
                value={roomToJoin}
                onChange={(e) => setRoomToJoin(e.target.value)}
              ></input>
              <label for="input" class="label">
                Enter Room Code
              </label>
              <div class="underline"></div>
            </div>

            <button onClick={joinRoom} className="Btn">
              Join Room
            </button>
          </div>
        )}

        {gameStarted && roomId && chatbox && (
          <>
            {chathist && (
              <div
                className="chat-container"
                style={{
                  position: "fixed",
                  bottom: "50px",
                  margin: "10px",
                  width: "90%",
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                <h4>Chat</h4>
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "30px",
                    cursor: "pointer",
                  }}
                >
                  <svg height="25px" viewBox="0 0 384 512" onClick={onClose}>
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
                  </svg>
                </div>

                <div
                  className="chat-messages"
                  style={{
                    height: "300px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "5px",
                    display: "flex",
                    flexDirection: "column",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {messages.map((msg, index) => {
                    const isUser = msg.player === user?.name;
                    return (
                      <div
                        key={index}
                        style={{
                          margin: "5px 0",
                          fontSize: "14px",
                          backgroundColor: isUser ? "lightblue" : "lightgray",
                          padding: "5px",
                          borderRadius: "5px",
                          textAlign: isUser ? "right" : "left",
                          maxWidth: "80%", // Limit message width to prevent overflow
                          wordWrap: "break-word", // Ensure long words break
                          whiteSpace: "pre-wrap", // Keep text wrapping
                          alignSelf: isUser ? "flex-end" : "flex-start", // Align messages properly
                        }}
                      >
                        <strong>{msg.player}</strong>: {msg.text}
                      </div>
                    );
                  })}
                  {/* Invisible div to keep scrolling to the latest message */}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            <div
              class="messageBox"
              style={{
                position: "fixed",
                bottom: "10px",
                height: "50px",
                alignSelf: "center",
                width: "90%",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
                zIndex: 1000,
              }}
            >
              <div class="fileUploadWrapper">
                <ul class="wrapper">
                  <li
                    class="icon facebook"
                    onClick={() => setchathist((prev) => !prev)}
                  >
                    <span class="tooltip">ChatBox</span>
                    <i class="fa-solid fa-envelope">{chathist ? "" : ""}</i>
                  </li>
                </ul>
              </div>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                id="messageInput"
                autoComplete="off"
              />
              <button id="sendButton" onClick={sendMessage}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 664 663"
                >
                  <path
                    fill="none"
                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                  ></path>
                  <path
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="33.67"
                    stroke="#6c6c6c"
                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                  ></path>
                </svg>
              </button>
            </div>
          </>
        )}
        {roomId && !gameStarted && <p>{gameStatus}</p>}
        {/* Game Board */}
        {roomId && gameboard && (
          <div className="board">
            {board.map((cell, index) => (
              <div key={index} className="cell" onClick={() => makeMove(index)} style={{
                color: cell === "X" ? "#ffff3f" : cell === "O" ? "#55a630" : "black", // Change colors here
                fontSize: "2rem", // Adjust size as needed
                fontWeight: "bold",
              }}>
                {cell}
              </div>
            ))}
          </div>
        )}
        {/* Popups */}
        {showPopup && <Popup onClose={handleClosePopup} roomId={roomId} />}
        {winnerpopup && gameStarted && (
          <Winnerpopup
            onClose={closeWinnerPopup}
            gamestatus={gameStatus}
            winstate={winmsg}
            player={playerSymbol}
          />
        )}

        {/* Reset Game Button */}
        {gameOver && (
          <button
            className="Btn"
            style={{ alignSelf: "center" }}
            onClick={resetGame}
          >
            Reset Game
          </button>
        )}
      </div>
    </>
  );
}

export default Start;
