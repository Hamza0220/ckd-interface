import React, { useState } from "react";
import { auth } from "./firebaseconfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./admin.scss";
import { toast } from "react-toastify";
import Modal from "react-modal"; // Import the React Modal component
import { Link } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State to manage the modal

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch((error) => {
        toast.error("Error logging out: " + error.message);
      });
  };
  // Handle Register Doctor button click
  const handleRegisterDoctorClick = () => {
    // Redirect to the RegisterDoctor component using navigate function
    navigate("/RegisterDoctor");
  };
  const handleRegisterAttendentClick = () => {
    // Redirect to the RegisterDoctor component using navigate function
    navigate("/RegisterAttendent");
  };

  // Conditionally render based on the isAdminLoggedIn state
  return (
    <div className="background-container">
      <div className="admin">
        <h4>Welcome Hamza!</h4>
        <h5>Doctor Management</h5>
        <div className="background-image"></div>
        <div>
          {/* <Link to="/Adminprofile">
            <div className="icon-container">
              <img
                src="https://cdn-icons-png.flaticon.com/128/2345/2345338.png"
                alt="adminavatar"
                className="adminavatar"
              />
            </div>
            <button className="user-profile-button">Profile</button>
          </Link> */}
        </div>

        <ul>
          <li>
            <button
              id="disable-doctor"
              onClick={() => navigate("/doctor-disable")}
            >
              Disable Doctor
            </button>
          </li>
          <li>
            {/* <button id="update-doctor">Update Doctor Profile</button> */}
          </li>
          <li>
            <button id="register-doctor" onClick={handleRegisterDoctorClick}>
              Register Doctor
            </button>
          </li>
          <li>
            <button
              id="register-attendent"
              onClick={handleRegisterAttendentClick}
            >
              Register Attendent
            </button>
          </li>
        </ul>

        <h2>Patient Management</h2>
        <ul>
          <li>
            <button id="modify-patient-record">Modify Patient Record</button>
          </li>
          <li>
            <button id="update-patient-profile">Update Patient Profile</button>
          </li>
        </ul>
        <div className="adminlogout" id="adminlogout">
          <button className="logout-btn" onClick={openLogoutModal}>
            Logout
          </button>
        </div>

        <Modal
          isOpen={isLogoutModalOpen}
          onRequestClose={closeLogoutModal}
          contentLabel="Logout Confirmation"
        >
          <div className="confirmation-modal">
            <h2>Are you sure you want to log out?</h2>
            <div className="confirmation-buttons">
              <button id="yes" onClick={handleLogout}>
                Yes
              </button>
              <button id="no" onClick={closeLogoutModal}>
                No
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Admin;
