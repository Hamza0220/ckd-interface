import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "./firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { UserContext } from "./main-layout/UserContext";

export default function PatientNotification() {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  // const currentUser = auth.currentUser;
  const currentUser = user.uid;
  const currentPatientId = user.uid;

  useEffect(() => {


    if(user && user.uid){
    
    const fetchData = async () => {
      try {
        if (currentPatientId) {
          const q = query(
            collection(db, "patientNotifications"),

            where("patientId", "==", currentUser)
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
  }
    // Cleanup if needed
    // return () => {
    //   // Any cleanup code here, if necessary
    // };
    
  }, [currentPatientId,user.uid]);

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
