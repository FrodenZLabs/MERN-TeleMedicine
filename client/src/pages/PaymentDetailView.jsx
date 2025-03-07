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
import { useSelector } from "react-redux";
import moment from "moment";

const PaymentDetailView = () => {
  const [payments, setPayments] = useState([]);
  const [paymentsPatients, setPaymentsPatients] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.authentication);
  const patientId = currentUser.patient_id;
  const paymentsPerPage = 5;
  const [totalPayments, setTotalPayments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPayments = async (page) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      let url = "";
      if (currentUser?.role === "admin") {
        url = `/mediclinic/payment/getAllPayments?page=${page}&limit=${paymentsPerPage}`;
      } else if (currentUser?.role === "patient") {
        url = `/mediclinic/payment/getPaymentByPatientID/patient/${patientId}?page=${page}&limit=${paymentsPerPage}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to fetch payments data.");
        toast.error(errorData.message || "Failed to fetch payments data.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (currentUser?.role === "admin") {
        setPayments(data.payments);
      } else if (currentUser?.role === "patient") {
        setPaymentsPatients(data.payments);
      }
      setTotalPayments(data.totalPayments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage);
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
              <Link to={"/payments-list"}>
                <Breadcrumb.Item>Payments</Breadcrumb.Item>
              </Link>

              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Payments
            </h1>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <ScaleLoader color="#36d7b7" />
        </div>
      )}

      {currentUser?.role === "admin" && (
        <div className="flex flex-col m-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <Table.Head className="bg-gray-100 dark:bg-gray-700 text-center">
                    <Table.HeadCell>Payment Date</Table.HeadCell>
                    <Table.HeadCell>Appointment Type</Table.HeadCell>
                    <Table.HeadCell>Appointment Status</Table.HeadCell>
                    <Table.HeadCell>Payment Amount</Table.HeadCell>
                    <Table.HeadCell>Payment Status</Table.HeadCell>
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
                  ) : payments?.length > 0 ? (
                    payments.map((payment) => (
                      <Table.Body
                        key={payment?._id}
                        className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                      >
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.payment_date
                              ? moment(payment.payment_date).format("LL")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.appointment_id?.appointment_type
                              ? payment.appointment_id.appointment_type
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.appointment_id?.appointment_status
                              ? payment.appointment_id.appointment_status
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            Kshs.
                            {payment?.payment_amount
                              ? payment.payment_amount
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.payment_status
                              ? payment.payment_status
                              : "N/A"}
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
                          No payments data found
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
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
              <div className="overflow-hidden shadow">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <Table.Head className="bg-gray-100 dark:bg-gray-700 text-center">
                    <Table.HeadCell>Payment Date</Table.HeadCell>
                    <Table.HeadCell>Appointment Type</Table.HeadCell>
                    <Table.HeadCell>Appointment Status</Table.HeadCell>
                    <Table.HeadCell>Payment Amount</Table.HeadCell>
                    <Table.HeadCell>Payment Status</Table.HeadCell>
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
                  ) : paymentsPatients?.length > 0 ? (
                    paymentsPatients.map((payment) => (
                      <Table.Body
                        key={payment._id}
                        className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                      >
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.payment_date
                              ? moment(payment.payment_date).format("LL")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.appointment_id?.appointment_type
                              ? payment.appointment_id.appointment_type
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.appointment_id?.appointment_status
                              ? payment.appointment_id.appointment_status
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            Kshs.{" "}
                            {payment?.payment_amount
                              ? payment.payment_amount
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {payment?.payment_status
                              ? payment.payment_status
                              : "N/A"}
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
                          No payments data found
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
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
  const paymentsPerPage = 5;
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

  const totalPages = Math.ceil(totalPayments / paymentsPerPage);

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
