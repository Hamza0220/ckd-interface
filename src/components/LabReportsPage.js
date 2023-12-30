import React, { useEffect, useState } from "react";
import { auth, db, firebaseStorage } from "./firebaseconfig"; // Update the imports
import { listAll, ref as sRef, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./labreports.scss";

const LabReportsPage = () => {
  const [uploadedLabReports, setUploadedLabReports] = useState([]);
  const currentUserId = auth.currentUser.uid; // Get the unique ID of the current user

  useEffect(() => {
    // Create a reference to the user's lab reports folder
    const labReportsStorageRef = sRef(
      firebaseStorage,
      `labReports/${currentUserId}`
    );

    listAll(labReportsStorageRef)
      .then(async (result) => {
        const labReportList = await Promise.all(
          result.items.map(async (item) => {
            const downloadURL = await getDownloadURL(item);
            return {
              name: item.name,
              downloadURL,
            };
          })
        );
        setUploadedLabReports(labReportList);
      })
      .catch((error) => {
        console.error("Error fetching uploaded lab reports", error);
      });
  }, [currentUserId]);

  const openFullFile = (downloadURL) => {
    window.open(downloadURL, "_blank");
  };

  return (
    <div>
      <h2>Uploaded Lab Reports</h2>
      <div className="files">
        {uploadedLabReports.map((report, index) => (
          <div className="image" key={index} style={{ marginBottom: "20px" }}>
            {report.name.toLowerCase().endsWith(".jpg") ||
            report.name.toLowerCase().endsWith(".pdf") ||
            report.name.toLowerCase().endsWith(".jfif") ||
            report.name.toLowerCase().endsWith(".png") ? (
              <img
                src={report.downloadURL}
                alt={report.name}
                style={{ maxWidth: "100px", cursor: "pointer" }}
                onClick={() => openFullFile(report.downloadURL)}
              />
            ) : (
              <a
                href={report.downloadURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {report.name}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabReportsPage;
