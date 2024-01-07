import React, { useState, useEffect } from "react";
import { updateDoc } from "firebase/firestore";
import { auth, config, db } from "./firebaseconfig"; // Import Firebase auth
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore
import "./patientprofile.scss"; // Import your SCSS file for styling
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
function AdminProfile() {
  // const [profilePicture] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null); // To hold the new profile picture
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [file, setfile] = useState("");
  const [profilepic, setprofilepic] = useState("");
  const [speciality] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  // const [btnDisable, setBtnDisable] = useState(false);

  const { storage } = config;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);

        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              setFirstName(userData.firstName || "");
              setLastName(userData.lastName || "");
              setEmail(userData.email || "");
              setAge(userData.age || "");
              setGender(userData.gender || "");
              setAddress(userData.address || "");
              setPhoneNumber(userData.phoneNumber || "");
              setprofilepic(userData.profile_pic || "");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });

        // Fetch profile picture URL from Firebase Storage
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isRefresh]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return; // Do nothing if no file is selected
    }
    setfile(file);
    // Display the selected profile picture before saving
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewProfilePicture(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (newProfilePicture) {
      // Upload the new profile picture to Firebase Storage
      // const storageRef = ref(firebaseStorage, `profilePictures/${auth.currentUser.uid}/profilePicture.jpg`);
      // await uploadBytes(storageRef, newProfilePicture);

      // const downloadURL = await getDownloadURL(storageRef);
      // setProfilePicture(downloadURL);

      const storageRef = ref(
        storage,
        "Admin-images/Admin-item_images/" + file.name
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
    }

    // Update the user's profile data in Firestore

    // Reset the new profile picture
  };

  const setuserdata = async (downloadURL) => {
    const db = getFirestore();
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userData = {
      firstName,
      lastName,
      email,
      age,
      gender,
      address,
      phoneNumber,
      speciality,
      profile_pic: downloadURL,
    };

    await setDoc(userRef, userData) // Use setDoc to save data to Firestore
      .then(() => {
        console.log("User profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating user profile:", error);
      });

    setIsEditing(false);
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
        "Admin-images/Admin-item_images/" + def.name
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
            const userRef = doc(db, "users", auth.currentUser.uid);

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
    <div className="profile-info" id="Adminprofile">
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
                alt="Avatar"
                className="avatar"
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
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="row4">
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
            <button onClick={handleSaveProfile}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="profile-picture-container">
            <img src={profilepic} alt="Profile" className="profile-picture" />
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
            <p>Address: {address}</p>
            <p>Phone Number: {phoneNumber}</p>
          </div>

          <button onClick={handleEditProfile}>Edit Profile</button>
        </>
      )}
    </div>
  );
}

export default AdminProfile;
