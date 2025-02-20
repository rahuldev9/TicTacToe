import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", gender: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleStart = () => {
    navigate("/start");
  };

  const handleNextStep = () => {
    if (user.name.trim() === "") {
      setError("Please enter your name.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleGetStarted = () => {
    if (user.gender === "") {
      setError("Please select your gender.");
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
  };

  return (
    <div
      style={{
        height: "750px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        color: "white",
        width: "100%",
      }}
    >
      {isAuthenticated ? (
        <div className="container">
          <h1 className="word">TIC</h1>
          <h1 className="word">TAC</h1>
          <h1 className="word">TOE</h1>
          <button onClick={handleStart}>
            <span className="text">Play</span>
            <span className="blob"></span>
            <span className="blob"></span>
            <span className="blob"></span>
            <span className="blob"></span>
          </button>
        </div>
      ) : (
        <div
          className="get-started-form"
          style={{
            backgroundColor: "#212529",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          {step === 1 ? (
            <>
              <h1 style={{ color: "white" }}>Enter Your Name</h1>
              <input
                className="input"
                type="text"
                placeholder="Enter your name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #444",
                  backgroundColor: "#333",
                  color: "white",
                  fontSize: "1em",
                  marginBottom: "10px",
                  width: "80%",
                  textAlign: "center",
                }}
              />
              {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
              <button className="Btn" onClick={handleNextStep} style={{ marginTop: "10px" }}>
                Next
              </button>
            </>
          ) : (
            <>
              <h1 style={{ color: "white" }}>Select Your Gender</h1>
              <select
                value={user.gender}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #444",
                  backgroundColor: "#333",
                  color: "white",
                  fontSize: "1em",
                  marginBottom: "10px",
                  width: "85%",
                }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
              <button className="Btn" onClick={handleGetStarted} style={{ marginTop: "10px" }}>
                Get Started
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
