import React, { useEffect, useState } from "react";
import { database } from "./firebaseconfig";
import { ref, onValue } from "firebase/database";

export default function SensorData() {
  const [sensorData, setSensorData] = useState({
    heartRate: "",
    heartRateStatus: "NULL",
    spo2: "",
    spo2Status: "NULL",
    respiratoryRate: "",
    respiratoryRateStatus: "NULL",
  });

  useEffect(() => {
    // Get a reference to the sensor data
    const sensorDataRef = ref(database, "/sensorData");

    // Listen for changes in the sensor data
    onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(data);
        // setSensorData(data);
      }
    });
  }, []);

  return (
    <div style={{ background: "#c1d8c1", height: "90vh" }}>
      <div className="container-md  py-5">
        <div className="row">
          <div
            className="col-md-10 mx-md-auto border"
            style={{ background: "#e0ebe0" }}
          >
            <h1 className="py-4 fs-2 fw-bold">Sensor Data</h1>
            <div className="d-flex pb-5">
              <div style={{ flex: "1" }}>
                <h2 className="fs-5 fw-bold text-secondary py-3 bg-white">
                  Heart rate
                </h2>
                <h2 className="fs-5 fw-bold text-secondary py-3 bg-white">
                  Heart rate status{" "}
                </h2>
                <h2 className="fs-5 fw-bold text-secondary py-3 bg-white">
                  SpO2
                </h2>
                <h2 className="fs-5 fw-bold text-secondary py-3 bg-white">
                  SpO2 status
                </h2>
                <h2 className="fs-5 fw-bold text-secondary py-3 bg-white">
                  Respiratory rate
                </h2>
                <h2 className="fs-5 fw-bold text-secondary py-3 bg-white">
                  Respiratory rate status
                </h2>
              </div>
              <div style={{ flex: "1" }}>
                <h2 className="fs-6 fw-bolder text-danger py-3">
                  {" "}
                  {sensorData.heartRate} bpm
                </h2>
                <h2 className="fs-6 fw-bolder text-danger py-3">
                  {sensorData.heartRateStatus}
                </h2>
                <h2 className="fs-6 fw-bolder text-danger py-3">
                  {" "}
                  {sensorData.spo2}%
                </h2>
                <h2 className="fs-6 fw-bolder text-danger py-3">
                  {sensorData.spo2Status}
                </h2>
                <h2 className="fs-6 fw-bolder text-danger py-3">
                  {sensorData.respiratoryRate} breaths per minute
                </h2>
                <h2 className="fs-6 fw-bolder text-danger py-3">
                  {sensorData.respiratoryRateStatus}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
