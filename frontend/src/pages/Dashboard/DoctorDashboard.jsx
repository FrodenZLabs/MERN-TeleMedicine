import DoctorDashboardGrid from "../../components/dashboard_widgets/DoctorDashboardGrid";
import NavbarSidebar from "../../components/layout/NavbarSideBar";



const DoctorDashboard = () => {
  return (
    <div>
      <NavbarSidebar>
        <div className="px-4 pt-6">
          <DoctorDashboardGrid />
        </div>
      </NavbarSidebar>
    </div>
  );
}

export default DoctorDashboard
