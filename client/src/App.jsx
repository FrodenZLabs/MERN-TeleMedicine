import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Login/RegisterPage";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import OnlyDoctorPrivateRoute from "./components/OnlyDoctorPrivateRoute";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import OnlyPatientPrivateRoute from "./components/OnlyPatientPrivateRoute";
import PatientDashboard from "./pages/Dashboard/PatientDashboard";
import AdminLoginPage from "./pages/Login/AdminLoginPage";
import DoctorLoginPage from "./pages/Login/DoctorLoginPage";
import PatientLoginPage from "./pages/Login/PatientLoginPage";
import NotFoundPage from "./pages/404";
import PatientDetailView from "./pages/PatientDetailView";
import DoctorDetailView from "./pages/DoctorDetailView";
import PaymentDetailView from "./pages/PaymentDetailView";
import VideoConsultationView from "./pages/VideoConsultationView";
import AppointmentDetailView from "./pages/AppointmentDetailView";
import PrivateRoute from "./components/PrivateRoute";
import DepartmentDetailView from "./pages/DepartmentDetailView";
import UserProfile from "./pages/UserProfile";
import UsersListView from "./pages/UsersListView";
import DoctorPatientList from "./components/DoctorPatientList";
import PrescriptionDetailView from "./pages/PrescriptionDetailView";
import NotificationDetailView from "./pages/NotificationDetailView";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/doctor-login" element={<DoctorLoginPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />

        {/* Patient signup  */}
        <Route path="/signup" element={<RegisterPage />} />

        {/* Users must signin inorder to access this pages */}
        <Route element={<PrivateRoute />}>
          <Route path="/appointment-list" element={<AppointmentDetailView />} />
          <Route path="/payments-list" element={<PaymentDetailView />} />
          <Route
            path="/video-consultation"
            element={<VideoConsultationView />}
          />
          <Route
            path="/notification-list"
            element={<NotificationDetailView />}
          />
          <Route path="/user-profile" element={<UserProfile />} />
        </Route>

        {/* Users must be admins inorder to access this page */}
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/doctors-list" element={<DoctorDetailView />} />
          <Route path="/patients-list" element={<PatientDetailView />} />
          <Route
            path="/prescription-list"
            element={<PrescriptionDetailView />}
          />
          <Route path="/users-list" element={<UsersListView />} />
          <Route path="/department-list" element={<DepartmentDetailView />} />
        </Route>

        {/* Users must be doctors inorder to access this pages */}
        <Route element={<OnlyDoctorPrivateRoute />}>
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-patients" element={<DoctorPatientList />} />
        </Route>

        {/* Users must be patients inorder to access this pages */}
        <Route element={<OnlyPatientPrivateRoute />}>
          <Route path="/dashboard" element={<PatientDashboard />} />
        </Route>

        {/* Fallback route for handling undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
