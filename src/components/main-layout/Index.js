import React from "react";
import { useState } from "react";
import Patient from "./Patient";
import Attendent from "./Attendent";
import Doctor from "./Doctor";
import AdminLogin from "../AdminLogin";
import "./index.scss"
export default function Layout() {
  const [show, setShow] = useState("doctor");
  const handleAdminButtonClick = () => {
    setShow("admin");
  };
  const handlePatientButtonClick = () => {
    setShow("patient");
  };
  const handleDoctorButtonClick = () => {
    setShow("doctor");
  };
  const handleAttendentButtonClick = () => {
    setShow("attendent");
  };
  return (
    <>
    
      <div className="background-image">
        <div className="heading">
          <h1>HYPERKALEMIA MONITORING SYSTEM</h1>
        </div>

        <div className="interface">
          <div className="interface-buttons">
            <button
              id="doctor-button"
              className={`${show === "doctor" ? "active" : ""}`}
              onClick={handleDoctorButtonClick}
            >
              Doctor
            </button>
            <button
              id="patient-button"
              className={`${show === "patient" ? "active" : ""}`}
              onClick={handlePatientButtonClick}
            >
              Patient
            </button>
            <button
              id="attendent-button"
              className={`${show === "attendent" ? "active" : ""}`}
              onClick={handleAttendentButtonClick}
            >
              Attendent
            </button>
            <button
              id="admin-button"
              className={`${show === "admin" ? "active" : ""}`}
              onClick={handleAdminButtonClick}
            >
              Admin
            </button>
          </div>
          {show === "admin" && <AdminLogin />}
          {show === "patient" && <Patient />}
          {show === "attendent" && <Attendent />}
          {show === "doctor" && <Doctor />}
        </div>
      </div>
    </>
  );
}
