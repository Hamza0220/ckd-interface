import React, { useEffect, useState } from 'react';
import { firestore } from './firebaseconfig'; // Import the Firestore instance
import { collection, getDocs } from 'firebase/firestore';
import './Patientlist.scss'
function PatientList() {
  const [patientNames, setPatientNames] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const patientsCollection = collection(firestore, 'patient-data');
      const querySnapshot = await getDocs(patientsCollection);
      const names = querySnapshot.docs.map((doc) => doc.data().username);
      setPatientNames(names);
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <h1>Patient List</h1>
      <div className='List-style'>
        {patientNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </div>
    </div>
  );
}

export default PatientList;
