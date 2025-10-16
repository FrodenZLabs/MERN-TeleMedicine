import { HiHome } from "react-icons/hi";
import {
  Breadcrumb,
  BreadcrumbItem,
  Label,
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
import { useSelector } from "react-redux";
import NavbarSidebar from "../layout/NavbarSideBar";
import { getAppointmentsByDoctorID } from "../../services/appointmentsService";

const DoctorPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.authentication);
  const doctorID = currentUser.doctor_id;
  const patientsPerPage = 5;
  const [totalPatients, setTotalPatients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPatients = async (page) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await getAppointmentsByDoctorID(
        doctorID,
        page,
        patientsPerPage
      );
      setPatients(response.appointments);
      setTotalPatients(response.totalAppointments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchPatients(currentPage);
  }, [currentPage]);

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
            <div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for users"
                  />
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
                    <TableHeadCell>Patient's Name</TableHeadCell>
                    <TableHeadCell>Contact Number</TableHeadCell>
                    <TableHeadCell>Email Address</TableHeadCell>
                    <TableHeadCell>Appointment Type</TableHeadCell>
                    <TableHeadCell>Appointment Status</TableHeadCell>
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
                ) : patients?.length > 0 ? (
                  patients.map((patient) => (
                    <TableBody
                      key={patient._id}
                      className="divide-y divide-gray-200 bg-white"
                    >
                      <TableRow className="hover:bg-gray-100 text-center">
                        <TableCell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900">
                          {patient.patient_id.patient_firstName}{" "}
                          {patient.patient_id.patient_lastName}
                        </TableCell>
                        <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                          {patient.patient_id.contact_number}
                        </TableCell>
                        <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                          {patient.patient_id.user_id.email}
                        </TableCell>
                        <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                          {patient.appointment_type}
                        </TableCell>
                        <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                          {patient.appointment_status}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan="5"
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
      {patients?.length > 0 && (
        <PaginationButton
          fetchPatients={fetchPatients}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPatients={totalPatients}
          loading={loading}
        />
      )}
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
  const patientsPerPage = 5;
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

export default DoctorPatientList;
