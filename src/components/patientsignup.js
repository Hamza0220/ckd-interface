import * as Yup from "yup";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

import { auth } from "./firebaseconfig"; // Updated import
import { useNavigate } from "react-router-dom";
import "./patientsignup.css";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Spinner } from "react-bootstrap";

const Patientsignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const signUpSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .matches(/^[a-zA-Z0-9_-]+$/, "Enter a valid username")
      .required("Required field"),
    contact: Yup.number().required("Required field"),
    password: Yup.string()
      .required("Required Field")
      .min(6, "Password must be at least 6 characters"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email format"
      )
      .required("Required field"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      contact: "",
      email: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      console.log("object", values);

      const firestore = getFirestore();

      try {
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;
        console.log("User created: " + user.email);

        // Assuming you have user, username, email, and contact defined

        // Create a reference to the Firestore document
        const userDocRef = doc(firestore, "patient-data", user.uid);

        // Use the setDoc function to set the data in Firestore
        try {
          await setDoc(userDocRef, {
            username: values.username,
            email: values.email,
            contact: values.contact,
            notification_status: null,
          });
          console.log("User data saved successfully to Firestore");
        } catch (error) {
          console.error("Error saving user data to Firestore: ", error);
        }

        console.log("User details saved to database");
        toast.success("Patient signed up successfully");
        setShowSuccessMessage(true);
        resetForm();
        navigate("/");
        setIsLoading(false);
      } catch (error) {
        resetForm();
        toast.error("Something Went Worng");
        const errorMessage = error.message;
        console.log("Signup error: " + errorMessage);
      }
    },
  });
  const btnStyle = {
    backgroundColor: "#61c064",
    color: "white",
    padding: "12px 20px",
    border: "dotted",
    borderRadius: "30px",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "16px",
    display: "flex",
    margin: "auto",
  };
  return (
    <div>
      <b>
        <h1>Patient Sign-up</h1>
      </b>

      <form id="signup-form" onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <br />
          <input
            {...formik.getFieldProps("username")}
            type="text"
            required
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-danger fs--small">
              {formik.errors.username}
            </div>
          ) : null}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            {...formik.getFieldProps("email")}
            type="email"
            id="email"
            required
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-danger fs--small">{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="contact">Contact:</label>
          <br />
          <input
            {...formik.getFieldProps("contact")}
            type="text"
            id="contact"
            required
            value={formik.values.contact}
          />
          {formik.touched.contact && formik.errors.contact ? (
            <div className="text-danger fs--small">{formik.errors.contact}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            {...formik.getFieldProps("password")}
            type="password"
            id="password"
            required
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-danger fs--small">
              {formik.errors.password}
            </div>
          ) : null}
        </div>
        <div className="text-center">
          <button
            disabled={!formik.isValid}
            // className="btn btn-primary"
            type="submit"
            style={btnStyle}
          >
            {isLoading ? (
              <Spinner animation="border" variant="success" />
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Patientsignup;
