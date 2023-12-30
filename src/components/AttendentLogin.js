import React, { useState } from "react";
import { auth } from "./firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Admin from "./Admin";
import "./adminlogin.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AttendentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showWrongPasswordAlert, setShowWrongPasswordAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user && user.email === "h.ishaq84@gmail.com") {
          // toast.success('Admin logged in successfully!');
          toast.success("Admin logged in successfully!", {
            icon: "🚀",
          });
          setIsAdminLoggedIn(true);
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);

          navigate("/admin");
        } else {
          console.log("User is not an admin.");
          setShowWrongPasswordAlert(true);
          setTimeout(() => {
            setShowWrongPasswordAlert(false);
          }, 5000);
          setErrorMessage("You are not authorized as an admin.");
        }
      })
      .catch((error) => {
        // setShowWrongPasswordAlert(true);
        toast.error("Email or Password is invalid");
        console.error(error);
        if (error.code === "auth/user-not-found") {
          setErrorMessage("User not found. Please check your email.");
        } else if (error.code === "auth/wrong-password") {
          setErrorMessage("Incorrect password. Please try again.");
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      });
  };
  const handleAdminForgotPassword = () => {
    // Navigate to the Reset Password page when the button is clicked
    navigate("/ResetPassword");
  };

  return (
    <>
      {showSuccessMessage && (
        <div className="success-message">Admin logged in successfully!</div>
      )}

      {isAdminLoggedIn ? (
        <Admin />
      ) : (
        <div>
          <div className="interface-content" id="admin-content"></div>
          <h2>Attendent Login</h2>
          <form onSubmit={handleAdminLogin}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input type="submit" value="Login" />

            <div>
              <button
                type="button"
                id="patient-forgot-password"
                onClick={handleAdminForgotPassword}
              >
                Forgot Password
              </button>
            </div>

            {showWrongPasswordAlert && (
              <div className="wrong-password-alert">
                Wrong password. Please try again.
              </div>
            )}

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default AttendentLogin;
