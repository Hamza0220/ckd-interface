import React, { useContext, useEffect, useState } from "react";
import { listAll, ref as sRef, getDownloadURL } from "firebase/storage";
import { firebaseStorage, auth } from "./firebaseconfig"; // Make sure to import auth
import "./labreports.scss";
import { UserContext } from "./main-layout/UserContext";

const MedicalHistoryPage = () => {
  const { user } = useContext(UserContext);
  const [uploadedMedicalReports, setUploadedMedicalReports] = useState([]);

  useEffect(() => {
    // Check if there's a currently authenticated user
    // const user = auth.currentUser;

    if (user.uid) {
      const currentUserId = user.uid;
      const medicalReportsStorageRef = sRef(
        firebaseStorage,
        `medicalReports/${currentUserId}`
      );
      listAll(medicalReportsStorageRef)
        .then(async (result) => {
          const medicalReportList = await Promise.all(
            result.items.map(async (item) => {
              const downloadURL = await getDownloadURL(item);
              return {
                name: item.name,
                downloadURL,
              };
            })
          );
          setUploadedMedicalReports(medicalReportList);
        })
        .catch((error) => {
          console.error("Error fetching uploaded medical reports", error);
        });
    }
  }, [user.uid]);

  const openFullFile = (downloadURL) => {
    window.open(downloadURL, "_blank");
  };

  return (
    <div>
      <h2>Uploaded Medical Reports</h2>
      <div className="medical-files">
        {uploadedMedicalReports.map((report, index) => (
          <div className="image" key={index} style={{ marginBottom: "20px" }}>
            {report.name.toLowerCase().endsWith(".jpg") ||
            report.name.toLowerCase().endsWith(".pdf") ||
            report.name.toLowerCase().endsWith(".jfif") ||
            report.name.toLowerCase().endsWith("jpeg") ||
            report.name.toLowerCase().endsWith(".docx") ||
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

export default MedicalHistoryPage;
