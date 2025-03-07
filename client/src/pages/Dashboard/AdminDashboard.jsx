/* eslint-disable react/no-unescaped-entities */
import NavbarSidebar from "../../components/NavbarSideBar";
import AdminDashboardGrid from "../../components/AdminDashboardGrid";
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
