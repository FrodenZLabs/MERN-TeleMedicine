import { Sidebar, TextInput } from "flowbite-react";
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
import { useSidebarContext } from "../context/SidebarContext";
import SmallScreen from "../helpers/SmallScreen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/reducers/authenticationSlice";
import { Link } from "react-router-dom";
import { FaHandHoldingMedical, FaHospitalAlt, FaUser } from "react-icons/fa";

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
      const response = await fetch("/mediclinic/auth/signout", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Error signing out.");
      }
      toast.success("You have signed out successfully.");
      dispatch(signoutSuccess());
    } catch (error) {
      console.error("Signout error:", error);
      toast.error("Error signing out.");
    }
  };

  return (
    <div
      className={classNames("lg:!block border-t z-50", {
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
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {currentUser?.role === "admin" && (
                  <>
                    <Link to="/admin-dashboard">
                      <Sidebar.Item
                        icon={HiChartPie}
                        className={
                          currentPage === "/admin-dashboard"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Dashboard
                      </Sidebar.Item>
                    </Link>
                    <Link to="/doctors-list">
                      <Sidebar.Item
                        icon={FaUserDoctor}
                        className={
                          currentPage === "/doctors-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Doctors
                      </Sidebar.Item>
                    </Link>
                    <Link to="/patients-list">
                      <Sidebar.Item
                        icon={FaUserInjured}
                        className={
                          currentPage === "/patients-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Patients
                      </Sidebar.Item>
                    </Link>
                    <Link to="/prescription-list">
                      <Sidebar.Item
                        icon={FaHandHoldingMedical}
                        className={
                          currentPage === "/prescription-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Prescription
                      </Sidebar.Item>
                    </Link>
                    <Link to="/users-list">
                      <Sidebar.Item
                        icon={FaUser}
                        className={
                          currentPage === "/users-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Users
                      </Sidebar.Item>
                    </Link>
                    <Link to="/appointment-list">
                      <Sidebar.Item
                        icon={FaBookMedical}
                        className={
                          currentPage === "/appointment-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Appointments
                      </Sidebar.Item>
                    </Link>
                    <Link to="/payments-list">
                      <Sidebar.Item
                        icon={MdPayments}
                        className={
                          currentPage === "/payments-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Payments
                      </Sidebar.Item>
                    </Link>
                    <Link to="/video-consultation">
                      <Sidebar.Item
                        icon={FaVideo}
                        className={
                          currentPage === "/video-consultation"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Video Consultation
                      </Sidebar.Item>
                    </Link>
                    <Link to="/department-list">
                      <Sidebar.Item
                        icon={FaHospitalAlt}
                        className={
                          currentPage === "/department-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Departments
                      </Sidebar.Item>
                    </Link>
                  </>
                )}

                {currentUser?.role === "doctor" && (
                  <>
                    <Link to="/doctor-dashboard">
                      <Sidebar.Item
                        icon={HiChartPie}
                        className={
                          currentPage === "/doctor-dashboard"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Dashboard
                      </Sidebar.Item>
                    </Link>
                    <Link to="/video-consultation">
                      <Sidebar.Item
                        icon={FaVideo}
                        className={
                          currentPage === "/video-consultation"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Video Consultation
                      </Sidebar.Item>
                    </Link>
                    <Link to="/appointment-list">
                      <Sidebar.Item
                        icon={FaBookMedical}
                        className={
                          currentPage === "/appointment-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        My Appointments
                      </Sidebar.Item>
                    </Link>
                    <Link to="/doctor-patients">
                      <Sidebar.Item
                        icon={FaUserDoctor}
                        className={
                          currentPage === "/doctor-patients"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        My Patients
                      </Sidebar.Item>
                    </Link>
                  </>
                )}

                {currentUser?.role === "patient" && (
                  <>
                    <Link to="/dashboard">
                      <Sidebar.Item
                        icon={HiChartPie}
                        className={
                          currentPage === "/dashboard"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Dashboard
                      </Sidebar.Item>
                    </Link>
                    <Link to="/video-consultation">
                      <Sidebar.Item
                        icon={FaVideo}
                        className={
                          currentPage === "/video-consultation"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        Video Consultation
                      </Sidebar.Item>
                    </Link>
                    <Link to="/appointment-list">
                      <Sidebar.Item
                        icon={FaBookMedical}
                        className={
                          currentPage === "/appointment-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        My Appointments
                      </Sidebar.Item>
                    </Link>
                    <Link to="/payments-list">
                      <Sidebar.Item
                        icon={MdPayments}
                        className={
                          currentPage === "/payments-list"
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                        as="div"
                      >
                        My Payments
                      </Sidebar.Item>
                    </Link>
                  </>
                )}
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Link to="/notification-list">
                  <Sidebar.Item
                    icon={MdNotifications}
                    className={
                      currentPage === "/notification-list"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    as="div"
                  >
                    Notifications
                  </Sidebar.Item>
                </Link>

                {(currentUser?.role === "patient" ||
                  currentUser?.role === "doctor") && (
                  <Link to="/user-profile">
                    <Sidebar.Item
                      icon={CgProfile}
                      className={
                        currentPage === "/user-profile"
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }
                      as="div"
                    >
                      Profile
                    </Sidebar.Item>
                  </Link>
                )}

                <Sidebar.Item
                  icon={MdLogout}
                  onClick={handleSignout}
                  className="bg-red-100 hover:bg-red-300 font-bold"
                >
                  Sign Out
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default SidebarHeader;
