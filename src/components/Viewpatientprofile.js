import React, { useEffect, useState } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { auth, db, firebaseStorage } from "./firebaseconfig";
import "./Viewpatientprofile.scss";
import { getDownloadURL, listAll, ref } from "firebase/storage";

export default function Viewpatientprofile() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [labReports, setLabReports] = useState([]); // Add state for lab reports
  const [uploadedMedicalReports, setUploadedMedicalReports] = useState([]);
  const [activeIndx, setActiveIndx] = useState(null);
  const currentUser = auth.currentUser;
  console.log("currennnt user", currentUser.uid);
  useEffect(() => {
    const fetchData = async () => {
      // const q = query(collection(db, "patient-profile-data"));
      const q = query(
        collection(db, "patient-data"),
        where("doctorId", "==", currentUser?.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        const patientsData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const patientProfile = {
            id: doc.id,
            name: data.firstName + " " + data.lastName,
            age: data.age,
            email: data.email,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
            address: data.address,
            profile_pic: data.profile_pic,
          };
          patientsData.push(patientProfile);
        });

        setPatients(patientsData);
      } catch (error) {
        console.error("Error fetching patient profiles:", error);
      }
    };

    fetchData();
  }, []);

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);

    // Fetch and display medical history for the selected patient
    if (patient && patient.id) {
      const medicalReportsRef = ref(
        firebaseStorage,
        `medicalReports/${patient.id}`
      );
      listAll(medicalReportsRef)
        .then(async (result) => {
          const MedicalReportList = await Promise.all(
            result.items.map(async (item) => {
              const downloadURL = await getDownloadURL(item);
              return {
                name: item.name,
                downloadURL,
              };
            })
          );
          setMedicalHistory(MedicalReportList);
        })
        .catch((error) => {
          console.error("Error fetching medical history:", error);
        });

      // Fetch and display lab reports for the selected patient
      const labReportsRef = ref(firebaseStorage, `labReports/${patient.id}`);
      listAll(labReportsRef)
        .then(async (result) => {
          const labReportsList = await Promise.all(
            result.items.map(async (item) => {
              const downloadURL = await getDownloadURL(item);
              return {
                name: item.name,
                downloadURL,
              };
            })
          );
          setLabReports(labReportsList);
        })
        .catch((error) => {
          console.error("Error fetching lab reports:", error);
        });
    } else {
      setMedicalHistory([]);
      setLabReports([]); // Clear both medical history and lab reports if no patient is selected
    }
  };

  const openFullFile = (downloadURL) => {
    window.open(downloadURL, "_blank");
  };
  console.log("patients", patients);
  return (
    <div className="container-fluid pt-0" style={{ background: "none" }}>
      <div
        className="view-patient-list row py-5"
        style={{ background: "#cacec77d" }}
      >
        <div className="col-lg-3 col-md-6 col-12 mb-5">
          <div className="  h-100">
            <h2 className="fs-7">Patients List</h2>
            <ul className="list-unstyled">
              {patients.map((patient, indx) => (
                <li
                  key={patient.id}
                  className={`patient-btn ${
                    activeIndx === indx ? "patient-active" : ""
                  }`}
                  onClick={() => handlePatientClick(patient, indx)}
                >
                  {patient.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-12 mb-5">
          <div className=" h-100">
            <h3 className="fs-7">Patient Profile</h3>
            {selectedPatient ? (
              <div>
                <h4 className="fs-7">{selectedPatient.name}</h4>
                <img
                  src={selectedPatient.profile_pic}
                  className="profile-picture"
                  alt=""
                />
                <p className="text-start">
                  Age: <span className="fw-normal">{selectedPatient.age}</span>
                </p>
                <p className="text-start">
                  Email:{" "}
                  <span className="fw-normal">{selectedPatient.email}</span>
                </p>
                <p className="text-start">
                  Gender:{" "}
                  <span className="fw-normal">{selectedPatient.gender}</span>
                </p>
                <p className="text-start">
                  PhoneNumber:{" "}
                  <span className="fw-normal">
                    {selectedPatient.phoneNumber}
                  </span>
                </p>
                <p className="text-start">
                  Address: <span>{selectedPatient.address}</span>
                </p>
              </div>
            ) : (
              <p>Select a patient from the list to view their profile.</p>
            )}
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-12 mb-5">
          <div className=" h-100">
            <h3 className="fs-7">Medical History</h3>
            <ul className="list-unstyled">
              {medicalHistory.map((report, index) => (
                <li key={(index = 1)} style={{ marginBottom: "20px" }}>
                  {report.name.toLowerCase().endsWith(".jpg") ||
                  report.name.toLowerCase().endsWith(".pdf") ||
                  report.name.toLowerCase().endsWith("jpeg") ||
                  report.name.toLowerCase().endsWith(".jfif") ||
                  report.name.toLowerCase().endsWith(".docx") ||
                  report.name.toLowerCase().endsWith(".png") ? (
                    <img
                      src={report.downloadURL}
                      alt={report.name}
                      className="img-fluid"
                      style={{ cursor: "pointer" }}
                      onClick={() => openFullFile(report.downloadURL)}
                    />
                  ) : (
                    <a
                      href={report.downloadURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {report.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-12 mb-5">
          <div className=" h-100">
            <h3 className="fs-7">Lab Reports</h3>
            <ul>
              {labReports.map((report, index) => (
                <li key={index} style={{ marginBottom: "20px" }}>
                  {report.name.toLowerCase().endsWith(".jpg") ||
                  report.name.toLowerCase().endsWith(".pdf") ||
                  report.name.toLowerCase().endsWith("jpeg") ||
                  report.name.toLowerCase().endsWith(".jfif") ||
                  report.name.toLowerCase().endsWith(".png") ? (
                    <img
                      src={report.downloadURL}
                      alt={report.name}
                      className="img-fluid"
                      style={{ listStyle: "none", cursor: "pointer" }}
                      onClick={() => openFullFile(report.downloadURL)}
                    />
                  ) : (
                    <a
                      href={report.downloadURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {report.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
