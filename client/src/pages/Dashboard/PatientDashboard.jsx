import NavbarSidebar from "../../components/NavbarSideBar";
import PatientsDashboardGrid from "../../components/PatientsDashboardGrid";

const PatientDashboard = () => {
  return (
    <div>
      <NavbarSidebar>
        <div className="px-4 pt-6">
          <PatientsDashboardGrid/>
        </div>
      </NavbarSidebar>
    </div>
  );
}

export default PatientDashboard
