import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebaseconfig";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";

function Hardware() {
  const currentUser = auth.currentUser;
  const currentDoctorId = currentUser?.uid;
  const [hardwareList, setHardwareList] = useState([]);
  console.log("hardwareList", hardwareList);
  const [patientList, setPatientList] = useState([]);
  const [selectedHardware, setSelectedHardware] = useState(null);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    const fetchPatientsAndHardware = async () => {
      // Fetch patients
      const q = query(
        collection(db, "patient-data"),
        where("doctorId", "==", currentDoctorId)
      );
      const querySnapshot = await getDocs(q);
      const Arr = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        Arr.push({ id: doc.id, ...data });
      });

      console.log("patientData", Arr);
      setPatientList(Arr);

      // Fetch hardware
      const hardwareSnapshot = await getDocs(collection(db, "hardwares"));
      const hardwareData = hardwareSnapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }));
      setHardwareList(hardwareData);
    };

    fetchPatientsAndHardware();
  }, [isRefresh]);

  const handleChangeHardware = (value) => {
    let find = hardwareList.find((el) => el.name === value);
    setSelectedHardware(find);
  };
  const handleAllocatedHardware = async (value) => {
    if (selectedHardware) {
      if (selectedHardware.assignedPatientId) {
        toast.warn("Please Select Different Hardware");
      } else {
        const docRef = doc(db, "patient-data", value.id);
        const hardwareRef = doc(db, "hardwares", selectedHardware.id);

        await updateDoc(docRef, {
          assignedHardware: selectedHardware?.name,
          assignedHardwareId: selectedHardware?.id,
        })
          .then(async () => {
            await updateDoc(hardwareRef, {
              assignedPatientId: value.id,
            }).then(() => {
              toast.success("Hardware Allocated");
              setSelectedHardware("");
              setIsRefresh(!isRefresh);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      toast.warn("Please Select Hardware First");
    }
  };
  const handleDisAllocatedHardware = async (value) => {
    console.log("==========>", value);
    const hardwareRef = doc(db, "hardwares", value.assignedHardwareId);
    const docRef = doc(db, "patient-data", value.id);
    await updateDoc(docRef, {
      assignedHardware: "",
      assignedHardwareId: "",
    })
      .then(async () => {
        await updateDoc(hardwareRef, {
          assignedPatientId: null,
        }).then(() => {
          toast.success("Hardware DisAllocated");
          setSelectedHardware("");
          setIsRefresh(!isRefresh);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <h2>Patient List</h2>
      <div className="mt-3">
        <div className="border">
          <div>
            <ul class="responsive-table">
              <li class="table-header">
                <div class="col col-2 hdr">Patient Name</div>
                <div class="col col-3 hdr">Select Hardware</div>
                {/* <div class="col col-4 hdr">Status</div> */}
                <div class="col col-4 hdr">Action</div>
              </li>
              {patientList?.map((item, i) => (
                <>
                  <li class="table-row" key={i}>
                    <div class="col col-2" data-label="Customer Name">
                      {`${item?.firstName} ${item?.lastName}`}
                    </div>
                    <div class="col col-3" data-label="Amount">
                      {item?.assignedHardware ? (
                        item?.assignedHardware
                      ) : (
                        <select
                          onChange={(e) => handleChangeHardware(e.target.value)}
                        >
                          <option value="">Select Hardware</option>
                          {hardwareList?.map((el) => (
                            <option value={el.name} key={el.name}>
                              {el.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {/* <div
                      class="col col-4"
                      data-label="Payment Status text-capital"
                    >
                      {item?.status ? item?.status : "Pending"}
                    </div> */}
                    <div
                      class="col col-4"
                      data-label="Payment Status text-capital"
                    >
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          Action
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {!item?.assignedHardware && (
                            <Dropdown.Item
                              onClick={() => handleAllocatedHardware(item)}
                            >
                              Allocate Hardware
                            </Dropdown.Item>
                          )}
                          {item?.assignedHardware && (
                            <Dropdown.Item
                              onClick={() => handleDisAllocatedHardware(item)}
                            >
                              DisAllocate Hardware
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </li>
                </>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hardware;
