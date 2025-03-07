/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import NavbarSidebar from "../components/NavbarSideBar";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Pagination,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import moment from "moment";

const VideoConsultationView = () => {
  const [videoConsultation, setVideoConsultation] = useState([]);
  const [videoConsultationsPatients, setVideoConsultationsPatients] = useState(
    []
  );
  const [videoConsultationsDoctor, setVideoConsultationsDoctor] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const { currentUser } = useSelector((state) => state.authentication);
  const doctorId = currentUser.doctor_id;
  const patientId = currentUser.patient_id;
  const [videoId, seVideoId] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [videoConsultationLink, setVideoConsultationLink] = useState("");
  const [consultationStatus, setConsultationStatus] = useState("");
  const [patientVideoId, setPatientVideoId] = useState("");
  const [doctorVideoId, setDoctorVideoId] = useState("");
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 10;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "consultationStatus") {
      setConsultationStatus(value);
    }
  };

  const fetchVideoConsultations = async (page) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      let url = "";
      if (currentUser?.role === "admin") {
        url = `/mediclinic/video/getVideoConsultations?page=${page}&limit=${videosPerPage}`;
      } else if (currentUser?.role === "doctor") {
        url = `/mediclinic/video/getVideoConsultations/doctor/${doctorId}?page=${page}&limit=${videosPerPage}`;
      } else if (currentUser?.role === "patient") {
        url = `/mediclinic/video/getVideoConsultations/patient/${patientId}?page=${page}&limit=${videosPerPage}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Failed to fetch video consultations data."
        );
        toast.error(
          errorData.message || "Failed to fetch video consultations data."
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (currentUser?.role === "doctor") {
        setVideoConsultationsDoctor(data.videoConsultations);
      } else if (currentUser?.role === "patient") {
        setVideoConsultationsPatients(data.videoConsultations);
      } else {
        setVideoConsultation(data.videoConsultations);
      }
      setTotalVideos(data.totalVideoConsultations);

      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const fetchVideoConsultationsById = async (videoId) => {
    try {
      setLoadingVideo(true);
      setErrorMessage(null);

      const response = await fetch(
        `/mediclinic/video/getVideoConsultations/${videoId}`
      );
      if (!response.ok) {
        setErrorMessage("Failed to fetch video consultations by id data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      const data = await response.json();
      setAppointmentDate(data.appointment_id.appointment_date);
      setAppointmentTime(data.appointment_id.appointment_time);
      setDoctorFirstName(data.appointment_id.doctor_id.doctor_firstName);
      setDoctorLastName(data.appointment_id.doctor_id.doctor_lastName);
      setPatientFirstName(data.patient_id.patient_firstName);
      setPatientLastName(data.patient_id.patient_lastName);
      setVideoConsultationLink(data.video_consultation_link);
      setConsultationStatus(data.consultation_status);
      setPatientVideoId(data.patient_id._id);
      setDoctorVideoId(data.appointment_id.doctor_id._id);
      setLoadingVideo(false);
    } catch (error) {
      toast.error(error.message);
      setErrorMessage(error.message);
      setLoadingVideo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `/mediclinic/video/getVideoConsultations/update/${videoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient_id: patientVideoId,
            doctor_id: doctorVideoId,
            consultation_status: consultationStatus,
          }),
        }
      );
      if (!response.ok) {
        toast.error("Failed to update video");
      }
      const data = await response.json();
      await fetchVideoConsultations(1);
      // Combine data info with the success message and add line breaks
      const successMessage = `
        Consultation updated successfully:
        Consultation Status: ${data.consultation_status}
      `;

      // Show the success message as HTML
      toast.success(successMessage);
      setVideoModal(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchVideoConsultations(currentPage);
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
              <Link to={"/video-consultation"}>
                <Breadcrumb.Item>Video Consultations</Breadcrumb.Item>
              </Link>

              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Video Consultations
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
                    <Table.HeadCell>Video Consultation Link</Table.HeadCell>
                    <Table.HeadCell>Patient Name</Table.HeadCell>
                    <Table.HeadCell>Doctor Name</Table.HeadCell>
                    <Table.HeadCell>Appointment Date</Table.HeadCell>
                    <Table.HeadCell>Appointment Time</Table.HeadCell>
                    <Table.HeadCell>Consultation Status</Table.HeadCell>
                    <Table.HeadCell>Join Meeting</Table.HeadCell>
                  </Table.Head>
                  {errorMessage ? (
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell
                          colSpan="8"
                          className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                        >
                          {errorMessage}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ) : videoConsultation.length > 0 ? (
                    videoConsultation.map((video) => (
                      <Table.Body
                        key={video._id}
                        className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                      >
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.video_consultation_link}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.patient_id
                              ? `${video.patient_id.patient_firstName || ""} ${
                                  video.patient_id.patient_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.appointment_id?.doctor_id
                              ? `${
                                  video.appointment_id.doctor_id
                                    .doctor_firstName || ""
                                } ${
                                  video.appointment_id.doctor_id
                                    .doctor_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.appointment_id?.appointment_date
                              ? moment(
                                  video.appointment_id.appointment_date
                                ).format("LL")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.appointment_id?.appointment_time
                              ? moment(
                                  video.appointment_id.appointment_time
                                ).format("LT")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {video?.consultation_status
                              ? video.consultation_status
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {video.consultation_status ===
                            "PENDING VIDEO CONSULTATION" ? (
                              <Button
                                href={video.video_consultation_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="success"
                              >
                                Join Meeting
                              </Button>
                            ) : (
                              "Action not Applicable"
                            )}
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
                          No video consultations found
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

      {currentUser?.role === "doctor" && (
        <div className="flex flex-col m-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <Table.Head className="bg-gray-100 dark:bg-gray-700 text-center">
                    <Table.HeadCell>Video Consultation Link</Table.HeadCell>
                    <Table.HeadCell>Patient Name</Table.HeadCell>
                    <Table.HeadCell>Doctor Name</Table.HeadCell>
                    <Table.HeadCell>Appointment Date</Table.HeadCell>
                    <Table.HeadCell>Appointment Time</Table.HeadCell>
                    <Table.HeadCell>Consultation Status</Table.HeadCell>
                    <Table.HeadCell>Join Meeting</Table.HeadCell>
                    <Table.HeadCell>Action</Table.HeadCell>
                  </Table.Head>
                  {errorMessage ? (
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell
                          colSpan="8"
                          className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                        >
                          {errorMessage}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ) : videoConsultationsDoctor.length > 0 ? (
                    videoConsultationsDoctor.map((video) => (
                      <Table.Body
                        key={video._id}
                        className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                      >
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.video_consultation_link.length > 30 ? (
                              <>
                                {video?.video_consultation_link.slice(0, 30)}
                                ...
                              </>
                            ) : (
                              video?.video_consultation_link
                            )}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.patient_id
                              ? `${video.patient_id.patient_firstName || ""} ${
                                  video.patient_id.patient_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.doctor_id
                              ? `${video.doctor_id.doctor_firstName || ""} ${
                                  video.doctor_id.doctor_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.appointment_id?.appointment_date
                              ? moment(
                                  video.appointment_id.appointment_date
                                ).format("LL")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.appointment_id?.appointment_time
                              ? moment(
                                  video.appointment_id.appointment_time,
                                  "h:mm A"
                                ).format("LT")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {video?.consultation_status
                              ? video.consultation_status
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {video?.consultation_status ===
                            "PENDING VIDEO CONSULTATION" ? (
                              <Button
                                href={video.video_consultation_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="success"
                              >
                                Join Meeting
                              </Button>
                            ) : (
                              "Action not Applicable"
                            )}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {video?.consultation_status ===
                            "PENDING VIDEO CONSULTATION" ? (
                              <Button
                                color="blue"
                                onClick={() => {
                                  setVideoModal(true);
                                  seVideoId(video._id);
                                  fetchVideoConsultationsById(video._id);
                                }}
                              >
                                <div className="flex items-center gap-x-2">
                                  <FaEdit className="text-lg" />
                                  Edit
                                </div>
                              </Button>
                            ) : (
                              "Action not Applicable"
                            )}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    ))
                  ) : (
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell
                          colSpan="8"
                          className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                        >
                          No video consultations found
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
                    <Table.HeadCell>Video Consultation Link</Table.HeadCell>
                    <Table.HeadCell>Patient Name</Table.HeadCell>
                    <Table.HeadCell>Doctor Name</Table.HeadCell>
                    <Table.HeadCell>Appointment Date</Table.HeadCell>
                    <Table.HeadCell>Appointment Time</Table.HeadCell>
                    <Table.HeadCell>Consultation Status</Table.HeadCell>
                    <Table.HeadCell>Join Meeting</Table.HeadCell>
                  </Table.Head>
                  {errorMessage ? (
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell
                          colSpan="8"
                          className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                        >
                          {errorMessage}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ) : videoConsultationsPatients.length > 0 ? (
                    videoConsultationsPatients.map((video) => (
                      <Table.Body
                        key={video._id}
                        className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
                      >
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 text-center">
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.video_consultation_link.length > 30 ? (
                              <>
                                {video?.video_consultation_link.slice(0, 30)}
                                ...
                              </>
                            ) : (
                              video?.video_consultation_link
                            )}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.patient_id
                              ? `${video.patient_id.patient_firstName || ""} ${
                                  video.patient_id.patient_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.doctor_id
                              ? `${video.doctor_id.doctor_firstName || ""} ${
                                  video.doctor_id.doctor_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.appointment_id?.appointment_date
                              ? moment(
                                  video.appointment_id.appointment_date
                                ).format("LL")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900 dark:text-white">
                            {video?.appointment_id?.appointment_time
                              ? moment(
                                  video.appointment_id.appointment_time,
                                  "h:mm A"
                                ).format("LT")
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {video?.consultation_status
                              ? video.consultation_status
                              : "N/A"}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {video.consultation_status ===
                            "PENDING VIDEO CONSULTATION" ? (
                              <Button
                                href={video.video_consultation_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="success"
                              >
                                Join Meeting
                              </Button>
                            ) : (
                              "Action not Applicable"
                            )}
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
                          No video consultations found
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
      {((currentUser?.role === "admin" && videoConsultation.length > 0) ||
        (currentUser?.role === "doctor" &&
          videoConsultationsDoctor.length > 0) ||
        (currentUser?.role === "patient" &&
          videoConsultationsPatients.length > 0)) && (
        <PaginationButton
          fetchVideoConsultations={fetchVideoConsultations}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalVideos={totalVideos}
          loading={loading}
        />
      )}
      <Modal onClose={() => setVideoModal(false)} show={videoModal} size="md">
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Update Video</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          {loadingVideo && (
            <>
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-y-6 text-center"
          >
            <div className="mb-4">
              <Label htmlFor="videoConsultationLink" className="mb-2">
                Video Consultation Link
              </Label>
              <TextInput
                id="videoConsultationLink"
                name="videoConsultationLink"
                value={videoConsultationLink}
                disabled
              />
            </div>
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="doctorFirstName"
                  className="mb-2 block text-gray-700"
                >
                  Doctor First Name
                </Label>
                <TextInput
                  id="doctorFirstName"
                  name="doctorFirstName"
                  type="text"
                  value={doctorFirstName}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="doctorLastName" className="mb-2">
                  Doctor Last Name
                </Label>
                <TextInput
                  id="doctorLastName"
                  name="doctorLastName"
                  value={doctorLastName}
                  disabled
                />
              </div>
            </div>

            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="patientFirstName"
                  className="mb-2 block text-gray-700"
                >
                  Patient First Name
                </Label>
                <TextInput
                  id="patientFirstName"
                  name="patientFirstName"
                  type="text"
                  value={patientFirstName}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="patientLastName" className="mb-2">
                  Patient Last Name
                </Label>
                <TextInput
                  id="patientLastName"
                  name="patientLastName"
                  value={patientLastName}
                  disabled
                />
              </div>
            </div>

            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="patientFirstName"
                  className="mb-2 block text-gray-700"
                >
                  Appointment Date
                </Label>
                <TextInput
                  id="patientFirstName"
                  name="patientFirstName"
                  type="text"
                  value={
                    new Date(appointmentDate).toLocaleDateString().split("T")[0]
                  }
                  disabled
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="appointmentTime" className="mb-2">
                  Appointment Time
                </Label>
                <TextInput
                  id="appointmentTime"
                  name="appointmentTime"
                  value={appointmentTime}
                  disabled
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="consultationStatus" className="mb-2">
                Consultation Status
              </Label>
              <Select
                id="consultationStatus"
                name="consultationStatus"
                onChange={handleChange}
                required
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  <>
                    <option value={consultationStatus}>
                      {consultationStatus}
                    </option>
                    <option value="PENDING VIDEO CONSULTATION">
                      Pending Video Consultation
                    </option>
                    <option value="COMPLETED VIDEO CONSULTATION">
                      Completed Video Consultation
                    </option>
                  </>
                )}
              </Select>
            </div>

            <div className="flex items-center gap-x-6">
              <Button color="blue" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button color="gray" onClick={() => setVideoModal(false)}>
                No, cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </NavbarSidebar>
  );
};

const PaginationButton = ({
  fetchVideoConsultations,
  currentPage,
  setCurrentPage,
  totalVideos,
  loading,
}) => {
  const videosPerPage = 10;
  const [firstVideosIndex, setFirstVideosIndex] = useState(0);
  const [lastVideosIndex, setLastVideosIndex] = useState(0);

  useEffect(() => {
    const calculateUserIndexes = () => {
      const firstIndex = (currentPage - 1) * videosPerPage + 1;
      const lastIndex = Math.min(currentPage * videosPerPage, totalVideos);
      setFirstVideosIndex(firstIndex);
      setLastVideosIndex(lastIndex);
    };

    calculateUserIndexes();
  }, [currentPage, totalVideos]);

  const totalPages = Math.ceil(totalVideos / videosPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchVideoConsultations(page);
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
                {firstVideosIndex}
              </span>
              to
              <span className="font-semibold text-black">
                {lastVideosIndex}
              </span>
              of
              <span className="font-semibold text-black">{totalVideos}</span>
              video consultations
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

export default VideoConsultationView;
