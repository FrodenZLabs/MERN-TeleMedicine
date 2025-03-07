/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { HiHome } from "react-icons/hi";
import {
  Breadcrumb,
  Label,
  Pagination,
  Table,
  TextInput,
} from "flowbite-react";
import NavbarSidebar from "../components/NavbarSideBar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { useSelector } from "react-redux";

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
      const response = await fetch(
        `/mediclinic/appointment/getAppointments/doctor/${doctorID}?page=${page}&limit=${patientsPerPage}`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch patient data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setPatients(data.appointments);
      setTotalPatients(data.totalAppointments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchPatients(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
              <Breadcrumb.Item href="/patients-list">Patients</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Patients
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
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
                  <Table.HeadCell>Patient's Name</Table.HeadCell>
                  <Table.HeadCell>Contact Number</Table.HeadCell>
                  <Table.HeadCell>Email Address</Table.HeadCell>
                  <Table.HeadCell>Appointment Type</Table.HeadCell>
                  <Table.HeadCell>Appointment Status</Table.HeadCell>
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
                ) : patients?.length > 0 ? (
                  patients.map((patient) => (
                    <Table.Body
                      key={patient._id}
                      className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                    >
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                        <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900 dark:text-white">
                          {patient.patient_id.patient_firstName}{" "}
                          {patient.patient_id.patient_lastName}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {patient.patient_id.contact_number}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {patient.patient_id.user_id.email}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {patient.appointment_type}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {patient.appointment_status}
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
                        No patient data found
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
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

  const totalPages = Math.ceil(totalPatients / patientsPerPage);

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
