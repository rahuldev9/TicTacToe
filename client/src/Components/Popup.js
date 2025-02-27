import React,{useEffect,useState} from "react";

const Popup = ({ onClose, roomId }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (roomId) {
      setLoading(false);
    }
  }, [roomId]);
  
  const handleShare = (platform, event) => {
    if (event) event.preventDefault(); // Prevents default behavior if used inside a form
  
    const copyText = `🔢 Room ID: ${roomId}`;
    const encodedCopyText = encodeURIComponent(copyText);
  
    const shareText = `🎉 Let's play Tic-Tac-Toe! 🎮\n\n🚀 Join code is:${roomId}\n\n🔥 Click here to play: ${window.location.href}`;
  
    let shareUrl = "";
  
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        break;
      default:
        // Web Share API fallback (for mobile/modern browsers)
        if (navigator.share) {
          navigator
            .share({
              title: "Tic-Tac-Toe Room",
              text: shareText,
              url: window.location.href,
            })
            .catch((err) => console.error("Error sharing:", err));
        } else {
          // Fallback to WhatsApp if Web Share API is not available
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
        }
    }
  
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };
  // Function to copy the roomId to the clipboard
  const copyRoomId = (event) => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        event.target.innerText = "Copied!";
        setTimeout(() => {
            onClose();
          event.target.innerText = "Copy";
        }, 2000); // Reset text after 2 seconds

      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
       {loading?(<div class="loader">
  <div class="square" id="sq1"></div>
  <div class="square" id="sq2"></div>
  <div class="square" id="sq3"></div>
  <div class="square" id="sq4"></div>
  <div class="square" id="sq5"></div>
  <div class="square" id="sq6"></div>
  <div class="square" id="sq7"></div>
  <div class="square" id="sq8"></div>
  <div class="square" id="sq9"></div>
</div>):(
        <>
        <svg height="20px" viewBox="0 0 384 512" onClick={onClose}>
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
      </svg>

      <p className="card-heading">Room Created!</p>
      <p className="card-description">Share this Room ID with your friend:</p>
      <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around',alignItems:'center'}}>
      <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#333" }}>
        {roomId}
      </h2>
      <button class="cpBtn" onClick={copyRoomId}>
        <span class="cptext">Copy</span>
        <span class="svgIcon">
          <svg
            fill="white"
            viewBox="0 0 384 512"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path>
          </svg>
        </span>
      </button>
      </div>

      {/* <button className="card-button secondary" onClick={onClose}>
        OK
      </button> */}
      <div class="card">
        <button
          class="socialContainer containerOne"
          
          onClick={(e) => { e.preventDefault(); handleShare("facebook"); }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            height="1.2em"
            viewBox="0 0 320 512"
          >
            <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
          </svg>
        </button>

        <button
          class="socialContainer containerTwo"
          onClick={(e) => { e.preventDefault(); handleShare("twitter"); }}
          
        >
          <svg viewBox="0 0 16 16" class="socialSvg twitterSvg">
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"></path>
          </svg>
        </button>

        <button
          class="socialContainer containerThree"
          onClick={(e) => { e.preventDefault(); handleShare("telegram"); }}
          
        >
          <svg viewBox="0 0 100 100" version="1.1" width="30" height="30">
            <path
              fill="white"
              d="M95,9.9c-1.3-1.1-3.4-1.2-7-0.1c0,0,0,0,0,0c-2.5,0.8-24.7,9.2-44.3,17.3c-17.6,7.3-31.9,13.7-33.6,14.5  c-1.9,0.6-6,2.4-6.2,5.2c-0.1,1.8,1.4,3.4,4.3,4.7c3.1,1.6,16.8,6.2,19.7,7.1c1,3.4,6.9,23.3,7.2,24.5c0.4,1.8,1.6,2.8,2.2,3.2  c0.1,0.1,0.3,0.3,0.5,0.4c0.3,0.2,0.7,0.3,1.2,0.3c0.7,0,1.5-0.3,2.2-0.8c3.7-3,10.1-9.7,11.9-11.6c7.9,6.2,16.5,13.1,17.3,13.9  c0,0,0.1,0.1,0.1,0.1c1.9,1.6,3.9,2.5,5.7,2.5c0.6,0,1.2-0.1,1.8-0.3c2.1-0.7,3.6-2.7,4.1-5.4c0-0.1,0.1-0.5,0.3-1.2  c3.4-14.8,6.1-27.8,8.3-38.7c2.1-10.7,3.8-21.2,4.8-26.8c0.2-1.4,0.4-2.5,0.5-3.2C96.3,13.5,96.5,11.2,95,9.9z M30,58.3l47.7-31.6  c0.1-0.1,0.3-0.2,0.4-0.3c0,0,0,0,0,0c0.1,0,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2-0.1c-0.1,0.1-0.2,0.4-0.4,0.6L66,38.1  c-8.4,7.7-19.4,17.8-26.7,24.4c0,0,0,0,0,0.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0.1-0.1,0.1c0,0.1,0,0.1-0.1,0.2c0,0,0,0.1,0,0.1  c0,0,0,0,0,0.1c-0.5,5.6-1.4,15.2-1.8,19.5c0,0,0,0,0-0.1C36.8,81.4,31.2,62.3,30,58.3z"
            ></path>
          </svg>
        </button>

        <button
          class="socialContainer containerFour"
          onClick={(e) => { e.preventDefault(); handleShare("whatsapp"); }}
          
        >
          <svg viewBox="0 0 16 16" class="socialSvg whatsappSvg">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
          </svg>
        </button>
      </div>
      </>
       )}
        
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
    minHeight:'200px',
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    position: "relative",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
};

export default Popup;
