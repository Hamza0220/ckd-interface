import React from "react";
import "./EmergencyRoom.scss";
// import Popup from "reactjs-popup";
function EmergencyRoom() {
  function handleNotification(node, flag) {
    if (flag) {
      alert(node);
    } else {
      console.log(node);
    }
  }

  return (
    <div className="Emergency-room">
      <h2>Welcome to Emergency</h2>
      <img
        src="https://cdn-icons-png.flaticon.com/128/8514/8514371.png"
        alt="notification-icon"
        className="noti-icon"
      />
      <button type="button" onClick={handleNotification}>
        Notifications
      </button>
    </div>
  );
}

export default EmergencyRoom;
