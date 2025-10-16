import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Pagination,
  Select,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import moment from "moment";
import NavbarSidebar from "../../components/layout/NavbarSideBar";
import {
  getVideoConsultations,
  getVideoConsultationsByDoctorID,
  getVideoConsultationsByID,
  getVideoConsultationsByPatientID,
} from "../../services/videoConsultationsService";

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

      let response;
      if (currentUser?.role === "admin") {
        response = await getVideoConsultations(page, videosPerPage);
      } else if (currentUser?.role === "doctor") {
        response = await getVideoConsultationsByDoctorID(
          doctorId,
          page,
          videosPerPage
        );
      } else if (currentUser?.role === "patient") {
        response = await getVideoConsultationsByPatientID(
          patientId,
          page,
          videosPerPage
        );
      }

      if (response.success === false) {
        setErrorMessage(
          response.message || "Failed to fetch video consultations data."
        );
        toast.error(
          response.message || "Failed to fetch video consultations data."
        );
        setLoading(false);
        return;
      }

      if (currentUser?.role === "doctor") {
        setVideoConsultationsDoctor(response.videoConsultations);
      } else if (currentUser?.role === "patient") {
        setVideoConsultationsPatients(response.videoConsultations);
      } else {
        setVideoConsultation(response.videoConsultations);
      }
      setTotalVideos(response.totalVideoConsultations);

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

      const response = await getVideoConsultationsByID(videoId);

      setAppointmentDate(response.appointment_id.appointment_date);
      setAppointmentTime(response.appointment_id.appointment_time);
      setDoctorFirstName(response.appointment_id.doctor_id.doctor_firstName);
      setDoctorLastName(response.appointment_id.doctor_id.doctor_lastName);
      setPatientFirstName(response.patient_id.patient_firstName);
      setPatientLastName(response.patient_id.patient_lastName);
      setVideoConsultationLink(response.video_consultation_link);
      setConsultationStatus(response.consultation_status);
      setPatientVideoId(response.patient_id._id);
      setDoctorVideoId(response.appointment_id.doctor_id._id);

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
              <Link to={"/video-consultation"}>
                <BreadcrumbItem>Video Consultations</BreadcrumbItem>
              </Link>

              <BreadcrumbItem>List</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              All Video Consultations
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
                      <TableHeadCell>Video Consultation Link</TableHeadCell>
                      <TableHeadCell>Patient Name</TableHeadCell>
                      <TableHeadCell>Doctor Name</TableHeadCell>
                      <TableHeadCell>Appointment Date</TableHeadCell>
                      <TableHeadCell>Appointment Time</TableHeadCell>
                      <TableHeadCell>Consultation Status</TableHeadCell>
                      <TableHeadCell>Join Meeting</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  {errorMessage ? (
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan="8"
                          className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                        >
                          {errorMessage}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : videoConsultation.length > 0 ? (
                    videoConsultation.map((video) => (
                      <TableBody
                        key={video._id}
                        className="divide-y divide-gray-200 bg-white"
                      >
                        <TableRow className="hover:bg-gray-100 text-center">
                          <TableCell className="max-w-48 truncate overflow-hidden text-ellipsis whitespace-nowrap p-4 text-base font-medium text-gray-900">
                            {video?.video_consultation_link}
                          </TableCell>
                          <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                            {video?.patient_id
                              ? `${video.patient_id.patient_firstName || ""} ${
                                  video.patient_id.patient_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.appointment_id?.doctor_id
                              ? `${
                                  video.appointment_id.doctor_id
                                    .doctor_firstName || ""
                                } ${
                                  video.appointment_id.doctor_id
                                    .doctor_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.appointment_id?.appointment_date
                              ? moment(
                                  video.appointment_id.appointment_date
                                ).format("LL")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.appointment_id?.appointment_time
                              ? video.appointment_id.appointment_time
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900">
                            {video?.consultation_status
                              ? video.consultation_status
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900">
                            {video.consultation_status ===
                            "PENDING VIDEO CONSULTATION" ? (
                              <Button
                                href={video.video_consultation_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="green"
                              >
                                Join Meeting
                              </Button>
                            ) : (
                              "Action not Applicable"
                            )}
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
                          No video consultations found
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

      {currentUser?.role === "doctor" && (
        <div className="flex flex-col m-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm">
                <Table className="min-w-full divide-y divide-gray-200">
                  <TableHead className="bg-gray-100 text-center">
                    <TableRow>
                      <TableHeadCell>Video Consultation Link</TableHeadCell>
                      <TableHeadCell>Patient Name</TableHeadCell>
                      <TableHeadCell>Doctor Name</TableHeadCell>
                      <TableHeadCell>Appointment Date</TableHeadCell>
                      <TableHeadCell>Appointment Time</TableHeadCell>
                      <TableHeadCell>Consultation Status</TableHeadCell>
                      <TableHeadCell>Join Meeting</TableHeadCell>
                      <TableHeadCell>Action</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  {errorMessage ? (
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan="8"
                          className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                        >
                          {errorMessage}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : videoConsultationsDoctor.length > 0 ? (
                    videoConsultationsDoctor.map((video) => (
                      <TableBody
                        key={video._id}
                        className="divide-y divide-gray-200 bg-white"
                      >
                        <TableRow className="hover:bg-gray-100 text-center">
                          <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                            {video?.video_consultation_link.length > 30 ? (
                              <>
                                {video?.video_consultation_link.slice(0, 30)}
                                ...
                              </>
                            ) : (
                              video?.video_consultation_link
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                            {video?.patient_id
                              ? `${video.patient_id.patient_firstName || ""} ${
                                  video.patient_id.patient_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.doctor_id
                              ? `${video.doctor_id.doctor_firstName || ""} ${
                                  video.doctor_id.doctor_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.appointment_id?.appointment_date
                              ? moment(
                                  video.appointment_id.appointment_date
                                ).format("LL")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.appointment_id?.appointment_time
                              ? moment(
                                  video.appointment_id.appointment_time,
                                  "h:mm A"
                                ).format("LT")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900">
                            {video?.consultation_status
                              ? video.consultation_status
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900">
                            {video?.consultation_status ===
                            "PENDING VIDEO CONSULTATION" ? (
                              <Button
                                href={video.video_consultation_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="green"
                              >
                                Join Meeting
                              </Button>
                            ) : (
                              "Action not Applicable"
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900">
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
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ))
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan="8"
                          className="whitespace-nowrap p-4 text-base font-medium text-gray-900 text-center"
                        >
                          No video consultations found
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
                      <TableHeadCell>Video Consultation Link</TableHeadCell>
                      <TableHeadCell>Patient Name</TableHeadCell>
                      <TableHeadCell>Doctor Name</TableHeadCell>
                      <TableHeadCell>Appointment Date</TableHeadCell>
                      <TableHeadCell>Appointment Time</TableHeadCell>
                      <TableHeadCell>Consultation Status</TableHeadCell>
                      <TableHeadCell>Join Meeting</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  {errorMessage ? (
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan="8"
                          className="whitespace-nowrap text-center p-4 text-lg font-semibold bg-red-200 text-red-500"
                        >
                          {errorMessage}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : videoConsultationsPatients.length > 0 ? (
                    videoConsultationsPatients.map((video) => (
                      <TableBody
                        key={video._id}
                        className="divide-y divide-gray-200 bg-white"
                      >
                        <TableRow className="hover:bg-gray-100 text-center">
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.video_consultation_link.length > 30 ? (
                              <>
                                {video?.video_consultation_link.slice(0, 30)}
                                ...
                              </>
                            ) : (
                              video?.video_consultation_link
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900">
                            {video?.patient_id
                              ? `${video.patient_id.patient_firstName || ""} ${
                                  video.patient_id.patient_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.doctor_id
                              ? `${video.doctor_id.doctor_firstName || ""} ${
                                  video.doctor_id.doctor_lastName || ""
                                }`.trim() || "N/A"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.appointment_id?.appointment_date
                              ? moment(
                                  video.appointment_id.appointment_date
                                ).format("LL")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-base font-medium text-gray-900">
                            {video?.appointment_id?.appointment_time
                              ? moment(
                                  video.appointment_id.appointment_time,
                                  "h:mm A"
                                ).format("LT")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900">
                            {video?.consultation_status
                              ? video.consultation_status
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  p-4 text-sm font-semibold text-gray-900">
                            {video.consultation_status ===
                            "PENDING VIDEO CONSULTATION" ? (
                              <Button
                                href={video.video_consultation_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="green"
                              >
                                Join Meeting
                              </Button>
                            ) : (
                              "Action not Applicable"
                            )}
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
                          No video consultations found
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
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Update Video</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
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
        </ModalBody>
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

  const totalPages = Math.max(1, Math.ceil(totalVideos / videosPerPage));

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
