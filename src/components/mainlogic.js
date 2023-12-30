export default function mainlogic() {
  // Get the interface buttons and content sections
  const doctorButton = document.getElementById("doctor-button");
  const patientButton = document.getElementById("patient-button");
  const adminButton = document.getElementById("admin-button");
  const doctorContent = document.getElementById("doctor-content");
  const patientContent = document.getElementById("patient-content");
  const adminContent = document.getElementById("admin-content");

  // Set the default interface to doctor
  doctorButton.classList.add("active");
  patientContent.style.display = "none";
  adminContent.style.display = "none";

  // Add click event listeners to the interface buttons
  doctorButton.addEventListener("click", function () {
    doctorButton.classList.add("active");
    patientButton.classList.remove("active");
    adminButton.classList.remove("active");
    doctorContent.style.display = "block";
    patientContent.style.display = "none";
    adminContent.style.display = "none";
  });
  patientButton.addEventListener("click", function () {
    doctorButton.classList.remove("active");
    patientButton.classList.add("active");
    adminButton.classList.remove("active");
    doctorContent.style.display = "none";
    patientContent.style.display = "block";
    adminContent.style.display = "none";
  });
  adminButton.addEventListener("click", function () {
    doctorButton.classList.remove("active");
    patientButton.classList.remove("active");
    adminButton.classList.add("active");
    doctorContent.style.display = "none";
    patientContent.style.display = "none";
    adminContent.style.display = "block";
  });
}
