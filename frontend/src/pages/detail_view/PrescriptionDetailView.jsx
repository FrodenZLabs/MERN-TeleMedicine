import { HiHome } from "react-icons/hi";
import {
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import NavbarSidebar from "../../components/layout/NavbarSideBar";
import { useEffect, useState } from "react";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import { getPrescriptions } from "../../services/prescriptionService";

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
      const response = await getPrescriptions({
        page,
        limit: prescriptionsPerPage,
      });

      setPrescriptions(response.prescriptions);
      setTotalPrescriptions(response.totalPrescriptions);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions(currentPage);
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
              <Link to={"/prescription-list"}>
                <BreadcrumbItem>Prescription</BreadcrumbItem>
              </Link>

              <BreadcrumbItem>List</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Prescriptions
            </h1>
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
                    <TableHeadCell>Prescription Date</TableHeadCell>
                    <TableHeadCell>Prescription Details</TableHeadCell>
                    <TableHeadCell>Doctor Name</TableHeadCell>
                    <TableHeadCell>Appointment Date</TableHeadCell>
                    <TableHeadCell>Appointment Time</TableHeadCell>
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
                ) : prescriptions.length > 0 ? (
                  prescriptions?.map((prescription) => (
                    <TableBody
                      key={prescription?._id}
                      className="divide-y divide-gray-200 bg-white"
                    >
                      <TableRow className="hover:bg-gray-100 text-center">
                        <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                          {prescription?.patient_id?.patient_firstName || "N/A"}{" "}
                          {prescription?.patient_id?.patient_lastName || "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                          {prescription?.prescription_date
                            ? moment(prescription.prescription_date).format(
                                "LL"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-pre-line p-4 text-base font-medium text-gray-900">
                          {prescription?.prescription_details || "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                          {prescription?.doctor_id?.doctor_firstName || "N/A"}{" "}
                          {prescription?.doctor_id?.doctor_lastName || "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-pre-wrap  p-4 text-base font-medium text-gray-900">
                          {prescription?.appointment_id?.appointment_date
                            ? moment(
                                prescription.appointment_id.appointment_date
                              ).format("LL")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                          {prescription?.appointment_id?.appointment_time
                            ? moment(
                                prescription.appointment_id.appointment_time,
                                "h:mm A"
                              ).format("LT")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                          {prescription?.appointment_id?.appointment_status ||
                            "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan="7"
                        className="whitespace-nowrap p-4 text-base font-medium text-gray-900 text-center"
                      >
                        No prescription data found
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

  const totalPages = Math.max(
    1,
    Math.ceil(totalPrescriptions / prescriptionsPerPage)
  );

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
