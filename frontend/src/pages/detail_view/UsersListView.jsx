import { HiCheck, HiHome, HiOutlineExclamationCircle } from "react-icons/hi";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { MdKey, MdKeyOff } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import NavbarSidebar from "../../components/layout/NavbarSideBar";
import { Activate, Deactivate, getUsers } from "../../services/authService";

const UsersListView = () => {
  const [users, setUsers] = useState([]);
  const [userIdToDeactivate, setUserIdToDeactivate] = useState("");
  const [userIdToActivate, setUserIdToActivate] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const usersPerPage = 10;
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    role: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const urlParams = new URLSearchParams(location.search);

  useEffect(() => {
    const searchTermFromUrl = urlParams.get("searchTerm");
    const roleFromUrl = urlParams.get("role");

    if (searchTermFromUrl || roleFromUrl) {
      setSearchData({
        searchTerm: searchTermFromUrl || "",
        role: roleFromUrl || "all",
      });
    }

    fetchUsers(currentPage); // Fetch users on initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchData]);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await getUsers({ searchData, page, usersPerPage });

      setUsers(response.users);
      setTotalUsers(response.totalUsers);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "admin" ||
      e.target.id === "doctor" ||
      e.target.id === "patient"
    ) {
      setSearchData({ ...searchData, role: e.target.id });
    }

    if (e.target.id === "users-search") {
      setSearchData({ ...searchData, searchTerm: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchUsers(1); // Fetch users with the current search query
  };

  const handleDeactivate = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await Deactivate(userIdToDeactivate);
      await fetchUsers(currentPage); // Fetch users again to update the list
      setLoading(false);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const handleActivate = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await Activate(userIdToActivate);
      await fetchUsers(currentPage); // Fetch users again to update the list
      setLoading(false);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <NavbarSidebar isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <BreadcrumbItem href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="">Home</span>
                </div>
              </BreadcrumbItem>
              <BreadcrumbItem href="/users-list">Users</BreadcrumbItem>
              <BreadcrumbItem>List</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Users
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form
                className="lg:pr-3 flex flex-col sm:flex-row justify-between"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col sm:flex-row">
                  <Label htmlFor="users-search" className="sr-only">
                    Search
                  </Label>
                  <div className="relative mt-1 sm:mt-0 lg:w-64 xl:w-96">
                    <TextInput
                      id="users-search"
                      name="users-search"
                      placeholder="Search for users"
                      value={searchData.searchTerm}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center mt-2 sm:mt-0 sm:ml-6">
                  <Label className="font-semibold">Role:</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="all"
                      onChange={handleChange}
                      checked={searchData.role === "all"}
                    />
                    <span>All Roles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="admin"
                      onChange={handleChange}
                      checked={searchData.role === "admin"}
                    />
                    <span>Admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="doctor"
                      onChange={handleChange}
                      checked={searchData.role === "doctor"}
                    />
                    <span>Doctor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="patient"
                      onChange={handleChange}
                      checked={searchData.role === "patient"}
                    />
                    <span>Patient</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}
      <div className="flex flex-col m-4">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHead className="bg-gray-100 text-center">
                  <TableRow>
                    <TableHeadCell>Username</TableHeadCell>
                    <TableHeadCell>Email Address</TableHeadCell>
                    <TableHeadCell>Role</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                  </TableRow>
                </TableHead>
                {errorMessage ? (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan="5"
                        className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                      >
                        {errorMessage}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  users.map((user) => (
                    <TableBody
                      key={user._id}
                      className="divide-y divide-gray-200 bg-white"
                    >
                      <TableRow className="hover:bg-gray-100 text-center">
                        <TableCell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900">
                          {user?.username ? user.username : "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                          {user?.email ? user.email : "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap p-4 text-lg font-medium text-gray-900">
                          {user?.role ? (
                            <>
                              {user.role === "admin" && (
                                <div className="flex items-center gap-2">
                                  <Badge size="lg" className="bg-green-300">
                                    Admin
                                  </Badge>
                                </div>
                              )}
                              {user.role === "doctor" && (
                                <div className="flex items-center gap-2">
                                  <Badge size="lg" className="bg-blue-300">
                                    Doctor
                                  </Badge>
                                </div>
                              )}
                              {user.role === "patient" && (
                                <div className="flex items-center gap-2">
                                  <Badge size="lg" className="bg-purple-300">
                                    Patient
                                  </Badge>
                                </div>
                              )}
                            </>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                          {user?.isactive ? (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-300" icon={HiCheck} />
                              Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-red-400" icon={FaXmark} />
                              Inactive
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-x-3 whitespace-nowrap">
                            {user?.isactive ? (
                              <Button
                                color="red"
                                onClick={() => {
                                  setOpen(true);
                                  setUserIdToDeactivate(user._id);
                                }}
                              >
                                <div className="flex items-center gap-x-2">
                                  <MdKeyOff className="text-lg" />
                                  Deactivate
                                </div>
                              </Button>
                            ) : (
                              <Button
                                color="yellow"
                                onClick={() => {
                                  setOpenModal(true);
                                  setUserIdToActivate(user._id);
                                }}
                              >
                                <div className="flex items-center gap-x-2">
                                  <MdKey className="text-lg" />
                                  Activate
                                </div>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))
                )}
              </Table>
            </div>
          </div>
        </div>
      </div>
      <PaginationButton
        fetchUsers={fetchUsers}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalUsers={totalUsers}
        loading={loading}
      />

      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Deactivate user</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to deactivate this user?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="red"
                onClick={() => {
                  setOpen(false);
                  handleDeactivate();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal onClose={() => setOpenModal(false)} show={isOpenModal} size="md">
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Activate user</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-yellow-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to activate this user?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="red"
                onClick={() => {
                  setOpenModal(false);
                  handleActivate();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </NavbarSidebar>
  );
};

const PaginationButton = ({
  fetchUsers,
  currentPage,
  setCurrentPage,
  totalUsers,
  loading,
}) => {
  const usersPerPage = 10;
  const [firstUserIndex, setFirstUserIndex] = useState(0);
  const [lastUserIndex, setLastUserIndex] = useState(0);

  useEffect(() => {
    const calculateUserIndexes = () => {
      const firstIndex = (currentPage - 1) * usersPerPage + 1;
      const lastIndex = Math.min(currentPage * usersPerPage, totalUsers);
      setFirstUserIndex(firstIndex);
      setLastUserIndex(lastIndex);
    };

    calculateUserIndexes();
  }, [currentPage, totalUsers]);

  const totalPages = Math.max(1, Math.ceil(totalUsers / usersPerPage));

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page);
  };
  return (
    <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between mt-6 mb-8 p-4">
      {loading ? (
        <div className="flex flex-col items-center gap-y-6 text-center">
          <PropagateLoader size={5} color="#000000" />
        </div>
      ) : (
        <>
          <div>
            <p className="flex gap-x-1 text-md text-gray-700">
              Showing
              <span className="font-semibold text-black">{firstUserIndex}</span>
              to
              <span className="font-semibold text-black">{lastUserIndex}</span>
              of
              <span className="font-semibold text-black">{totalUsers}</span>
              users
            </p>
          </div>
          <div className="flex justify-center">
            <Pagination
              layout="navigation"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UsersListView;
