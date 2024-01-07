import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  { auth, db } from "./firebaseconfig"; // Import your firebase.js file
import "firebase/auth";
import "firebase/database";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import "./doctordashboard.scss";
import { BiSolidUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { UserContext } from "./main-layout/UserContext";
import Modal from "react-modal";

function DoctorDashboard() {
  const { user } = useContext(UserContext);
  console.log("doctor dashboard",user)
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const redirectToNotifications = () => {
    navigate("/Notifications"); // Replace with your route
  };
  const [doctorName, setDoctorName] = useState("");
  // const [hardwareOptionsVisible, setHardwareOptionsVisible] = useState(false);
  // const [patientList, setPatientList] = useState([]);
  const showPatientHardwareOptions = () => {
    navigate("/Hardware");
  };
  const viewEmergencyAlerts = () => {
    navigate("/EmergencyAlert");
  };
  // const viewMedicalHistory = () => {
  //   navigate("/Medicalhistory");
  // };
  const viewPatientProfile = () => {
    navigate("/Viewpatientprofile");
  };

  useEffect(() => {
    // Check if there's a currently authenticated user
    // const user = user.uid;

    if (user.uid) {
      const userId = user.uid;
      const usersRef = doc(db, "doctors", userId);

      getDoc(usersRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            if (userData) {
              const doctorName = userData.name;
              console.log("doctorName", doctorName);
              setDoctorName(doctorName);
              sessionStorage.setItem("doctorName", doctorName);
            }
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    }
  }, [user.uid]);
  // const viewPatientList = ()=>{
  //   navigate('/Patientlist')
  // }
  // const showPatientHardwareOptions = (userId) => {
  //   const hardwareRef = firebase.database().ref(`hardware-assignment/${userId}`);

  //   hardwareRef.once('value').then((snapshot) => {
  //     const hardwareAssignments = snapshot.val();

  //     if (hardwareAssignments) {
  //       setHardwareOptionsVisible(true);
  //       setPatientList(hardwareAssignments);
  //     } else {
  //       alert("No hardware assignments found for the selected patient.");
  //     }
  //   });
  // };

  // const toggleHardwareAssignment = (userId, hardwareName) => {
  //   const hardwareRef = firebase.database().ref(`hardware-assignment/${userId}/${hardwareName}`);

  //   hardwareRef.once('value').then((snapshot) => {
  //     const hardwareData = snapshot.val();

  //     if (hardwareData) {
  //       hardwareRef.remove().then(() => {
  //         console.log("Hardware removed successfully.");
  //       }).catch((error) => {
  //         console.error("Error removing hardware:", error);
  //       });
  //     } else {
  //       hardwareRef.set({}).then(() => {
  //         console.log("Hardware assigned successfully.");
  //       }).catch((error) => {
  //         console.error("Error assigning hardware:", error);
  //       });
  //     }
  //   });
  // };
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };
  // const openChat = () => {
  //   navigate("/DoctorChat"); // Replace with your route
  // };
  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch((error) => {
        toast.error("Error logging out: " + error.message);
      });
  };
  // const handleemergency = () => {
  //   navigate("/EmergencyRoom");
  // };
  return (
    <div className="DoctorDashboard">
      <div className="doctorcontainer">
      <div id="profileNameBox" className="profile-name-box">
        <BiSolidUser className="fs-1" />
        <br />
        {doctorName && <span className="mt-0">{doctorName}</span>}
      </div>
      <div className="welcome">
        Welcome- <span>{doctorName}</span>
      </div>
      <div id="d-card" className="card">

      <h2>Patient Info</h2>
      </div>
      <div className="d-profile" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
  <Link to="/doctorprofile">
    <div className="icon-container">
      <img
        src="https://cdn-icons-png.flaticon.com/128/2785/2785482.png"
        alt="Avatar"
        className="avatar"
      />
    </div>
    <button className="user-profile-button">Profile</button>
  </Link>
</div>



      <button onClick={redirectToNotifications}>Notifications</button>

      {/* <button onClick={() => showPatientHardwareOptions('userId')}>
        View Patient Hardware Options
      </button> */}
      <button onClick={showPatientHardwareOptions}>
        View Patient Hardware Options
      </button>

      {/* <div>
        {hardwareOptionsVisible && (
          <div>
            {patientList && Object.keys(patientList).map((hardware) => (
              <button key={hardware} onClick={() => toggleHardwareAssignment('userId', hardware)}>
                {hardware}
              </button>
            ))}
          </div>
        )}
      </div> */}
      <button onClick={viewEmergencyAlerts}>
        View emergency alerts of the patients
      </button>
      {/* <button onClick={viewMedicalHistory}>
        View the medical history of the patients
      </button> */}
      <button onClick={viewPatientProfile}>View patient's List</button>
      {/* <button onClick={viewPatientList}>View Patient's List</button> */}
      {/* <button id="open-chat-button" onClick={openChat}>
        Open Chat
      </button> */}
   <button className="logout-btn" onClick={openLogoutModal}>
            Logout
          </button>
          <Modal
  isOpen={isLogoutModalOpen}
  onRequestClose={closeLogoutModal}
  contentLabel="Logout Confirmation"
  className="confirmation-modall"
>
  <div>
    <h2 className="confirmation-message">Are you sure you want to log out</h2>
    <div className="confirmation-buttons">
      <button onClick={logout}>Yes</button>
      <button onClick={closeLogoutModal}>No</button>
    </div>
  </div>
</Modal>
      </div>
      


      {/* <button className="btn" onClick={handleemergency}>
        Emergency Room
      </button> */}
    </div>
  );
}

export default DoctorDashboard;
