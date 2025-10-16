import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFoundPage from "./pages/404";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import LoginPage from "./pages/authentication/LoginPage";
import AdminLoginPage from "./pages/authentication/AdminLoginPage";
import PatientLoginPage from "./pages/authentication/PatientLoginPage";
import DoctorLoginPage from "./pages/authentication/DoctorLoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import PatientDashboard from "./pages/Dashboard/PatientDashboard";
import OnlyAdminPrivateRoute from "./components/private_routes/OnlyAdminPrivateRoute";
import OnlyPatientPrivateRoute from "./components/private_routes/OnlyPatientPrivateRoute";
import { ThemeInit } from "../.flowbite-react/init";
import DoctorDetailView from "./pages/detail_view/DoctorDetailView";
import PatientDetailView from "./pages/detail_view/PatientDetailView";
import PrescriptionDetailView from "./pages/detail_view/PrescriptionDetailView";
import DepartmentDetailView from "./pages/detail_view/DepartmentDetailView";
import UsersListView from "./pages/detail_view/UsersListView";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import DoctorPatientList from "./components/others/DoctorPatientList";
import OnlyDoctorPrivateRoute from "./components/private_routes/OnlyDoctorPrivateRoute";
import NotificationDetailView from "./pages/detail_view/NotificationDetailView";
import VideoConsultationView from "./pages/detail_view/VideoConsultationView";
import UserProfile from "./pages/UserProfile";
import PaymentDetailView from "./pages/detail_view/PaymentDetailView";
import AppointmentDetailView from "./pages/detail_view/AppointmentDetailView";
import PrivateRoute from "./components/private_routes/PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeInit />
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
