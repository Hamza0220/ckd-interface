import React, { useEffect, useState } from "react";
import {  firestore, db } from "./firebaseconfig";
import "firebase/auth";
import "firebase/database";
import {
  // addDoc,
  collection,
  doc,
  // getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
import "./selectdoctor.scss";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
const DisableDoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log("doctors", doctors);
  // const navigate = useNavigate();
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      const doctorsCollection = collection(firestore, "doctors");
      const querySnapshot = await getDocs(doctorsCollection);

      const doctorsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDoctors(doctorsData);
      setIsLoading(false);
    };

    fetchDoctors();
  }, [isRefresh]);

  const handleDoctorDisable = async (doctor) => {
    const docRef = doc(db, "doctors", doctor.id);
    await updateDoc(docRef, {
      disable: true,
    })
      .then(() => {
        setIsRefresh(!isRefresh);
        toast.success("Doctor has been disabled successfully");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const handleDoctorEnable = async (doctor) => {
    const docRef = doc(db, "doctors", doctor.id);
    await updateDoc(docRef, {
      disable: false,
    })
      .then(() => {
        setIsRefresh(!isRefresh);
        toast.success("Doctor has been enabled successfully");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <p className="text-center">Loading...</p>
        </div>
      ) : (
        <div className="SelectDoctor px-4">
          <h1 className="mb-5">Doctor List</h1>
          <table className="table ">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
                <th scope="col">Gender</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <tr key={doctor.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{doctor.name}</td>
                  <td>{doctor.age}</td>
                  <td>{doctor.gender}</td>
                  <td>
                    {doctor?.disable ? (
                      <span class="badge bg-danger">Disable</span>
                    ) : (
                      <span class="badge bg-success">Enable</span>
                    )}
                  </td>
                  <td className="text-end">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Action
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          href="#/action-1"
                          onClick={() => handleDoctorDisable(doctor)}
                        >
                          Disable
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="#/action-2"
                          onClick={() => handleDoctorEnable(doctor)}
                        >
                          Enable
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DisableDoctorList;
