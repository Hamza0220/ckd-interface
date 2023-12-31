import React, { useContext, useEffect, useState } from "react";
import { auth, db, firebaseStorage } from "./firebaseconfig"; // Update the imports
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./patientdashboard.scss";
import { BiSolidUser } from "react-icons/bi"; // Adjust the import path to match your actual setup
import { ref as sRef } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore"; // Updated Firestore imports
import { UserContext } from "./main-layout/UserContext";

const PatientDashboard = () => {
  const { user } = useContext(UserContext);
  const [selectedLabReport, setSelectedLabReport] = useState(null);
  const [selectedMedicalReport, setSelectedMedicalReport] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const showProfileInfo = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  useEffect(() => {
    // const user = auth.currentUser;
    if (user && user.uid) {
      const userId = user.uid;
      const usersRef = doc(db, "patient-data", userId);

      getDoc(usersRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            if (userData) {
              const patientName = userData.username;
              console.log("patientName", patientName);
              setPatientName(patientName);
              sessionStorage.setItem("patientName", patientName);
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

  const handleShowLabReports = () => {
    navigate("/lab-reports"); // Navigate to the LabReportsPage.js
  };

  const handleShowMedicalReports = () => {
    navigate("/medical-reports"); // Navigate to the MedicalHistoryPage.js
  };

  const handleUploadLabReport = async () => {
    if (selectedLabReport) {
      const storageRef = sRef(firebaseStorage);
      const labReportsRef = sRef(
        storageRef,
        `labReports/${auth.currentUser.uid}/${selectedLabReport.name}`
      );

      try {
        const snapshot = await uploadBytes(labReportsRef, selectedLabReport);
        console.log("Lab report uploaded successfully");

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the patient's profile data with the download URL
        const userDocRef = doc(
          db,
          "patient-profile-data",
          auth.currentUser.uid
        );
        const dataToUpdate = {
          labReports: arrayUnion(downloadURL),
        };
        console.log("current user uid ", auth.currentUser.uid);
        try {
          await setDoc(userDocRef, dataToUpdate, { merge: true });
          console.log("Lab report uploaded successfully");
          setSelectedLabReport(null);
          toast.success("Lab report uploaded successfully");
        } catch (error) {
          console.error("Error updating lab report data", error);
        }

        setSelectedLabReport(null);
      } catch (error) {
        console.error("Error uploading lab report", error);
      }
    } else {
      console.log("No lab report selected for upload");
    }
  };

  const handleUploadMedicalReport = () => {
    if (selectedMedicalReport) {
      const storageRef = sRef(firebaseStorage);
      const medicalReportsRef = sRef(
        storageRef,
        `medicalReports/${auth.currentUser.uid}/${selectedMedicalReport.name}`
      );

      uploadBytes(medicalReportsRef, selectedMedicalReport)
        .then(() => {
          console.log("Medical report uploaded successfully");
          setSelectedMedicalReport(null); // Clear the upload field
          toast.success("Medical report uploaded successfully"); // Show success toast
        })
        .catch((error) => {
          console.error("Error uploading Medical report", error);
        });
    } else {
      console.log("No medical report selected for upload");
    }
  };

  const handleShowSensorData = () => {
    // window.location.href = "SensorData";
    navigate("/SensorData");
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Logout successful");
        sessionStorage.removeItem("patientName");
        navigate("/");
      })
      .catch((error) => {
        console.log("Logout error", error);
      });
  };

  const handleOpenChat = () => {
    navigate("/patientchat");
  };
  const handlepatientnotification = () => {
    navigate("/patientnotification");
  };
  const handleShowEcgData = () => {
    navigate("/EcgData");
  };
  return (
    <div id="patint-container" className="patientdashbaord ">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Link to="/Patientprofile">
            <div className="icon-container text-center pb-3">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3034/3034851.png"
                alt="patientavatar"
                className="patientavatar"
              />
            </div>
            <button className="user-profile-button">Profile</button>
          </Link>
        </div>
        <div className="text-center">
        <span className="welcome">
          Welcome <span>{patientName}</span>
        </span>
      </div>
        <div>
          <div id="profile " className="profile " onClick={showProfileInfo}>
            <div id="profileNameBox" className="profile-name-box">
              <BiSolidUser className="fs-1" />
              <br />
              {patientName && <span className="mt-5">{patientName}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="psd">
        <div className="container mt-3">
          <button type="button" onClick={handlepatientnotification}>
            Notifications
          </button>
          <button onClick={handleShowSensorData}>Show Sensor Data</button>
          <button onClick={handleShowEcgData}>Show ecg Data</button>

          <h2>Upload Lab Reports</h2>
          <form>
            <input
              type="file"
              onChange={(e) => setSelectedLabReport(e.target.files[0])}
            />
            {selectedLabReport && (
              <div className="selected-file-box">
                Selected File: {selectedLabReport.name}
              </div>
            )}
            <button type="button" onClick={handleUploadLabReport}>
              Upload
            </button>
          </form>
          <h2>Upload Medical History</h2>
          <form>
            <input
              type="file"
              onChange={(e) => setSelectedMedicalReport(e.target.files[0])}
            />
            {selectedMedicalReport && (
              <div className="selected-file-box">
                Selected File : {selectedMedicalReport.name}
              </div>
            )}
            <button type="button" onClick={handleUploadMedicalReport}>
              Upload
            </button>
          </form>
          <button type="button" onClick={handleShowLabReports}>
            Show Uploaded Lab Reports
          </button>
          <button type="button" onClick={handleShowMedicalReports}>
            Show Uploaded Medical History
          </button>
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
          {/* <button id="open-chat-button" onClick={handleOpenChat}>
            Open Chat
          </button> */}
          <button>View Statistics</button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
