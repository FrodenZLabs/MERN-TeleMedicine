import DoctorDashboardGrid from "../../components/DoctorDashboardGrid";
import NavbarSidebar from "../../components/NavbarSideBar";


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
