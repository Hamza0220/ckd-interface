import React from "react";
import * as Yup from "yup";
import { auth } from "./firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Registerdoctor.scss";
import { useFormik } from "formik";

const RegisterDoctor = () => {
  const navigate = useNavigate();

  const signUpSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[a-zA-Z0-9_-]+$/, "Enter a valid username (letters only)")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Required field"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email format"
      )
      .required("Required field"),
    specialty: Yup.string().required("Required field"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required Field"),
    is_emergency: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      specialty: "",
      password: "",
      is_emergency: false,
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;
        console.log(user);

        const db = getFirestore();
        const doctorsCollection = collection(db, "doctors");

        await setDoc(doc(doctorsCollection, user.uid), {
          name: values.name,
          email: values.email,
          specialty: values.specialty,
          is_emergency: values.is_emergency,
        });

        toast.success("Doctor registered successfully.");
        navigate("/");
        formik.resetForm(); // Reset the form
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          toast.error("This email is already in use");
        } else {
          toast.error("An error occurred during registration");
        }
        console.error("Error creating user:", error);
        toast.error("Error creating user:", error);
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
    <div className="register-doctor">
      <h2>Doctor Registration</h2>
      <form id="doctor-register" onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            {...formik.getFieldProps("name")}
            type="text"
            id="name"
            name="name"
            {...formik.getFieldProps("name")}
            required
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-danger fs--small">{formik.errors.name}</div>
          )}
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
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger fs--small">{formik.errors.email}</div>
          )}
        </div>

        <label htmlFor="specialty">Specialty:</label>
        <input
          {...formik.getFieldProps("specialty")}
          type="text"
          id="specialty"
          name="specialty"
          {...formik.getFieldProps("specialty")}
          required
        />
        {formik.touched.specialty && formik.errors.specialty && (
          <div className="text-danger fs--small">{formik.errors.specialty}</div>
        )}

        <label htmlFor="password">Password:</label>
        <input
          {...formik.getFieldProps("password")}
          type="password"
          id="password"
          name="password"
          {...formik.getFieldProps("password")}
          required
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-danger fs--small">{formik.errors.password}</div>
        )}

        <div className="text-center">
          <button
            disabled={!formik.isValid}
            // className="btn btn-primary"
            type="submit"
            style={btnStyle}
          >
            Register
          </button>
        </div>
      </form>
      {formik.isSubmitting && <div>Submitting...</div>}
      {formik.status && <div className="error-message">{formik.status}</div>}
    </div>
  );
};

export default RegisterDoctor;
