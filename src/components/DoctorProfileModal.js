// DoctorProfileModal.js
// import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const DoctorProfileModal = ({ doctor, closeModal, show, setShow }) => {
  console.log(doctor);
  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Doctor's Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={doctor.profile_pic} className="profile-picture" alt="" />
          <p>
            Name: {doctor.firstName} {doctor.lastName}
          </p>
          <p>Age: {doctor.age}</p>
          <p>Gender: {doctor.gender}</p>
          <p>Experience: {doctor.Experience}</p>
          <p>Speciality: {doctor.speciality}</p>
          <p>Current Workplace: {doctor.Hospital}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorProfileModal;
