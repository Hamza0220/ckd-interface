import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function PatientNotification() {
  const [notifications, setNotifications] = useState([]);
  const currentUser = auth.currentUser;
  const currentPatientId = currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentPatientId) {
          const q = query(
            collection(db, "patientNotifications"),

            where("patientId", "==", currentUser?.uid)
          );
          console.log("current patient", currentPatientId);

          const snapshot = await getDocs(q);
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched data:", data); // Log data to the console
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Cleanup if needed
    return () => {
      // Any cleanup code here, if necessary
    };
  }, [currentPatientId]);

  return (
    <div>
      <h1>Patient Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.text}</li>
        ))}
      </ul>
    </div>
  );
}
