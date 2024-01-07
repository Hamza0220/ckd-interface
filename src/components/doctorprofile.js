import React, { useState, useEffect } from "react";
import { auth, config, db } from "./firebaseconfig"; // Firebase auth and config
import {
  getFirestore,
  doc,
  getDoc,
  // setDoc,
  updateDoc,
} from "firebase/firestore"; // Firestore
import "./patientprofile.scss"; // SCSS file for styling
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Spinner } from "react-bootstrap";

function UserProfile() {
  // State variables
  // const [profilePicture] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [Experience, setExperience] = useState("");
  const [Hospital, setHospital] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { storage } = config;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        const db = getFirestore();
        const userRef = doc(db, "doctors", user.uid);

        // Fetch user profile data from Firestore
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          console.log("userData===", userData);
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setEmail(userData.email || "");
          setAge(userData.age || "");
          setGender(userData.gender || "");
          setExperience(userData.Experience || "");
          setHospital(userData.Hospital || "");
          setPhoneNumber(userData.phoneNumber || "");
          setNewProfilePicture(userData.profile_pic || "");
          setProfilePic(userData.profile_pic || "");
          setSpeciality(userData.speciality || "");
        } else {
          // Handle the case where the user does not have a profile in Firestore
          setEmail(user.email); // Set email from Firebase auth user object
        }
      }
    });

    return () => unsubscribe();
  }, [isRefresh]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return; // Do nothing if no file is selected
    }
    setFile(file);
    // Display the selected profile picture before saving
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewProfilePicture(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    console.log("=====", newProfilePicture instanceof Blob);
    if (newProfilePicture instanceof Blob) {
      const storageRef = ref(
        storage,
        "doctor-images/doctor-item_images/" + file.name
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            await setuserdata(downloadURL);
          });
        }
      );
    } else {
      await setuserdata(newProfilePicture);
    }

    // Update the user's profile data in Firestore

    // Reset the new profile picture
  };

  const setuserdata = async (downloadURL) => {
    const db = getFirestore();
    const userRef = doc(db, "doctor-profile-data", auth.currentUser.uid);
    const userData = {
      firstName,
      lastName,
      email,
      age,
      gender,
      Experience,
      phoneNumber,
      speciality,
      Hospital,
      profile_pic: downloadURL,
    };

    await updateDoc(userRef, userData) // Use setDoc to save data to Firestore
      .then(() => {
        console.log("User profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating user profile:", error);
      });
    // also set data in doctor-data
    const washingtonRef = doc(db, "doctors", auth.currentUser.uid);
    console.log("washingtonRef", washingtonRef);
    await updateDoc(washingtonRef, {
      ...userData,
    });
    setIsEditing(false);
    setIsLoading(false);
    setIsRefresh(!isRefresh); // Disable editing mode after saving
    setNewProfilePicture(null);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };
  const handleChangeProfile = (e) => {
    // setBtnDisable(true);
    if (e.target.files[0]) {
      const def = e.target.files[0];
      const storageRef = ref(
        storage,
        "doctor-images/doctor-item_images/" + def.name
      );
      const uploadTask = uploadBytesResumable(storageRef, def);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            const userRef = doc(
              db,
              "doctor-profile-image",
              auth.currentUser.uid
            );

            // Set the "capital" field of the city 'DC'
            await updateDoc(userRef, {
              profile_pic: downloadURL,
            }).then(() => {
              setIsRefresh(!isRefresh);
              // setBtnDisable(false)
            });
          });
        }
      );
    }
  };
  return (
    <div className="profile-info" id="doctorprofile">
      {/* <h2>Patinet Profile</h2> */}
      {isEditing ? (
        <>
          <div className="profile-picture-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
            {newProfilePicture ? (
              <img
                src={newProfilePicture}
                alt="New Profile"
                className="profile-picture"
              />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/128/7542/7542190.png"
                alt="Profile"
                className="profile-picture"
              />
            )}
          </div>
          <div className="information">
            <div className="row1">
              <div className="input-group">
                <label>First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="row2">
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="doctoremail"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age:</label>
                <input
                  type="text"
                  id="age"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>
            <div className="row3">
              <div className="input-group">
                <label htmlFor="gender">Gender:</label>
                <input
                  type="text"
                  id="gender"
                  placeholder="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="experience">Experience:</label>
                <input
                  type="text"
                  id="experience"
                  placeholder="Experience"
                  value={Experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
            </div>
            <div className="row4">
              <div className="input-group">
                <label htmlFor="speciality">Speciality:</label>
                <input
                  type="text"
                  id="speciality"
                  placeholder="Speciality"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="Hospital">Hospitality:</label>
                <input
                  type="text"
                  id="Hospital"
                  placeholder="Hospital"
                  value={Hospital}
                  onChange={(e) => setHospital(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div id="saving">
            <button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                "Save"
              )}
            </button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="profile-picture-container">
            <img src={profilePic} alt="Profile" className="profile-picture" />
            <div className="text-center mt-3">
              <label htmlFor="change-profile">
                {" "}
                <button className="btn btn-primary">Change Photo</button>{" "}
              </label>
            </div>
            <input
              onChange={handleChangeProfile}
              className="d-none"
              type="file"
              name=""
              id="change-profile"
            />
          </div>
          <div></div>
          <div className="savingdata">
            <p>
              Name: {firstName} {lastName}
            </p>
            <p>Email: {email}</p>
            <p>Age: {age}</p>
            <p>Gender: {gender}</p>
            <p>Experience: {Experience}</p>
            <p>Phone Number: {phoneNumber}</p>
            <p>Speciality: {speciality}</p>
            <p>Hospitality: {Hospital}</p>
          </div>

          <button onClick={handleEditProfile}>Edit Profile</button>
        </>
      )}
    </div>
  );
}

export default UserProfile;
