import PatientsDashboardGrid from "../../components/dashboard_widgets/PatientsDashboardGrid";
import NavbarSidebar from "../../components/layout/NavbarSideBar";

const PatientDashboard = () => {
  return (
    <div>
      <NavbarSidebar>
        <div className="px-4 pt-6">
          <PatientsDashboardGrid />
        </div>
      </NavbarSidebar>
    </div>
  );
};

export default PatientDashboard;
