/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from "flowbite-react";
import { FaCalendar, FaEye } from "react-icons/fa";
import { FaUserInjured, FaVideo } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoDocumentSharp } from "react-icons/io5";
import { setGlobalLoading } from "../redux/reducers/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";

const PatientsDashboardGrid = () => {
  const { currentUser, globalLoading } = useSelector(
    (state) => state.authentication
  );
  const dispatch = useDispatch();
  const patientId = currentUser?.patient_id;
  const [errorMessage, setErrorMessage] = useState(false);
  const [patient, setPatient] = useState([]);
  const [scheduledAppointment, setScheduledAppointment] = useState([]);
  const [pendingAppointment, setPendingAppointment] = useState([]);
  const [videoConsultations, setVideoConsultations] = useState(0);

  const fetchPatients = async (patientId) => {
    try {
      const response = await fetch(
        `/mediclinic/patient/getPatients/${patientId}`
      );
      const data = await response.json();
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch patients data.");
        return;
      }
      setPatient(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      setErrorMessage(null);
      const response = await fetch(
        `/mediclinic/appointment/getAppointments/patient/${patientId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Failed to fetch departments data."
        );
        return;
      }
      const data = await response.json();
      setScheduledAppointment(data.scheduledAppointment);
      setPendingAppointment(data.pendingAppointment);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchVideoConsultations = async () => {
    try {
      const response = await fetch(
        `/mediclinic/video/getVideoConsultations/patient/${patientId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message);
        return;
      }
      const data = await response.json();
      setVideoConsultations(data.totalVideoConsultations);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async (patientId) => {
      dispatch(setGlobalLoading(true));
      await fetchPatients(patientId);
      await fetchAppointments(patientId);
      await fetchVideoConsultations(patientId);
      dispatch(setGlobalLoading(false));
    };
    fetchData(patientId);
  }, [dispatch, patientId]);

  return (
    <div>
      {globalLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <RingLoader color="#FFFF00" size={150} />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <h6 className="text-2xl font-bold tracking-tight flex gap-4 text-gray-900 dark:text-white">
            <FaUserInjured />
            Patient Profile
          </h6>
          <div className="flex flex-col">
            <div className="font-normal text-gray-700 dark:text-gray-400">
              Patient Name:{" "}
              <span className="font-semibold ml-2">
                {patient.patient_firstName} {patient.patient_lastName}
              </span>
            </div>
            <div className="font-normal text-gray-700 dark:text-gray-400">
              Address:{" "}
              <span className="font-semibold ml-2">{patient.address}</span>
            </div>
            <div className="font-normal text-gray-700 dark:text-gray-400">
              Contact Number:{" "}
              <span className="font-semibold ml-2">
                {patient.contact_number}
              </span>
            </div>
            <div className="font-normal text-gray-700 dark:text-gray-400">
              ID Number:{" "}
              <span className="font-semibold ml-2">
                {patient.patient_idNumber}
              </span>
            </div>
            <div className="font-normal text-gray-700 dark:text-gray-400">
              Gender:{" "}
              <span className="font-semibold ml-2">
                {patient.patient_gender}
              </span>
            </div>
          </div>
          <Link to={"/user-profile"}>
            <div className="flex gap-4 items-center font-semibold text-blue-500 hover:text-blue-700">
              <FaEye />
              View Details
            </div>
          </Link>
        </Card>

        <Card>
          <h6 className="text-2xl font-bold tracking-tight flex gap-4 text-gray-900 dark:text-white">
            <FaCalendar />
            Consultaions
          </h6>

          {errorMessage ? (
            <div className="text-gray-700 dark:text-gray-400">
              No consultations available.
            </div>
          ) : scheduledAppointment ? (
            <div className="flex flex-col">
              <div className="font-normal text-gray-700 dark:text-gray-400">
                Date:{" "}
                <span className="font-semibold ml-2">
                  {new Date(
                    scheduledAppointment?.appointment_date
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="font-normal text-gray-700 dark:text-gray-400">
                Time:{" "}
                <span className="font-semibold ml-2">
                  {scheduledAppointment?.appointment_time}
                </span>
              </div>
              <div className="font-normal text-gray-700 dark:text-gray-400">
                Type:{" "}
                <span className="font-semibold ml-2">
                  {scheduledAppointment?.appointment_type}
                </span>
              </div>
              <div className="font-normal text-gray-700 dark:text-gray-400">
                Department:{" "}
                <span className="font-semibold ml-2">
                  {scheduledAppointment?.department_id?.department_name}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-700 dark:text-gray-400">
              No appointment data found
            </div>
          )}
          <Link to={"/appointment-list"}>
            <div className="flex gap-4 items-center font-semibold text-blue-500 hover:text-blue-800">
              <FaEye />
              Show all
            </div>
          </Link>
        </Card>

        <Card>
          <h6 className="text-2xl font-bold tracking-tight flex gap-4 text-gray-900 dark:text-white">
            <IoDocumentSharp />
            Appointment Requests
          </h6>

          {errorMessage ? (
            <div className="text-gray-700 dark:text-gray-400">
              No pending appointments available.
            </div>
          ) : pendingAppointment ? (
            <div className="flex flex-col">
              <div className="font-normal text-gray-700 dark:text-gray-400">
                Date:{" "}
                <span className="font-semibold ml-2">
                  {new Date(
                    pendingAppointment?.appointment_date
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="font-normal text-gray-700 dark:text-gray-400">
                Time:{" "}
                <span className="font-semibold ml-2">
                  {pendingAppointment?.appointment_time}
                </span>
              </div>
              <div className="font-normal text-gray-700 dark:text-gray-400">
                Type:{" "}
                <span className="font-semibold ml-2">
                  {pendingAppointment?.appointment_type}
                </span>
              </div>
              <div className="font-normal text-gray-700 dark:text-gray-400">
                Department:{" "}
                <span className="font-semibold ml-2">
                  {pendingAppointment?.department_id?.department_name}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-700 dark:text-gray-400">
              No pending appointments available.
            </div>
          )}
          <Link to={"/appointment-list"}>
            <div className="flex gap-4 items-center font-semibold text-blue-500 hover:text-blue-800">
              <FaEye />
              Show all
            </div>
          </Link>
        </Card>

        <Card>
          <h6 className="text-2xl font-bold tracking-tight flex gap-4 text-gray-900 dark:text-white">
            <FaVideo />
            Video Consultation
          </h6>
          <div className="flex flex-col">
            <div className="font-normal text-gray-700 dark:text-gray-400">
              {videoConsultations}
            </div>
          </div>
          <Link to={"/video-consultation"}>
            <div className="flex gap-4 items-center font-semibold text-blue-500 hover:text-blue-800">
              <FaEye />
              View Details
            </div>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default PatientsDashboardGrid;
