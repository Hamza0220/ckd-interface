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
        <div id="card1" className="card">
        <h4>Welcome Hamza!</h4>
     
        </div>
        <div id="card2" className="card">
        <h5>Doctor Management</h5>
        </div>
        
        <div className="background-image"></div>
        
            <div className="col-lg-12 ">
            <button
            className="space-btn"
              id="disable-doctor"
              onClick={() => navigate("/doctor-disable")}
            >
              Disable Doctor
            </button>
            <button className="space-btn" id="register-doctor" onClick={handleRegisterDoctorClick}>
              Register Doctor
            </button>
            <button
              id="register-attendent"
              className="space-btn"
              onClick={handleRegisterAttendentClick}
            >
              Register Attendent
            </button>
            <div className="adminlogout" id="adminlogout">
          <button className="logout-btn" onClick={openLogoutModal}>
            Logout
          </button>
        </div>
            </div>


            <Modal
  isOpen={isLogoutModalOpen}
  onRequestClose={closeLogoutModal}
  contentLabel="Logout Confirmation"
  className="confirmation-modal"
>
  <div>
    <h2 className="confirmation-message">Are you sure you want to log out</h2>
    <div className="confirmation-buttons">
      <button onClick={handleLogout}>Yes</button>
      <button onClick={closeLogoutModal}>No</button>
    </div>
  </div>
</Modal>


      </div>
    </div>
  );
};

export default Admin;
