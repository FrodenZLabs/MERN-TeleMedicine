/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { HiHome } from "react-icons/hi";
import { Breadcrumb, Pagination, Table } from "flowbite-react";
import NavbarSidebar from "../components/NavbarSideBar";
import { useEffect, useState } from "react";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";

const PrescriptionDetailView = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const prescriptionsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);

  const fetchPrescriptions = async (page) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/prescription/getAllPrescriptions?page=${page}&limit=${prescriptionsPerPage}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Failed to fetch prescription data."
        );
        toast.error(errorData.message || "Failed to fetch prescription data.");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setPrescriptions(data.prescriptions);
      setTotalPrescriptions(data.totalPrescriptions);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchPrescriptions(currentPage);
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
              <Link to={"/prescription-list"}>
                <Breadcrumb.Item>Prescription</Breadcrumb.Item>
              </Link>

              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Prescriptions
            </h1>
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
                  <Table.HeadCell>Patient Name</Table.HeadCell>
                  <Table.HeadCell>Prescription Date</Table.HeadCell>
                  <Table.HeadCell>Prescription Details</Table.HeadCell>
                  <Table.HeadCell>Doctor Name</Table.HeadCell>
                  <Table.HeadCell>Appointment Date</Table.HeadCell>
                  <Table.HeadCell>Appointment Time</Table.HeadCell>
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
                ) : prescriptions.length > 0 ? (
                  prescriptions?.map((prescription) => (
                    <Table.Body
                      key={prescription?._id}
                      className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                    >
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.patient_id?.patient_firstName || "N/A"}{" "}
                          {prescription?.patient_id?.patient_lastName || "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.prescription_date
                            ? moment(prescription.prescription_date).format(
                                "LL"
                              )
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-pre-line p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.prescription_details || "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.doctor_id?.doctor_firstName || "N/A"}{" "}
                          {prescription?.doctor_id?.doctor_lastName || "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-pre-wrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.appointment_id?.appointment_date
                            ? moment(
                                prescription.appointment_id.appointment_date
                              ).format("LL")
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.appointment_id?.appointment_time
                            ? moment(
                                prescription.appointment_id.appointment_time,
                                "h:mm A"
                              ).format("LT")
                            : "N/A"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                          {prescription?.appointment_id?.appointment_status ||
                            "N/A"}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))
                ) : (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell
                        colSpan="7"
                        className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                      >
                        No prescription data found
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
        fetchPrescriptions={fetchPrescriptions}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPrescriptions={totalPrescriptions}
        loading={loading}
      />
    </NavbarSidebar>
  );
};

const PaginationButton = ({
  fetchPrescriptions,
  currentPage,
  setCurrentPage,
  totalPrescriptions,
  loading,
}) => {
  const prescriptionsPerPage = 10;
  const [firstPrescriptionIndex, setFirstPrescriptionIndex] = useState(0);
  const [lastPrescriptionIndex, setLastPrescriptionIndex] = useState(0);

  useEffect(() => {
    const calculateUserIndexes = () => {
      const firstIndex = (currentPage - 1) * prescriptionsPerPage + 1;
      const lastIndex = Math.min(
        currentPage * prescriptionsPerPage,
        totalPrescriptions
      );
      setFirstPrescriptionIndex(firstIndex);
      setLastPrescriptionIndex(lastIndex);
    };

    calculateUserIndexes();
  }, [currentPage, totalPrescriptions]);

  const totalPages = Math.ceil(totalPrescriptions / prescriptionsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPrescriptions(page);
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
                {firstPrescriptionIndex}
              </span>
              to
              <span className="font-semibold text-black">
                {lastPrescriptionIndex}
              </span>
              of
              <span className="font-semibold text-black">
                {totalPrescriptions}
              </span>
              prescriptions
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

export default PrescriptionDetailView;
