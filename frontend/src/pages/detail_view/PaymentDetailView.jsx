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
import { useEffect, useState } from "react";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import NavbarSidebar from "../../components/layout/NavbarSideBar";
import {
  getPayments,
  getPaymentsByPatientID,
} from "../../services/paymentService";

const PaymentDetailView = () => {
  const [payments, setPayments] = useState([]);
  const [paymentsPatients, setPaymentsPatients] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.authentication);
  const patientId = currentUser.patient_id;
  const paymentsPerPage = 10;
  const [totalPayments, setTotalPayments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPayments = async (page) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      let response;
      if (currentUser?.role === "admin") {
        response = await getPayments(page, paymentsPerPage);
      } else if (currentUser?.role === "patient") {
        response = await getPaymentsByPatientID(
          patientId,
          page,
          paymentsPerPage
        );
      }

      if (response.success === false) {
        setErrorMessage(response.message || "Failed to fetch payments data.");
        toast.error(response.message || "Failed to fetch payments data.");
        setLoading(false);
        return;
      }

      if (currentUser?.role === "admin") {
        setPayments(response.payments);
      } else if (currentUser?.role === "patient") {
        setPaymentsPatients(response.payments);
      }
      setTotalPayments(response.totalPayments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage);
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
                  <span className="dark:text-white">Home</span>
                </div>
              </BreadcrumbItem>
              <Link to={"/payments-list"}>
                <BreadcrumbItem>Payments</BreadcrumbItem>
              </Link>

              <BreadcrumbItem>List</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Payments
            </h1>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}

      {currentUser?.role === "admin" && (
        <div className="flex flex-col m-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm">
                <Table className="min-w-full divide-y divide-gray-200">
                  <TableHead className="bg-gray-100 text-center">
                    <TableRow>
                      <TableHeadCell>Payment Date</TableHeadCell>
                      <TableHeadCell>Appointment Type</TableHeadCell>
                      <TableHeadCell>Appointment Status</TableHeadCell>
                      <TableHeadCell>Payment Amount</TableHeadCell>
                      <TableHeadCell>Payment Status</TableHeadCell>
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
                  ) : payments?.length > 0 ? (
                    payments.map((payment) => (
                      <TableBody
                        key={payment?._id}
                        className="divide-y divide-gray-200 bg-white"
                      >
                        <TableRow className="hover:bg-gray-100 text-center">
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {payment?.payment_date
                              ? moment(payment.payment_date).format("LL")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                            {payment?.appointment_id?.appointment_type
                              ? payment.appointment_id.appointment_type
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {payment?.appointment_id?.appointment_status
                              ? payment.appointment_id.appointment_status
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            Kshs.
                            {payment?.payment_amount
                              ? payment.payment_amount
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {payment?.payment_status
                              ? payment.payment_status
                              : "N/A"}
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
                          No payments data found
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentUser?.role === "patient" && (
        <div className="flex flex-col m-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm">
                <Table className="min-w-full divide-y divide-gray-200">
                  <TableHead className="bg-gray-100 text-center">
                    <TableRow>
                      <TableHeadCell>Payment Date</TableHeadCell>
                      <TableHeadCell>Appointment Type</TableHeadCell>
                      <TableHeadCell>Appointment Status</TableHeadCell>
                      <TableHeadCell>Payment Amount</TableHeadCell>
                      <TableHeadCell>Payment Status</TableHeadCell>
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
                  ) : paymentsPatients?.length > 0 ? (
                    paymentsPatients.map((payment) => (
                      <TableBody
                        key={payment._id}
                        className="divide-y divide-gray-200 bg-white"
                      >
                        <TableRow className="hover:bg-gray-100 text-center">
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {payment?.payment_date
                              ? moment(payment.payment_date).format("LL")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                            {payment?.appointment_id?.appointment_type
                              ? payment.appointment_id.appointment_type
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {payment?.appointment_id?.appointment_status
                              ? payment.appointment_id.appointment_status
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            Kshs.{" "}
                            {payment?.payment_amount
                              ? payment.payment_amount
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {payment?.payment_status
                              ? payment.payment_status
                              : "N/A"}
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
                          No payments data found
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
      {((currentUser?.role === "admin" && payments.length > 0) ||
        (currentUser?.role === "patient" && paymentsPatients.length > 0)) && (
        <PaginationButton
          fetchPayments={fetchPayments}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPayments={totalPayments}
          loading={loading}
        />
      )}
    </NavbarSidebar>
  );
};

const PaginationButton = ({
  fetchPayments,
  currentPage,
  setCurrentPage,
  totalPayments,
  loading,
}) => {
  const paymentsPerPage = 10;
  const [firstPaymentIndex, setFirstPaymentIndex] = useState(0);
  const [lastPaymentIndex, setLastPaymentIndex] = useState(0);

  useEffect(() => {
    const calculateUserIndexes = () => {
      const firstIndex = (currentPage - 1) * paymentsPerPage + 1;
      const lastIndex = Math.min(currentPage * paymentsPerPage, totalPayments);
      setFirstPaymentIndex(firstIndex);
      setLastPaymentIndex(lastIndex);
    };

    calculateUserIndexes();
  }, [currentPage, totalPayments]);

  const totalPages = Math.max(1, Math.ceil(totalPayments / paymentsPerPage));

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPayments(page);
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
                {firstPaymentIndex}
              </span>
              to
              <span className="font-semibold text-black">
                {lastPaymentIndex}
              </span>
              of
              <span className="font-semibold text-black">{totalPayments}</span>
              payments
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

export default PaymentDetailView;
