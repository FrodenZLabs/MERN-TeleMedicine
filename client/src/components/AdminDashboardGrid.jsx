import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoading } from "../redux/reducers/authenticationSlice";
import { RingLoader } from "react-spinners";

const AdminDashboardGrid = () => {
  const { globalLoading } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalVideoConsultations, setTotalVideoConsultations] = useState(0);
  const [totalPendingAppointments, setTotalPendingAppointments] = useState(0);
  const [totalConfirmedAppointments, setTotalConfirmedAppointments] =
    useState(0);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/mediclinic/patient/getPatients");
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch patients data.");
        return;
      }
      const data = await response.json();
      setTotalPatients(data.totalPatients);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/mediclinic/doctor/getDoctors");
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch doctors data.");
        return;
      }
      const data = await response.json();
      setTotalDoctors(data.totalDoctors);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch("/mediclinic/payment/getAllPayments");
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch payments data");
        return;
      }
      const data = await response.json();
      setTotalPayments(data.totalPayments);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchVideoConsultations = async () => {
    try {
      const response = await fetch("/mediclinic/video/getVideoConsultations");
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Failed to fetch video consultation data"
        );
        return;
      }
      const data = await response.json();
      setTotalVideoConsultations(data.totalVideoConsultations);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/mediclinic/appointment/getAppointments");
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch appointments data.");
        return;
      }
      const data = await response.json();
      setTotalConfirmedAppointments(data.totalConfirmedAppointments);
      setTotalPendingAppointments(data.totalPendingAppointments);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setGlobalLoading(true));
      await fetchPatients();
      await fetchDoctors();
      await fetchVideoConsultations();
      await fetchAppointments();
      await fetchPayments();
      dispatch(setGlobalLoading(false));
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="">
      {/* Loader overlay */}
      {globalLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <RingLoader color="#FFFF00" size={150} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card href="/patients-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Patients
          </h5>
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalPatients}
            </p>
          </div>
        </Card>
        <Card href="" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Pending Appointment Requests
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalPendingAppointments}
            </p>
          </div>
        </Card>
        <Card href="#" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Confirmed Appointments
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalConfirmedAppointments}
            </p>
          </div>
        </Card>
        <Card href="/doctors-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Doctors
          </h5>
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalDoctors}
            </p>
          </div>
        </Card>
        <Card href="/payments-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Payments
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalPayments}
            </p>
          </div>
        </Card>
        <Card href="/video-consultation" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Video Consultation
          </h5>
          <div className="flex items-center">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {totalVideoConsultations}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardGrid;
