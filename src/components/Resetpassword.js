import React, { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseconfig";
import './Resetpassword.scss';

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async () => {
    if (email !== "") {
      try {
        await sendPasswordResetEmail(auth, email);
        setResetError(null);
        setEmail(""); // Clear the email field

        // Show success message and note after a delay
        setResetSuccess(true);
        setTimeout(() => {
          setResetSuccess(false);
        }, 15000); // 5000 milliseconds = 5 seconds
      } catch (error) {
        console.error(error);
        setResetSuccess(false);
        setResetError("An error occurred while sending the password reset email. Please try again later.");
      }
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="reset-password-form">
      <h1>Reset Password</h1>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <button type="button" onClick={handleForgotPassword}>
          Reset Password
        </button>
      </form>
      {resetSuccess && (
        <p className="success-message">
          Password reset email sent successfully.
        </p>
      )}
      {resetError && <p className="error-message">Error: {resetError}</p>}
      {resetSuccess && (
        <p className="note">
          Note: Please check your email and reset your password.
        </p>
      )}
    </div>
  );
}
