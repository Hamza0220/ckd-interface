import React, { useEffect, useState } from "react";
import { auth, firestore, db } from "./firebaseconfig";
import "firebase/auth";
import "firebase/database";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, push, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./selectdoctor.scss";
import { toast } from "react-toastify";
import DoctorProfileModal from "./DoctorProfileModal";
const SelectDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Selected doctor state
  const [viewedDoctorProfile, setViewedDoctorProfile] = useState(null); // Viewed doctor's profile state
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");
  const [show, setShow] = useState(false);
  useEffect(() => {
    const doctorsCollection = collection(firestore, "doctor-profile-data");
    getDocs(doctorsCollection).then((querySnapshot) => {
      const doctorsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: `${doc.data().firstName} ${doc.data().lastName}`,
        age: doc.data().age,
        gender: doc.data().gender,
        experience: doc.data().Experience,
        speciality: doc.data().speciality,
        Hospital: doc.data().Hospital,
      }));
      setDoctors(doctorsData);
    });
  }, []);

  const handleViewProfile = async (doctor) => {
    setShow(true);

    try {
      const profileRef = doc(firestore, "doctor-profile-data", doctor.id);
      const profileSnapshot = await getDoc(profileRef);

      if (profileSnapshot.exists()) {
        const doctorData = profileSnapshot.data();
        console.log("Doctor Profile Data:", doctorData);
        setViewedDoctorProfile(doctorData); // Set the viewed doctor's profile
      } else {
        toast.error("Doctor profile not found.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching the profile.");
    }
  };

  const handleSelectDoctor = async (doctor) => {
    try {
      const currentUser = auth.currentUser;
      console.log("currentUser", currentUser);

      const docRef = doc(db, "patient-data", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap);
        const currentPatient = docSnap.data();
        const currentPatientId = docSnap.id;

        if (
          currentPatient.notification_status === null ||
          currentPatient.notification_status === "rejected"
        ) {
          const user = auth.currentUser;

          if (!user) {
            throw new Error("User not authenticated.");
          }

          const patientUID = user.uid;
          const patientRef = doc(db, "patient-data", patientUID);

          const patientDoc = await getDoc(patientRef);

          if (patientDoc.exists()) {
            const patientData = patientDoc.data();
            const patientName = patientData.username || "";

            const notificationData = {
              doctorId: doctor.id,
              patientId: currentUser.uid,
              doctorName: doctor.name,
              patientName: patientName,
              status: "pending", // Set the status to "pending" here
              age: doctor.age,
              gender: doctor.gender,
              experience: doctor.experience,
              speciality: doctor.speciality,
              Hospital: doctor.Hospital,
            };

            const notificationsCollection = collection(db, "notifications");

            await addDoc(notificationsCollection, notificationData);

            // Update the patient's notification_status
            await updateDoc(docRef, {
              notification_status: "pending",
            });

            navigate("/patientdashboard");
          } else {
            toast.error("Patient data not found.");
          }
        } else {
          toast.error("Notification already sent");
          navigate("/PatientDashboard");
        }
      }
    } catch (error) {
      console.error(error);

      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="SelectDoctor">
      <h1>Please select a doctor</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">Gender</th>
            <th scope="col">Experience</th>
            <th scope="col">Speciality</th>
            <th scope="col">Current Workplace</th>
            <th scope="col">Details</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor, index) => (
            <tr key={doctor.id}>
              <th scope="row">{index + 1}</th>
              <td>{doctor.name}</td>
              <td>{doctor.age}</td>
              <td>{doctor.gender}</td>
              <td>{doctor.experience}</td>
              <td>{doctor.speciality}</td>
              <td>{doctor.Hospital}</td>
              <td>
                <button onClick={() => handleViewProfile(doctor)}>
                  View Profile
                </button>
              </td>
              <td>
                <button onClick={() => handleSelectDoctor(doctor)}>
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewedDoctorProfile && (
        <DoctorProfileModal
          show={show}
          setShow={setShow}
          doctor={viewedDoctorProfile}
          closeModal={() => setViewedDoctorProfile(null)}
        />
      )}

      {errorMessage && <p id="error-message">{errorMessage}</p>}
    </div>
  );
};

export default SelectDoctor;
