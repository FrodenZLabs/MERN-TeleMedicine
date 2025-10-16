import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  TextInput,
} from "flowbite-react";
import { HiChartPie, HiSearch } from "react-icons/hi";
import {
  FaBookMedical,
  FaUserDoctor,
  FaUserInjured,
  FaVideo,
} from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { MdLogout, MdNotifications, MdPayments } from "react-icons/md";
import classNames from "classnames";
import { useSidebarContext } from "../../context/SidebarContext";
import SmallScreen from "../../helpers/SmallScreen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../../redux/reducers/authenticationSlice";
import { Link } from "react-router-dom";
import { FaHandHoldingMedical, FaHospitalAlt, FaUser } from "react-icons/fa";
import { logoutUser } from "../../services/authService";

export function SidebarHeader() {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();
  const [currentPage, setCurrentPage] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.authentication);

  useEffect(() => {
    const newPage = window.location.pathname;
    setCurrentPage(newPage);
  }, []);

  const handleSignout = async () => {
    try {
      const response = await logoutUser();
      if (response.success === true) {
        toast.success("You have signed out successfully.");
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.error("Signout error:", error);
      toast.error("Error signing out.");
    }
  };

  return (
    <div
      className={classNames("lg:block! border-t z-50", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <Sidebar
        aria-label="Sidebar with multi-level dropdown"
        collapsed={isSidebarOpenOnSmallScreens && !SmallScreen()}
        className="h-screen"
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <form action="" className="pb-3 md:hidden">
              <TextInput
                icon={HiSearch}
                placeholder="Search"
                size={32}
                required
                type="search"
              />
            </form>
            <SidebarItems>
              <SidebarItemGroup>
                {currentUser?.role === "admin" && (
                  <>
                    <Link to="/admin-dashboard">
                      <SidebarItem
                        icon={HiChartPie}
                        className={
                          currentPage === "/admin-dashboard"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        Dashboard
                      </SidebarItem>
                    </Link>
                    <Link to="/doctors-list">
                      <SidebarItem
                        icon={FaUserDoctor}
                        className={
                          currentPage === "/doctors-list" ? "bg-gray-100" : ""
                        }
                        as="div"
                      >
                        Doctors
                      </SidebarItem>
                    </Link>
                    <Link to="/patients-list">
                      <SidebarItem
                        icon={FaUserInjured}
                        className={
                          currentPage === "/patients-list" ? "bg-gray-100" : ""
                        }
                        as="div"
                      >
                        Patients
                      </SidebarItem>
                    </Link>
                    <Link to="/prescription-list">
                      <SidebarItem
                        icon={FaHandHoldingMedical}
                        className={
                          currentPage === "/prescription-list"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        Prescription
                      </SidebarItem>
                    </Link>
                    <Link to="/users-list">
                      <SidebarItem
                        icon={FaUser}
                        className={
                          currentPage === "/users-list" ? "bg-gray-100" : ""
                        }
                        as="div"
                      >
                        Users
                      </SidebarItem>
                    </Link>
                    <Link to="/appointment-list">
                      <SidebarItem
                        icon={FaBookMedical}
                        className={
                          currentPage === "/appointment-list"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        Appointments
                      </SidebarItem>
                    </Link>
                    <Link to="/payments-list">
                      <SidebarItem
                        icon={MdPayments}
                        className={
                          currentPage === "/payments-list" ? "bg-gray-100" : ""
                        }
                        as="div"
                      >
                        Payments
                      </SidebarItem>
                    </Link>
                    <Link to="/video-consultation">
                      <SidebarItem
                        icon={FaVideo}
                        className={
                          currentPage === "/video-consultation"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        Video Consultation
                      </SidebarItem>
                    </Link>
                    <Link to="/department-list">
                      <SidebarItem
                        icon={FaHospitalAlt}
                        className={
                          currentPage === "/department-list"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        Departments
                      </SidebarItem>
                    </Link>
                  </>
                )}

                {currentUser?.role === "doctor" && (
                  <>
                    <Link to="/doctor-dashboard">
                      <SidebarItem
                        icon={HiChartPie}
                        className={
                          currentPage === "/doctor-dashboard"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        Dashboard
                      </SidebarItem>
                    </Link>
                    <Link to="/video-consultation">
                      <SidebarItem
                        icon={FaVideo}
                        className={
                          currentPage === "/video-consultation"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        Video Consultation
                      </SidebarItem>
                    </Link>
                    <Link to="/appointment-list">
                      <SidebarItem
                        icon={FaBookMedical}
                        className={
                          currentPage === "/appointment-list"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        My Appointments
                      </SidebarItem>
                    </Link>
                    <Link to="/doctor-patients">
                      <SidebarItem
                        icon={FaUserDoctor}
                        className={
                          currentPage === "/doctor-patients"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        My Patients
                      </SidebarItem>
                    </Link>
                  </>
                )}

                {currentUser?.role === "patient" && (
                  <>
                    <Link to="/dashboard">
                      <SidebarItem
                        icon={HiChartPie}
                        className={
                          currentPage === "/dashboard" ? "bg-gray-100" : ""
                        }
                        as="div"
                      >
                        Dashboard
                      </SidebarItem>
                    </Link>
                    <Link to="/video-consultation">
                      <SidebarItem
                        icon={FaVideo}
                        className={
                          currentPage === "/video-consultation"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        Video Consultation
                      </SidebarItem>
                    </Link>
                    <Link to="/appointment-list">
                      <SidebarItem
                        icon={FaBookMedical}
                        className={
                          currentPage === "/appointment-list"
                            ? "bg-gray-100"
                            : ""
                        }
                        as="div"
                      >
                        My Appointments
                      </SidebarItem>
                    </Link>
                    <Link to="/payments-list">
                      <SidebarItem
                        icon={MdPayments}
                        className={
                          currentPage === "/payments-list" ? "bg-gray-100" : ""
                        }
                        as="div"
                      >
                        My Payments
                      </SidebarItem>
                    </Link>
                  </>
                )}
              </SidebarItemGroup>
              <SidebarItemGroup>
                <Link to="/notification-list">
                  <SidebarItem
                    icon={MdNotifications}
                    className={
                      currentPage === "/notification-list" ? "bg-gray-100" : ""
                    }
                    as="div"
                  >
                    Notifications
                  </SidebarItem>
                </Link>

                {(currentUser?.role === "patient" ||
                  currentUser?.role === "doctor") && (
                  <Link to="/user-profile">
                    <SidebarItem
                      icon={CgProfile}
                      className={
                        currentPage === "/user-profile" ? "bg-gray-100" : ""
                      }
                      as="div"
                    >
                      Profile
                    </SidebarItem>
                  </Link>
                )}

                <SidebarItem
                  icon={MdLogout}
                  onClick={handleSignout}
                  className="bg-red-100 hover:bg-red-300 font-bold"
                >
                  Sign Out
                </SidebarItem>
              </SidebarItemGroup>
            </SidebarItems>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default SidebarHeader;
