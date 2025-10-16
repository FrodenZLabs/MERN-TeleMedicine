import AdminDashboardGrid from "../../components/dashboard_widgets/AdminDashboardGrid";
import NavbarSidebar from "../../components/layout/NavbarSideBar";
// import AdminDashboardStats from "../../components/AdminDashboardStats";
// import PaymentTransaction from "../../components/PaymentTransaction";

const AdminDashboard = () => {
  return (
    <div>
      <NavbarSidebar>
        <div className="px-4 pt-6">
          <AdminDashboardGrid />
          {/* <AdminDashboardStats />
          <PaymentTransaction /> */}
        </div>
      </NavbarSidebar>
    </div>
  );
};

export default AdminDashboard;
