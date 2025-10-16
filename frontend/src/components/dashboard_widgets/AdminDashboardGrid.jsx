import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RingLoader } from "react-spinners";
import { setGlobalLoading } from "../../redux/reducers/authenticationSlice";
import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import { getPayments } from "../../services/paymentService";
import { getVideoConsultations } from "../../services/videoConsultationsService";
import { getAppointments } from "../../services/appointmentsService";

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
      const response = await getPatients({});

      setTotalPatients(response.totalPatients);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await getDoctors({});

      setTotalDoctors(response.totalDoctors);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await getPayments({});
      setTotalPayments(response.totalPayments);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchVideoConsultations = async () => {
    try {
      const response = await getVideoConsultations({});
      setTotalVideoConsultations(response.totalVideoConsultations);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments({});
      setTotalConfirmedAppointments(response.totalConfirmedAppointments);
      setTotalPendingAppointments(response.totalPendingAppointments);
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
        <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
          <RingLoader color="#FFFF00" size={150} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card href="/patients-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900">
            Total Patients
          </h5>
          <div className="flex items-center">
            <p className="font-normal text-gray-700 ">{totalPatients}</p>
          </div>
        </Card>
        <Card href="" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900">
            Pending Appointment Requests
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700">
              {totalPendingAppointments}
            </p>
          </div>
        </Card>
        <Card href="#" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900">
            Confirmed Appointments
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700">
              {totalConfirmedAppointments}
            </p>
          </div>
        </Card>
        <Card href="/doctors-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900">
            Total Doctors
          </h5>
          <div className="flex items-center">
            <p className="font-normal text-gray-700">{totalDoctors}</p>
          </div>
        </Card>
        <Card href="/payments-list" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900">
            Total Payments
          </h5>
          <div className="flex">
            <p className="font-normal text-gray-700">{totalPayments}</p>
          </div>
        </Card>
        <Card href="/video-consultation" className="">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900">
            Total Video Consultation
          </h5>
          <div className="flex items-center">
            <p className="font-normal text-gray-700">
              {totalVideoConsultations}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardGrid;
