import Navbar from "./components/Navbar";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./components/Admin";
import PatientDashboard from "./components/patientdashboard";
import Patientsignup from "./components/patientsignup";
import SelectDoctor from "./components/selectdoctor";
import RegisterDoctor from "./components/Registerdoctor";
import DoctorDashboard from "./components/doctordashboard";
import LabReportsPage from "./components/LabReportsPage";
import MedicalHistoryPage from "./components/MedicalHistoryPage";
import PatientChat from "./components/patientchat";
import DoctorChat from "./components/doctorchat";
import ResetPassword from "./components/Resetpassword";
import PatientProfile from "./components/PatientProfile";
import DoctorProfile from "./components/doctorprofile";
import AdminProfile from "./components/AdminProfile";
import EmergencyRoom from "./components/EmergencyRoom";
import About from "./components/About";
import Notifications from "./components/Notifications";
import Hardware from "./components/Hardware";
import EmergencyAlert from "./components/EmergencyAlert";
import Medicalhistory from "./components/Medicalhistory";
import Patientlist from "./components/Patientlist";
import Viewpatientprofile from "./components/Viewpatientprofile";
import Layout from "./components/main-layout/Index";
import RegisterAttendent from "./components/RegisterAttendent";
import SensorData from "./components/sensordata";
import PatientNotification from "./components/patientnotification";
import Ecgdata from "./components/EcgData";
import DisableDoctorList from "./components/DisableDoctorList";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Navbar
        title="Hyperkalemia Monitoring System"
        AboutText="About Hyperkalemia"
      />
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/patientdashboard" element={<PatientDashboard />} />
        <Route path="/Patientsignup" element={<Patientsignup />} />
        {/* <Route path="/patient-login" element={<Main />} /> */}
        <Route path="/SelectDoctor" element={<SelectDoctor />} />
        <Route path="/Registerdoctor" element={<RegisterDoctor />} />
        <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
        <Route path="/lab-reports" element={<LabReportsPage />} />
        <Route path="/medical-reports" element={<MedicalHistoryPage />} />
        <Route path="/PatientChat" element={<PatientChat />} />
        <Route path="/DoctorChat" element={<DoctorChat />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/PatientProfile" element={<PatientProfile />} />
        <Route path="/DoctorProfile" element={<DoctorProfile />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />
        <Route path="/RegisterAttendent" element={<RegisterAttendent />} />
        <Route path="/EmergencyRoom" element={<EmergencyRoom />} />
        <Route path="/About" element={<About />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/Hardware" element={<Hardware />} />
        <Route path="/EmergencyAlert" element={<EmergencyAlert />} />
        <Route path="/Medicalhistory" element={<Medicalhistory />} />
        <Route path="/Patientlist" element={<Patientlist />} />
        <Route path="/Viewpatientprofile" element={<Viewpatientprofile />} />
        <Route path="/SensorData" element={<SensorData />} />
        <Route path="/PatientNotification" element={<PatientNotification />} />
        <Route path="/Ecgdata" element={<Ecgdata />} />
        <Route path="/doctor-disable" element={<DisableDoctorList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
