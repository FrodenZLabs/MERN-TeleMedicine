/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { HiHome, HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Pagination,
  Table,
  TextInput,
} from "flowbite-react";
import AddDoctorModal from "../components/AddDoctorModal";
import NavbarSidebar from "../components/NavbarSideBar";
import { useEffect, useState } from "react";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";

const DoctorDetailView = () => {
  const [doctors, setDoctors] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const doctorsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);

  useEffect(() => {
    fetchDoctors(currentPage); // Fetch doctors on initial load
  }, [currentPage, searchTerm]);

  const fetchDoctors = async (page = 1) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const searchQuery = searchTerm ? `searchTerm=${searchTerm}` : "";
      const response = await fetch(
        `/mediclinic/doctor/getDoctors?${searchQuery}&page=${page}&limit=${doctorsPerPage}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to fetch doctor data.");
        toast.error(errorData.message || "Failed to fetch doctor data.");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setDoctors(data.doctors);
      setTotalDoctors(data.totalDoctors);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchDoctors(1); // Fetch users with the current search query
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/doctor/getDoctors/${userIdToDelete}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        setErrorMessage("Failed to delete doctor");
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      // Filter out the deleted doctor from the local state
      setDoctors(doctors.filter((doctor) => doctor._id !== userIdToDelete));
      // Fetch the updated list of doctor after deletion
      await fetchDoctors(currentPage);
      setLoading(false);
      toast.success("Doctor deleted successfully");
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <NavbarSidebar isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/doctors-list">Doctors</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Doctors
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form
                onSubmit={handleSubmit}
                className="lg:pr-3 flex flex-col sm:flex-row justify-between"
              >
                <div className="flex flex-col sm:flex-row">
                  <Label htmlFor="users-search" className="sr-only">
                    Search
                  </Label>
                  <div className="relative mt-1 sm:mt-0 lg:w-64 xl:w-96">
                    <TextInput
                      id="users-search"
                      name="users-search"
                      placeholder="Search for doctors"
                      value={searchTerm}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3 bg-green-200 hover:bg-green-300 cursor-pointer rounded-lg">
              <AddDoctorModal onDoctorAdded={fetchDoctors} />
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}
      <div className="flex flex-col m-4">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <Table.Head className="bg-gray-100 dark:bg-gray-700 text-center">
                  <Table.HeadCell>Doctor Name</Table.HeadCell>
                  <Table.HeadCell>Doctor ID Number</Table.HeadCell>
                  <Table.HeadCell>Doctor Number</Table.HeadCell>
                  <Table.HeadCell>Department Name</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                {errorMessage ? (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell
                        colSpan="5"
                        className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                      >
                        {errorMessage}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ) : doctors?.length > 0 ? (
                  doctors.map((doctor) => (
                    <Table.Body
                      key={doctor._id}
                      className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                    >
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                        <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                          <img
                            className="h-16 w-16 object-cover rounded-full"
                            src={doctor?.user_id?.user_profile}
                            alt="Avatar"
                          />
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div className="text-base font-semibold text-gray-900 dark:text-white">
                              {doctor.doctor_firstName} {doctor.doctor_lastName}
                            </div>
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              {doctor?.user_id?.email}
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {doctor.doctor_idNumber}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {doctor.doctor_number}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {doctor?.department_id?.department_name || "N/A"}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex justify-center gap-x-4 whitespace-nowrap">
                            <Button
                              color="failure"
                              onClick={() => {
                                setOpen(true);
                                setUserIdToDelete(doctor._id);
                              }}
                            >
                              <div className="flex items-center gap-x-2">
                                <HiTrash className="text-lg" />
                                Delete
                              </div>
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))
                ) : (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell
                        colSpan="5"
                        className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                      >
                        No doctor data found
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )}
              </Table>
            </div>
          </div>
        </div>
      </div>
      <PaginationButton
        fetchDoctors={fetchDoctors}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalDoctors={totalDoctors}
        loading={loading}
      />
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete user</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this user?
            </p>
            <div className="flex items-center gap-x-6">
              <Button
                color="failure"
                onClick={() => {
                  setOpen(false);
                  handleDelete();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </NavbarSidebar>
  );
};

const PaginationButton = ({
  fetchDoctors,
  currentPage,
  setCurrentPage,
  totalDoctors,
  loading,
}) => {
  const usersPerPage = 10;
  const [firstDoctorIndex, setFirstUserIndex] = useState(0);
  const [lastDoctorIndex, setLastUserIndex] = useState(0);

  useEffect(() => {
    const calculateUserIndexes = () => {
      const firstIndex = (currentPage - 1) * usersPerPage + 1;
      const lastIndex = Math.min(currentPage * usersPerPage, totalDoctors);
      setFirstUserIndex(firstIndex);
      setLastUserIndex(lastIndex);
    };

    calculateUserIndexes();
  }, [currentPage, totalDoctors]);

  const totalPages = Math.ceil(totalDoctors / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDoctors(page);
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
              <span className="font-semibold text-black">
                {firstDoctorIndex}
              </span>
              to
              <span className="font-semibold text-black">
                {lastDoctorIndex}
              </span>
              of
              <span className="font-semibold text-black">{totalDoctors}</span>
              doctors
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

export default DoctorDetailView;
