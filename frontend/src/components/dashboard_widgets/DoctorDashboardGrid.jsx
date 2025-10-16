/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from "flowbite-react";
import { FaCalendar, FaEye } from "react-icons/fa";
import { FaUserInjured, FaVideo } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoDocumentSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setGlobalLoading } from "../../redux/reducers/authenticationSlice";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import { getDoctorsByID } from "../../services/doctorService";
import { getAppointmentsByDoctorID } from "../../services/appointmentsService";
import { getVideoConsultationsByDoctorID } from "../../services/videoConsultationsService";

const DoctorDashboardGrid = () => {
  const { currentUser, globalLoading } = useSelector(
    (state) => state.authentication
  );
  const dispatch = useDispatch();
  const doctorId = currentUser?.doctor_id;
  const [errorMessage, setErrorMessage] = useState(null);
  const [doctor, setDoctor] = useState([]);
  const [scheduledAppointment, setScheduledAppointment] = useState([]);
  const [completeAppointment, setCompleteAppointment] = useState([]);
  const [videoConsultations, setVideoConsultations] = useState(0);

  const fetchDoctor = async (doctorId) => {
    try {
      const response = await getDoctorsByID(doctorId);

      setDoctor(response);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAppointments = async (doctorId) => {
    try {
      setErrorMessage(null);
      const response = await getAppointmentsByDoctorID(doctorId);

      setScheduledAppointment(response.scheduledAppointment);
      setCompleteAppointment(response.completeAppointment);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const fetchVideoConsultations = async (doctorId) => {
    try {
      const response = await getVideoConsultationsByDoctorID(doctorId);

      setVideoConsultations(response.totalVideoConsultations);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async (doctorId) => {
      dispatch(setGlobalLoading(true));
      await fetchDoctor(doctorId);
      await fetchAppointments(doctorId);
      await fetchVideoConsultations(doctorId);
      dispatch(setGlobalLoading(false));
    };
    fetchData(doctorId);
  }, [dispatch, doctorId]);

  return (
    <div>
      {globalLoading && (
        <div className="fixed inset-0 bg-gray-800/20 flex items-center justify-center z-50">
          <RingLoader color="#FFFF00" size={150} />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <h6 className="text-2xl font-bold tracking-tight flex gap-4 text-gray-900">
            <FaUserInjured />
            Doctor Profile
          </h6>
          <div className="flex flex-col">
            <div className="font-normal text-gray-700">
              Doctor Name:{" "}
              <span className="font-semibold ml-2">
                {doctor.doctor_firstName} {doctor.doctor_lastName}
              </span>
            </div>
            <div className="font-normal text-gray-700">
              Email Address:{" "}
              <span className="font-semibold ml-2">
                {doctor?.user_id?.email}
              </span>
            </div>
            <div className="font-normal text-gray-700">
              Contact Number:{" "}
              <span className="font-semibold ml-2">{doctor.doctor_number}</span>
            </div>
            <div className="font-normal text-gray-700">
              ID Number:{" "}
              <span className="font-semibold ml-2">
                {doctor.doctor_idNumber}
              </span>
            </div>
            <div className="font-normal text-gray-700">
              Department Name:{" "}
              <span className="font-semibold ml-2">
                {doctor?.department_id?.department_name}
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
          <h6 className="text-2xl font-bold tracking-tight flex gap-4 text-gray-900">
            <FaCalendar />
            Upcoming Appointments
          </h6>

          {errorMessage ? (
            <div className="text-gray-700">No consultations available.</div>
          ) : scheduledAppointment ? (
            <div className="flex flex-col">
              <div className="font-normal text-gray-700">
                Date:{" "}
                <span className="font-semibold ml-2">
                  {new Date(
                    scheduledAppointment?.appointment_date
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="font-normal text-gray-700">
                Time:{" "}
                <span className="font-semibold ml-2">
                  {scheduledAppointment?.appointment_time}
                </span>
              </div>
              <div className="font-normal text-gray-700">
                Type:{" "}
                <span className="font-semibold ml-2">
                  {scheduledAppointment?.appointment_type}
                </span>
              </div>
              <div className="font-normal text-gray-700">
                Department:{" "}
                <span className="font-semibold ml-2">
                  {scheduledAppointment?.department_id?.department_name}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-700">No appointment data found</div>
          )}
          <Link to={"/appointment-list"}>
            <div className="flex gap-4 items-center font-semibold text-blue-500 hover:text-blue-800">
              <FaEye />
              Show all
            </div>
          </Link>
        </Card>

        <Card>
          <h6 className="text-2xl font-bold tracking-tight flex gap-4 text-gray-900">
            <IoDocumentSharp />
            Complete Consultations
          </h6>

          {errorMessage ? (
            <div className="text-gray-700">
              No complete consultations available.
            </div>
          ) : completeAppointment ? (
            <div className="flex flex-col">
              <div className="font-normal text-gray-700">
                Date:{" "}
                <span className="font-semibold ml-2">
                  {new Date(
                    completeAppointment?.appointment_date
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="font-normal text-gray-700">
                Time:{" "}
                <span className="font-semibold ml-2">
                  {completeAppointment?.appointment_time}
                </span>
              </div>
              <div className="font-normal text-gray-700">
                Type:{" "}
                <span className="font-semibold ml-2">
                  {completeAppointment?.appointment_type}
                </span>
              </div>
              <div className="font-normal text-gray-700">
                Department:{" "}
                <span className="font-semibold ml-2">
                  {completeAppointment?.department_id?.department_name}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-700">
              No complete consultations available.
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
          <h6 className="text-2xl font-bold tracking-tight flex gap-4 text-gray-900">
            <FaVideo />
            Video Consultation
          </h6>
          <div className="flex flex-col">
            <div className="font-normal text-gray-700">
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

export default DoctorDashboardGrid;
