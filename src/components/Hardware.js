import React, { useContext, useEffect, useState } from 'react';
import { ref, onValue, getDatabase } from 'firebase/database';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { UserContext } from './main-layout/UserContext';
import { db } from './firebaseconfig'; // Assuming db is your Firestore instance

function Hardware() {
  const { user } = useContext(UserContext);
  const [hardwareList, setHardwareList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [selectedHardware, setSelectedHardware] = useState(null);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    if (user.uid) {
      const realTimeDB = getDatabase();

      // Fetch hardware from Realtime Database
      const hardwareRef = ref(realTimeDB, 'hardwares');
      onValue(hardwareRef, (snapshot) => {
        const data = snapshot.val();
        const hardwareArray = data ? Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        })) : [];
        setHardwareList(hardwareArray);
      });

      // Fetch patients from Firestore
      const fetchPatients = async () => {
        const q = query(collection(db, "patient-data"), where("doctorId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const patientsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatientList(patientsArray);
      };

      fetchPatients();
    }
  }, [isRefresh, user.uid]);

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
      <div classNameName="mt-3">
        <div classNameName="border">
          <div>
            <ul className="responsive-table">
              <li className="table-header">
                <div className="col col-2 hdr">Patient Name</div>
                <div className="col col-3 hdr">Select Hardware</div>
                {/* <div className="col col-4 hdr">Status</div> */}
                <div className="col col-4 hdr">Action</div>
              </li>
              {patientList?.map((item, i) => (
                <>
                  <li className="table-row" key={i}>
                    <div className="col col-2" data-label="Customer Name">
                      {`${item?.firstName} ${item?.lastName}`}
                    </div>
                    <div className="col col-3" data-label="Amount">
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
                      className="col col-4"
                      data-label="Payment Status text-capital"
                    >
                      {item?.status ? item?.status : "Pending"}
                    </div> */}
                    <div
                      className="col col-4"
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
