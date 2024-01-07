import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./main.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  auth,
  db,
  // database as firebaseDatabase,
  // firestore,
} from "../firebaseconfig";
import { toast } from "react-toastify";
import {
  // collection,
  // query,
  // where,
  // getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { Spinner } from "react-bootstrap";
import { UserContext } from "./UserContext";
// Import the Firebase instances

export default function Patient() {
  const { login } = useContext(UserContext);
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
  // const [emailValid, setEmailValid] = useState(true);
  const navigate = useNavigate();
  const [showWrongPasswordAlert, setShowWrongPasswordAlert] = useState(false); // Declare the state here

  // State for storing login form data
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle patient login
  const handlePatientLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const patientUID = userCredential.user.uid;

      // Check the patient's notification status
      const patientRef = doc(db, "patient-data", patientUID);
      const patientDoc = await getDoc(patientRef);
      let user_info = patientDoc.data();
      if (user_info) {
        localStorage.setItem("user_info", JSON.stringify(user_info));
      }
      console.log("patientDoc====>", patientDoc.data());

      if (patientDoc.exists()) {
        const patientData = patientDoc.data();
        const notificationStatus = patientData.notification_status;

        if (
          notificationStatus === "accepted" ||
          notificationStatus === "pending"
        ) {
          // Patient's status is accepted or pending, navigate to PatientDashboard
          setIsLoading(false);
          login({ uid: patientDoc.id, ...patientData });
          navigate("/PatientDashboard");
        } else {
          // Status is null or rejected, navigate to SelectDoctor
          navigate("/SelectDoctor");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        toast.error("Patient data not found.");
      }
    } catch (error) {
      toast.error("Email or Password is invalid");
      setIsLoading(false);
      console.error(error);
      setShowWrongPasswordAlert(true);
    }
  };

  const handleEmailValidation = (event) => {
    const emailInput = event.target;
    (emailInput.value === "" || emailRegex.test(emailInput.value));
  };

  const handleSignupClick = () => {
    navigate("Patientsignup");
  };
  const handlepatientForgotPassword = () => {
    // Navigate to the Reset Password page when the button is clicked
    navigate("/ResetPassword");
  };

  return (
    <>
      <div className="interface-content" id="patient-content">
        <h1>Patient login</h1>
        <form id="patientlogin-form" onSubmit={handlePatientLogin}>
          <label htmlFor="patient-email">Email:</label>
          <input
            type="text"
            id="patient-email"
            name="patient-email"
            required
            onBlur={handleEmailValidation}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <label htmlFor="patient-password">Password:</label>
          <input
            type="password"
            id="patient-password"
            name="patient-password"
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button type="submit" className="loginBtn" disabled={isLoading}>
            {isLoading ? (
              <Spinner animation="border" variant="success" />
            ) : (
              "Login"
            )}
          </button>
          <button
            type="button"
            id="patient-forgot-password"
            onClick={handlepatientForgotPassword}
          >
            Forgot Password
          </button>

          {/* Display wrong password alert */}
          {showWrongPasswordAlert && (
            <div className="error-message" id="patient-error-message">
              Incorrect email or password. Please try again.
            </div>
          )}
        </form>
        <p className="card">
          
          Don't have an account yet?
          </p>
          <br />
          <button className="signup-btn" href="#" onClick={handleSignupClick}>
            Sign Up
          </button>
        
      </div>
    </>
  );
}
