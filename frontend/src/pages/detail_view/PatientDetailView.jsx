import { HiHome, HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import {
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
import NavbarSidebar from "../../components/layout/NavbarSideBar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import AddPatientModal from "../../components/modals/AddPatientModal";
import { deletePatient, getPatients } from "../../services/patientService";

const PatientDetailView = () => {
  const [patients, setPatients] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const patientsPerPage = 10;
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    patient_gender: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const urlParams = new URLSearchParams(location.search);

  useEffect(() => {
    const searchTermFromUrl = urlParams.get("searchTerm");
    const genderFromUrl = urlParams.get("role");

    if (searchTermFromUrl || genderFromUrl) {
      setSearchData({
        searchTerm: searchTermFromUrl || "",
        patient_gender: genderFromUrl || "All",
      });
    }

    fetchPatients(currentPage); // Fetch users on initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchData]);

  const fetchPatients = async (page = 1) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await getPatients({
        searchData,
        page,
        limit: patientsPerPage,
      });

      if (response.success === false) {
        toast.error(response.message);
        setErrorMessage(response.message);
      }

      setPatients(response.patients);
      setTotalPatients(response.totalPatients);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error);
    }
  };

  const handleChange = (e) => {
    if (
      e.target.id === "All" ||
      e.target.id === "Male" ||
      e.target.id === "Female" ||
      e.target.id === "Other"
    ) {
      setSearchData({ ...searchData, patient_gender: e.target.id });
    }

    if (e.target.id === "users-search") {
      setSearchData({ ...searchData, searchTerm: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchPatients(1); // Fetch users with the current search query
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await deletePatient(userIdToDelete);

      // Filter out the deleted patient from the local state
      setPatients(patients.filter((patient) => patient._id !== userIdToDelete));
      // Fetch the updated list of patients after deletion
      await fetchPatients(currentPage);
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
              <BreadcrumbItem href="/patients-list">Patients</BreadcrumbItem>
              <BreadcrumbItem>List</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Patients
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
                      placeholder="Search for patients"
                      value={searchData.searchTerm}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center mt-2 sm:mt-0 sm:ml-6">
                  <Label className="font-semibold">Gender:</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="All"
                      onChange={handleChange}
                      checked={searchData.patient_gender === "All"}
                    />
                    <span>All Genders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="Male"
                      onChange={handleChange}
                      checked={searchData.patient_gender === "Male"}
                    />
                    <span>Male</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="Female"
                      onChange={handleChange}
                      checked={searchData.patient_gender === "Female"}
                    />
                    <span>Female</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="Other"
                      onChange={handleChange}
                      checked={searchData.patient_gender === "Other"}
                    />
                    <span>Other</span>
                  </div>
                </div>
              </form>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3 bg-green-200 hover:bg-green-300 cursor-pointer rounded-lg">
              <AddPatientModal onPatientAdded={fetchPatients} />
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
                    <TableHeadCell>Patient Name</TableHeadCell>
                    <TableHeadCell>Patient Age</TableHeadCell>
                    <TableHeadCell>Patient Gender</TableHeadCell>
                    <TableHeadCell>Contact Number</TableHeadCell>
                    <TableHeadCell>Address</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                  </TableRow>
                </TableHead>
                {errorMessage ? (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan="5"
                        className="whitespace-nowrap text-center p-4 text-lg font-medium bg-red-200 text-red-500"
                      >
                        {errorMessage}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : patients.length > 0 ? (
                  patients.map((patient) => (
                    <TableBody
                      key={patient._id}
                      className="divide-y divide-gray-200 bg-white"
                    >
                      <TableRow className="hover:bg-gray-100 text-start">
                        <TableCell className="mr-12 flex items-start space-x-6 whitespace-nowrap p-4 lg:mr-0">
                          <img
                            className="h-16 w-16 object-cover rounded-full"
                            src={patient?.user_id?.user_profile}
                            alt="Avatar"
                          />
                          <div className="text-sm font-normal text-gray-500">
                            <div className="text-base font-semibold text-gray-900">
                              {patient.patient_firstName}{" "}
                              {patient.patient_lastName}
                            </div>
                            <div className="text-sm font-normal text-gray-500">
                              {patient?.user_id?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                          {patient.age}
                        </TableCell>
                        <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                          {patient.patient_gender}
                        </TableCell>
                        <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                          {patient.contact_number}
                        </TableCell>
                        <TableCell className="max-w-52 truncate overflow-hidden text-ellipsis whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                          {patient.address}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-x-3 whitespace-nowrap">
                            <Button
                              color="red"
                              onClick={() => {
                                setOpen(true);
                                setUserIdToDelete(patient._id);
                              }}
                            >
                              <div className="flex items-center gap-x-2">
                                <HiTrash className="text-lg" />
                                Delete
                              </div>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan="6"
                        className="whitespace-nowrap p-4 text-base font-medium text-gray-900 text-center"
                      >
                        No patient data found
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </div>
          </div>
        </div>
      </div>
      <PaginationButton
        fetchPatients={fetchPatients}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPatients={totalPatients}
        loading={loading}
      />
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete user</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this patient?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="red"
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
        </ModalBody>
      </Modal>
    </NavbarSidebar>
  );
};

const PaginationButton = ({
  fetchPatients,
  currentPage,
  setCurrentPage,
  totalPatients,
  loading,
}) => {
  const patientsPerPage = 10;
  const [firstPatientIndex, setFirstPatientIndex] = useState(0);
  const [lastPatientIndex, setLastPatientIndex] = useState(0);

  useEffect(() => {
    const calculateUserIndexes = () => {
      const firstIndex = (currentPage - 1) * patientsPerPage + 1;
      const lastIndex = Math.min(currentPage * patientsPerPage, totalPatients);
      setFirstPatientIndex(firstIndex);
      setLastPatientIndex(lastIndex);
    };

    calculateUserIndexes();
  }, [currentPage, totalPatients]);

  const totalPages = Math.max(1, Math.ceil(totalPatients / patientsPerPage));

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPatients(page);
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
                {firstPatientIndex}
              </span>
              to
              <span className="font-semibold text-black">
                {lastPatientIndex}
              </span>
              of
              <span className="font-semibold text-black">{totalPatients}</span>
              patients
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

export default PatientDetailView;
