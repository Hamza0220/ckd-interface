import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./main.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref } from "firebase/database"; // Use 'ref' and 'get' from here
import { push } from "firebase/database"; // Use 'push' and 'getDatabase' from here
import {
  auth,
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
// Import the Firebase instances

export default function Attendent() {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
  const [emailValid, setEmailValid] = useState(true);
  const navigate = useNavigate();
  const [showWrongPasswordAlert, setShowWrongPasswordAlert] = useState(false); // Declare the state here
  const [attendentEmail, setAttendentEmail] = useState("");
  const [attendentPasswod, setAttendentPasswod] = useState("");
  // Function to handle patient login

  const handleEmailValidation = (event) => {
    const emailInput = event.target;
    setEmailValid(emailInput.value === "" || emailRegex.test(emailInput.value));
  };

  const handleattendentForgotPassword = () => {
    // Navigate to the Reset Password page when the button is clicked
    navigate("/ResetPassword");
  };

  const handleAttendentLogin = async (event) => {
    event.preventDefault();
    console.log(attendentEmail, attendentPasswod);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        attendentEmail,
        attendentPasswod
      );
      console.log("User logged in successfully:", userCredential.user);
      navigate("/EmergencyRoom");
      // Get the email of the logged-in attendent
      const loggedInattendentEmail = userCredential.user.email;

      const attendentsCollection = collection(firestore, "attendents");
      const q = query(
        attendentsCollection,
        where("email", "==", loggedInattendentEmail)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 1) {
        toast.success("Attendent logged in successfully!");
        navigate("/EmergencyRoom");
        // Proceed with navigation or other actions
      } else {
        console.log("Attendent not found.");
        // Handle the case when attendent data is not found
      }
    } catch (error) {
      toast.error("Email or Password is invalid");
      console.error(error);
      setShowWrongPasswordAlert(true);
    }
  };
  return (
    <>
      <div className="interface-content" id="attendent-content">
        <h3>
          <>Attendent Login</>
        </h3>

        <form id="attendentlogin-form" onSubmit={handleAttendentLogin}>
          <label htmlFor="attendent-email">Email:</label>
          <input
            type="text"
            id="attendent-email"
            name="attendent-email"
            required
            onBlur={handleEmailValidation}
            value={attendentEmail}
            onChange={(e) => setAttendentEmail(e.target.value)}
          />

          <label htmlFor="attendent-password">Password:</label>
          <input
            type="password"
            id="attendent-password"
            name="attendent-password"
            required
            value={attendentPasswod}
            onChange={(e) => setAttendentPasswod(e.target.value)}
          />

          <input type="submit" value="Login" />
          <button
            type="button"
            id="attendent-forgot-password"
            onClick={handleattendentForgotPassword}
          >
            Forgot Password
          </button>
          <div
            className={`error-message ${!emailValid ? "visible" : ""}`}
            id="attendent-error-message"
          >
            {emailValid ? "" : "Invalid email"}
          </div>
        </form>
      </div>
    </>
  );
}
