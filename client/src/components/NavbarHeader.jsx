/* eslint-disable react/no-unescaped-entities */
import { useSidebarContext } from "../context/SidebarContext";
import { HiMenuAlt1, HiSearch, HiX } from "react-icons/hi";
import { Dropdown, Label, TextInput, Navbar, Avatar } from "flowbite-react";
import SmallScreen from "../helpers/SmallScreen";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { signoutSuccess } from "../redux/reducers/authenticationSlice";
import NotificationBellDropdown from "./NotificationBellDropdown";
import { Link } from "react-router-dom";

const NavbarHeader = () => {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.authentication);

  const handleSignout = async () => {
    const response = await fetch("/mediclinic/auth/signout", {
      method: "POST",
    });
    if (!response.ok) {
      toast.error("Error signing out.");
    }
    // eslint-disable-next-line no-unused-vars
    const data = response.json();
    toast.success("You have signed out successfully.");
    dispatch(signoutSuccess());
  };
  return (
    <Navbar fluid>
      <div className="w-full p-2 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Toggle Sidebar</span>
                {isOpenOnSmallScreens && SmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <Navbar.Brand href="/">
              <img src="" alt="" className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Medi<span className="text-green-400">Clinic</span>
              </span>
            </Navbar.Brand>
            <form action="" className="ml-16 hidden md:block">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <TextInput
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                size={32}
                type="search"
                required
              />
            </form>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="flex items-center">
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              >
                <span className="sr-only">Search</span>
                <HiSearch className="h-6 w-6" />
              </button>
              <NotificationBellDropdown />
            </div>
            <div className="block">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <span>
                    <span className="sr-only">User menu</span>
                    <Avatar
                      alt="user"
                      img={currentUser.user_profile}
                      rounded
                      size="sm"
                    />
                  </span>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">{currentUser.username}</span>
                  <span className="block truncate italic text-sm font-medium">
                    {currentUser.email}
                  </span>
                </Dropdown.Header>
                {currentUser.role === "admin" && (
                  <>
                    <Link to={"/admin-dashboard"}>
                      <Dropdown.Item>Dashboard</Dropdown.Item>
                    </Link>
                    <Link to={"/department-list"}>
                      <Dropdown.Item as="div">Departments</Dropdown.Item>
                    </Link>
                    <Link to={"/doctors-list"}>
                      <Dropdown.Item as="div">Doctors</Dropdown.Item>
                    </Link>
                  </>
                )}
                {currentUser.role === "doctor" && (
                  <>
                    <Link to={"/dashboard"}>
                      <Dropdown.Item as="div">Dashboard</Dropdown.Item>
                    </Link>
                    <Link to={"/appointment-list"}>
                      <Dropdown.Item as="div">My Appointments</Dropdown.Item>
                    </Link>
                    <Link to={"/doctor-patients"}>
                      <Dropdown.Item as="div">My Patients</Dropdown.Item>
                    </Link>
                    <Link to={"/video-consultation"}>
                      <Dropdown.Item as="div">
                        My Video Consultation
                      </Dropdown.Item>
                    </Link>
                    <Link to={"/user-profile"}>
                      <Dropdown.Item as="div">My Profile</Dropdown.Item>
                    </Link>
                  </>
                )}
                {currentUser.role === "patient" && (
                  <>
                    <Link to={"/dashboard"}>
                      <Dropdown.Item as="div">Dashboard</Dropdown.Item>
                    </Link>
                    <Link to={"/appointment-list"}>
                      <Dropdown.Item as="div">My Appointments</Dropdown.Item>
                    </Link>
                    <Link to={"/payments-list"}>
                      <Dropdown.Item as="div">My Payments</Dropdown.Item>
                    </Link>
                    <Link to={"/video-consultation"}>
                      <Dropdown.Item as="div">
                        My Video Consultation
                      </Dropdown.Item>
                    </Link>
                    <Link to={"/user-profile"}>
                      <Dropdown.Item as="div">My Profile</Dropdown.Item>
                    </Link>
                  </>
                )}

                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default NavbarHeader;
