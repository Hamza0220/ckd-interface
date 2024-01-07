import React, { useContext, useEffect, useState } from "react";
import { auth, db, firestore } from "./firebaseconfig";
import "firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { runTransaction, serverTimestamp } from "firebase/firestore";
import "./Notification.scss";
import { UserContext } from "./main-layout/UserContext";

function Notifications() {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [data, setData] = useState({});
  const currentUser = auth.currentUser;
  const currentDoctorId = currentUser?.uid;
  const currentPatientId = currentUser?.uid;
  console.log(auth.currentUser);
  const getname = (email) => {
    var atIndex = email.indexOf("@");

    if (atIndex !== -1) {
      var name = email.slice(0, atIndex);
      console.log(name);
      return name;
    } else {
      console.log("Invalid email address");
    }
  };
  useEffect(() => {
    if (user.uid) {
      const currentDoctorId = user.uid;
    const getData = async () => {
      const q = query(
        collection(db, "notifications"),
        where("doctorId", "==", currentDoctorId)
      );
      const querySnapshot = await getDocs(q);
      const notificationArray = [];
      querySnapshot.forEach((doc) => {
        const notificationData = doc.data();
        notificationArray.push({ id: doc.id, ...notificationData });
      });
      setNotifications(notificationArray.reverse()); // Reverse the array to show new notifications at the top
    };
    getData();
  }

  }, [currentDoctorId,user.uid]);

  const acceptNotification = async (
    notificationId,
    patientName,
    notificationData
  ) => {
    if (!currentUser || !currentDoctorId || !currentPatientId) {
      // Handle the case where the user or IDs are not available.
      return;
    }

    if (notificationData.status === "accepted") {
      console.log("Notification has already been accepted");
      return;
    }

    try {
      const notificationRef = doc(firestore, "notifications", notificationId);

      // Update notification status to 'accepted'
      await updateDoc(notificationRef, {
        patientName: patientName,
        status: "accepted",
        doctorId: currentDoctorId,
        // patientId: currentPatientId,
      });

      // Create a reference to the patient data
      const patientDataRef = doc(
        firestore,
        "patient-data",
        notificationData.patientId
      );

      // Check if the patient data document exists
      const patientDataSnapshot = await getDoc(patientDataRef);

      if (patientDataSnapshot.exists()) {
        // Update the patient data
        await updateDoc(patientDataRef, {
          notification_status: "accepted",
          doctorId: currentDoctorId,
        });

        // Create a reference to the patient profile data
        // const patientProfileRef = doc(
        //   firestore,
        //   "patient-profile-data",
        //   notificationData.patientId
        // );

        // Update the patient profile data or create a new one if it doesn't exist
        // await setDoc(
        //   patientProfileRef,
        //   {
        //     doctorId: currentDoctorId,
        //   },
        //   { merge: true }
        // );
        // Use merge: true to merge with existing data if the document exists

        // Send a notification to the patient
        await addDoc(collection(firestore, "patientNotifications"), {
          text: `Your request has been Accepted by Dr. ${getname(
            currentUser.email
          )}`,
          patientId: notificationData.patientId,
          patientName: patientName,
          doctorId: currentDoctorId,
        });

        console.log("Notification accepted and patient name  associated");

        // Check if patientId is available before using it
        if (notificationData.patientName) {
          // Send a notification to the patient
          const patientNotificationRef = await addDoc(
            collection(firestore, "patientNotifications"),
            {
              text: `Your request has been Accepted by Dr. ${getname(
                currentUser.email
              )}`,
              patientId: notificationData.currentpatient,
              patientName: patientName,
              doctorId: currentDoctorId,
            }
          );

          console.log("Patient notification sent.");
        } else {
          console.error("PatientId is missing in the notification data.");
        }

        // Update the local state with the new status and associated patient information
        setNotifications((prevNotifications) => {
          const updatedNotifications = prevNotifications.map(
            (prevNotification) => {
              if (prevNotification.id === notificationId) {
                return {
                  ...prevNotification,
                  status: "accepted",
                  doctorName: currentUser.displayName,
                };
              }
              return prevNotification;
            }
          );
          return updatedNotifications;
        });
      } else {
        console.error("Patient data document does not exist.");
      }
    } catch (error) {
      console.error("Error accepting notification:", error);
    }
  };

  const rejectNotification = async (
    notificationId,
    patientName,
    notificationData
  ) => {
    if (!currentUser || !currentDoctorId) {
      // Handle the case where the user is not signed in.
      return;
    }

    if (notificationData.status === "rejected") {
      console.log("Notification has already been rejected");
      return;
    }

    try {
      const notificationRef = doc(db, "notifications", notificationId);

      // Update notification status to 'rejected'
      await updateDoc(notificationRef, {
        patientName: patientName,
        status: "rejected",
        doctorId: currentDoctorId,
        // patientId: notificationId,
      });

      // Create a reference to the patient data
      const patientDataRef = doc(
        firestore,
        "patient-data",
        notificationData.patientId
      );

      // Update the patient data
      await updateDoc(patientDataRef, {
        notification_status: "rejected",
      });

      // Send a notification to the patient
      await addDoc(collection(firestore, "patientNotifications"), {
        text: `Your request has been rejected by Dr. ${getname(
          currentUser.email
        )}`,
        patientId: notificationData.patientId,
        patientName: patientName,
        doctorId: currentDoctorId,
      });

      console.log("Notification rejected and patient name not associated");

      // Check if patientId is available before using it
      if (notificationData.patientName) {
        // Send a notification to the patient
        const patientNotificationRef = await addDoc(
          collection(firestore, "patientNotifications"),
          {
            text: `Your request has been rejected by Dr. ${getname(
              currentUser.email
            )}`,
            patientId: notificationData.currentpatient,
            patientName: patientName,
            doctorId: currentDoctorId,
          }
        );

        console.log("Patient notification sent.");
      } else {
        console.error("PatientId is missing in the notification data.");
      }

      // Update the local state with the new status and associated patient information
      setNotifications((prevNotifications) => {
        const updatedNotifications = prevNotifications.map(
          (prevNotification) => {
            if (prevNotification.id === notificationId) {
              return {
                ...prevNotification,
                status: "rejected",
                doctorName: currentUser.displayName,
              };
            }
            return prevNotification;
          }
        );
        return updatedNotifications;
      });
    } catch (error) {
      console.error("Error rejecting notification:", error);
    }
  };

  // const rejectNotification = async (notificationId) => {
  //   if (!currentUser) {
  //     // Handle the case where the user is not signed in.
  //     return;
  //   }

  //   try {
  //     const notificationRef = doc(db, 'notifications', notificationId);

  //     // Update notification status to 'rejected'
  //     await updateDoc(notificationRef, {
  //       status: 'rejected',
  //     });

  //     console.log('Notification rejected');

  //     // You can update the state or perform any additional actions here
  //   } catch (error) {
  //     console.error('Error rejecting notification:', error);
  //   }

  // };

  return (
    <>
      {console.log("notification=========>", notifications)}
      {/* *******  */}
      <div style={{ background: "#e0ebe0", height: "100vh" }}>
        <div className="container-md">
          <div>
            <h1>Notifications</h1>
            <div>
              <div className="ntflis">
                {notifications?.map((notification, index) => (
                  <div key={index}>
                    {notification.status === "accepted" ||
                    notification.status === "rejected" ? (
                      ""
                    ) : (
                      <div className="d-flex align-items-center border mt-3 bg-body-tertiary">
                        <p className="w-75 text-start ps-3">
                          {" "}
                          Request for patient {notification.patientName}
                        </p>
                        <div className="w-25 text-end pe-3">
                          <button
                            className="bst12"
                            title="Reject"
                            onClick={() =>
                              rejectNotification(
                                notification.id,
                                notification.patientName,
                                notification
                              )
                            }
                          >
                            ❌
                          </button>
                          <button
                            className="bst12"
                            title="Accept"
                            onClick={() =>
                              acceptNotification(
                                notification.id,
                                notification.patientName,
                                notification
                              )
                            }
                          >
                            ✅
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <div className="border">
                  <h1 className="py-4 fs-2 fw-bold">
                    Associated Doctor and Patient
                  </h1>
                  <div>
                    <ul class="responsive-table">
                      <li class="table-header">
                        <div class="col col-2 hdr">Doctor Name</div>
                        <div class="col col-3 hdr">Patient Name</div>
                        <div class="col col-4 hdr">Status</div>
                      </li>
                      {notifications?.map((notification) => (
                        <>
                          <li class="table-row">
                            <div class="col col-2" data-label="Customer Name">
                              {notification.doctorName}
                            </div>
                            <div class="col col-3" data-label="Amount">
                              {notification.patientName}
                            </div>
                            <div
                              class="col col-4"
                              data-label="Payment Status text-capital"
                            >
                              {notification.status
                                ? notification.status
                                : "Pending"}
                            </div>
                          </li>
                        </>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notifications;
