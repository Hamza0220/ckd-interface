import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./main.scss";
// import "./main.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref } from "firebase/database"; // Use 'ref' and 'get' from here
import { push } from "firebase/database"; // Use 'push' and 'getDatabase' from here
import {
  auth,
  db,
  database as firebaseDatabase,
  firestore,
} from "../firebaseconfig";
// import {
//   auth,
//   database as firebaseDatabase,
//   firestore,
// } from "./firebaseconfig";
import { toast } from "react-toastify";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Spinner } from "react-bootstrap";
// Import the Firebase instances
import { useContext } from 'react';
import { UserContext } from './UserContext';
export default function Doctor() {
  const { login } = useContext(UserContext);
  const handleForgotPassword = () => {
    // Implement the logic to handle forgot password here
  };
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
  const [emailValid, setEmailValid] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [showPatientLogin, setShowPatientLogin] = useState(true);
  const [showDoctorLogin, setShowDoctorLogin] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showWrongPasswordAlert, setShowWrongPasswordAlert] = useState(false); // Declare the state here

  // State for storing login form data
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [doctorEmail, setdoctorEmail] = useState("");
  const [doctorPassword, setdoctorPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const storePatientLogin = (patientId, patientName) => {
    const loginTime = new Date().getTime(); // Get the current timestamp in milliseconds
    // Get the database instance
    const loginEventsRef = ref(
      firebaseDatabase,
      `patientLogins/${patientId}/loginEvents`
    );

    push(loginEventsRef, {
      name: patientName,
      loginTime: loginTime,
    })
      .then(() => {
        console.log("Patient login data saved to the database.");
      })
      .catch((error) => {
        console.error("Error saving patient login data:", error);
      });
  };
  // Function to handle patient login

  const handleEmailValidation = (event) => {
    const emailInput = event.target;
    setEmailValid(emailInput.value === "" || emailRegex.test(emailInput.value));
  };

  const handledoctorForgotPassword = () => {
    // Navigate to the Reset Password page when the button is clicked
    navigate("/ResetPassword");
  };

  const handleDoctorLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    console.log(doctorEmail, doctorPassword);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        doctorEmail,
        doctorPassword
      );
      console.log("User logged in successfully:", userCredential.user);
      // navigate("/DoctorDashboard");
      // Get the email of the logged-in doctor
      const loggedInDoctorEmail = userCredential.user.email;
      console.log("loggedindoctoremail", loggedInDoctorEmail);
      const doctorsCollection = collection(db, "doctors");
      const q = query(
        doctorsCollection,
        where("email", "==", loggedInDoctorEmail)
      );
      const querySnapshot = await getDocs(q);
      console.log("querry", querySnapshot);
      if (querySnapshot.size === 1) {
        const doctorDoc = querySnapshot.docs[0];
        const doctorData = doctorDoc.data();
        console.log("doctorData=======>", doctorData);
        // Check if the doctor is disabled
        if (doctorData && doctorData.disable) {
          setIsLoading(false);
          return toast.warn(
            "You can't be logged in. Your account is disabled."
          );
        }
        login({ uid: doctorDoc.id, ...doctorData });
        console.log("Doctor logged in successfully!");
        setIsLoading(false);
        navigate("/DoctorDashboard");

        // Proceed with navigation or other actions
      } else {
        toast.error("Doctor not found.");
        setIsLoading(false);
        console.log("Doctor not found.");
        // Handle the case when doctor data is not found
      }
    } catch (error) {
      toast.error("Email or Password is invalid");
      setIsLoading(false);
      console.error(error);
      setShowWrongPasswordAlert(true);
    }

  };
  return (
    <>
      <div className="interface-content" id="doctor-content">
        <h3>
          <>Doctor Login</>
        </h3>

        <form id="doctorlogin-form" onSubmit={handleDoctorLogin}>
          <label htmlFor="doctor-email">Email:</label>
          <input
            type="text"
            id="doctor-email"
            name="doctor-email"
            required
            onBlur={handleEmailValidation}
            value={doctorEmail}
            onChange={(e) => setdoctorEmail(e.target.value)}
          />

          <label htmlFor="doctor-password">Password:</label>
          <input
            type="password"
            id="doctor-password"
            name="doctor-password"
            required
            value={doctorPassword}
            onChange={(e) => setdoctorPassword(e.target.value)}
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
            onClick={handledoctorForgotPassword}
          >
            Forgot Password
          </button>
          <div
            className={`error-message ${!emailValid ? "visible" : ""}`}
            id="doctor-error-message"
          >
            {emailValid ? "" : "Invalid email"}
          </div>
        </form>
      </div>
    </>
  );
}
