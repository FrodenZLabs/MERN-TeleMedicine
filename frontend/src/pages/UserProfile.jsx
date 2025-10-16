import { HiHome, HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  FileInput,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import { signoutSuccess } from "../redux/reducers/authenticationSlice";
import NavbarSidebar from "../components/layout/NavbarSideBar";
import { getDepartments } from "../services/departmentService";
import {
  deletePatient,
  getPatientsByID,
  updatePatient,
} from "../services/patientService";
import {
  deleteDoctor,
  getDoctorsByID,
  updateDoctor,
} from "../services/doctorService";
import { Deactivate, getUsersByID, updateUser } from "../services/authService";

const UserProfile = () => {
  const [departments, setDepartments] = useState([]);
  const { currentUser } = useSelector((state) => state.authentication);
  const patientId = currentUser?.patient_id;
  const doctorId = currentUser?.doctor_id;
  const userId = currentUser?._id;
  const dispatch = useDispatch();
  const [patientIdToDelete, setPatientIdToDelete] = useState("");
  const [doctorIdToDelete, setDoctorIdToDelete] = useState("");
  const [userIdToDeactivate, setUserIdToDeactivate] = useState("");
  const [patientModal, setPatientModal] = useState(false);
  const [doctorModal, setDoctorModal] = useState(false);

  const [isOpen, setOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientDob, setPatientDob] = useState("");
  const [patientIdNumber, setPatientIdNumber] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");

  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [doctorNumber, setDoctorNumber] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [doctorIdNumber, setDoctorIdNumber] = useState("");

  const [patientUsername, setPatientUsername] = useState("");
  const [doctorUsername, setDoctorUsername] = useState("");
  const [doctorProfile, setDoctorProfile] = useState("");
  const [patientProfile, setPatientProfile] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handlePatientUserChange = (e) => {
    const { name, value } = e.target;
    if (name === "patientUsername") {
      setPatientUsername(value);
    } else if (name === "patientEmail") {
      setPatientEmail(value);
    } else if (name === "patientPassword") {
      setPatientPassword(value);
    } else if (name === "patientFirstName") {
      setPatientFirstName(value);
    } else if (name === "patientLastName") {
      setPatientLastName(value);
    } else if (name === "patientGender") {
      setPatientGender(value);
    } else if (name === "patientIdNumber") {
      setPatientIdNumber(value);
    } else if (name === "patientDob") {
      setPatientDob(value);
    } else if (name === "contactNumber") {
      setContactNumber(value);
    } else if (name === "address") {
      setAddress(value);
    }
  };

  const handleDoctorUserChange = (e) => {
    const { name, value } = e.target;
    if (name === "doctorUsername") {
      setDoctorUsername(value);
    } else if (name === "doctorEmail") {
      setDoctorEmail(value);
    } else if (name === "doctorPassword") {
      setDoctorPassword(value);
    } else if (name === "doctorNumber") {
      setDoctorNumber(value);
    } else if (name === "doctorDepartment") {
      setDoctorDepartment(value);
    } else if (name === "doctorIdNumber") {
      setDoctorIdNumber(value);
    } else if (name === "doctorLastName") {
      setDoctorLastName(value);
    } else if (name === "doctorFirstName") {
      setDoctorFirstName(value);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getDepartments({});
      setDepartments(response.departments);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(true);
    }
  };

  const fetchPatientsByID = async (patientId) => {
    try {
      setLoading(true);
      setLoadingPatient(true);
      const response = await getPatientsByID(patientId);
      setAddress(response.address || "N/A");
      setContactNumber(response.contact_number || "N/A");
      setPatientGender(response.patient_gender || "N/A");
      setPatientDob(response.patient_dob || "N/A");
      setPatientIdNumber(response.patient_idNumber || "N/A");
      setPatientFirstName(response.patient_firstName || "N/A");
      setPatientLastName(response.patient_lastName || "N/A");
      setLoading(false);
      setLoadingPatient(false);
    } catch (error) {
      toast.error(error.message);
      setLoadingPatient(false);
      setLoading(true);
    }
  };

  const fetchDoctorByID = async (doctorId) => {
    try {
      setLoading(true);
      setLoadingDoctor(true);
      const response = await getDoctorsByID(doctorId);
      setDoctorNumber(response.doctor_number || "N/A");
      setDoctorDepartment(response.department_id || "N/A");
      setDoctorIdNumber(response.doctor_idNumber || "N/A");
      setDoctorFirstName(response.doctor_firstName || "N/A");
      setDoctorLastName(response.doctor_lastName || "N/A");
      setLoading(false);
      setLoadingDoctor(false);
    } catch (error) {
      toast.error(error.message);
      setLoadingDoctor(false);
      setLoading(true);
    }
  };

  const fetchUsersByID = async (userId) => {
    try {
      setLoading(true);

      if (currentUser?.role === "patient") {
        setLoadingPatient(true);
        const response = await getUsersByID(userId);
        setPatientProfile(response.user_profile || "N/A");
        setPatientUsername(response.username || "N/A");
        setPatientEmail(response.email || "N/A");
        setLoading(false);
        setLoadingPatient(false);
      } else if (currentUser?.role === "doctor") {
        setLoadingDoctor(true);
        const response = await getUsersByID(userId);
        setDoctorProfile(response.user_profile || "N/A");
        setDoctorUsername(response.username || "N/A");
        setDoctorEmail(response.email || "N/A");
        setLoading(false);
        setLoadingDoctor(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoadingPatient(false);
      setLoadingDoctor(false);
      setLoading(true);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      if (currentUser?.role === "patient") {
        const response = await deletePatient(patientIdToDelete);
        dispatch(signoutSuccess());
        toast.success(response.message);
        setLoading(false);
      } else if (currentUser?.role === "doctor") {
        const response = await deleteDoctor(doctorIdToDelete);
        dispatch(signoutSuccess());
        toast.success(response.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(true);
    }
  };

  const handleDeactivate = async () => {
    try {
      setLoading(true);
      const response = await Deactivate(userIdToDeactivate);
      dispatch(signoutSuccess());
      toast.success(response.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updatedData = {
        address: address,
        patient_firstName: patientFirstName,
        patient_lastName: patientLastName,
        patient_gender: patientGender,
        patient_dob: patientDob,
        patient_idNumber: patientIdNumber,
        contact_number: contactNumber,
      };
      const response = await updatePatient(patientId, updatedData);
      fetchPatientsByID(patientId);
      // Show the success message as HTML
      toast.success(response.message);
      setPatientModal(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(true);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updatedData = {
        department_id: doctorDepartment,
        doctor_firstName: doctorFirstName,
        doctor_lastName: doctorLastName,
        doctor_idNumber: doctorIdNumber,
        doctor_number: doctorNumber,
      };
      const response = await updateDoctor(doctorId, updatedData);
      fetchDoctorByID(doctorId);
      // Show the success message as HTML
      toast.success(response.message);
      setDoctorModal(false);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(true);
    }
  };

  const handlePatientUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      if (selectedFile) formData.append("profileImage", selectedFile);
      formData.append("username", patientUsername);
      formData.append("email", patientEmail);
      formData.append("password", patientPassword);

      const response = await updateUser(userId, formData);
      fetchUsersByID(userId);

      // Show the success message as HTML
      toast.success(response.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(true);
    }
  };

  const handleDoctorUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      if (selectedFile) formData.append("profileImage", selectedFile);
      formData.append("username", doctorUsername);
      formData.append("email", doctorEmail);
      formData.append("password", doctorPassword);
      const response = await updateUser(userId, formData);
      fetchUsersByID(userId);
      // Show the success message as HTML
      toast.success(response.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(true);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click(); // Opens file selector
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (currentUser?.role === "doctor") {
        setDoctorProfile(URL.createObjectURL(file));
      } else if (currentUser?.role === "patient") {
        setPatientProfile(URL.createObjectURL(file));
      }
    }
  };

  useEffect(() => {
    fetchUsersByID(userId);
    if (currentUser?.role === "doctor") {
      fetchDepartments();
      fetchDoctorByID(doctorId);
    } else if (currentUser?.role === "patient") {
      fetchPatientsByID(patientId);
    }
  }, [currentUser]);

  return (
    <NavbarSidebar isFooter={true}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <BreadcrumbItem>
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="">Home</span>
                </div>
              </BreadcrumbItem>
              <BreadcrumbItem href="/user-profile">User Profile</BreadcrumbItem>
              <BreadcrumbItem>Profile</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              User Profile
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
        {currentUser?.role === "doctor" && (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm items-center">
                <div>
                  <Card className="items-center">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                      Doctor Details
                    </h1>
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
                          placeholder="Enter Doctor Name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorLastName"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor Last Name
                        </Label>
                        <TextInput
                          id="doctorLastName"
                          name="doctorLastName"
                          type="text"
                          value={doctorLastName}
                          disabled
                          placeholder="Enter Doctor Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorIdNumber"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor ID Number
                        </Label>
                        <TextInput
                          id="doctorIdNumber"
                          name="doctorIdNumber"
                          type="text"
                          value={doctorIdNumber}
                          disabled
                          placeholder="Enter Doctor ID Number"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorNumber"
                          className="mb-2 block text-gray-700"
                        >
                          Doctor Contact
                        </Label>
                        <TextInput
                          id="doctorNumber"
                          name="doctorNumber"
                          type="text"
                          value={doctorNumber}
                          disabled
                          placeholder="Enter Doctor Contact"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="doctorDepartment"
                          className="mb-2 block text-gray-700"
                        >
                          Department Name
                        </Label>
                        <TextInput
                          id="doctorDepartment"
                          name="doctorDepartment"
                          type="text"
                          value={doctorDepartment.department_name}
                          disabled
                          placeholder="Enter Department Name"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      color="blue"
                      onClick={() => {
                        setDoctorModal(true);
                        fetchDoctorByID(doctorId);
                      }}
                    >
                      Update
                    </Button>
                  </Card>
                </div>
                <div>
                  <Card className="">
                    <h1 className="text-xl mx-10 font-semibold text-gray-900 sm:text-2xl">
                      Other Details
                    </h1>

                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center mt-4">
                      {doctorProfile ? (
                        <img
                          src={doctorProfile}
                          onClick={handleImageClick}
                          alt="User Profile"
                          className="w-28 h-28 rounded-full object-cover cursor-pointer border-4 border-purple-400 hover:opacity-80 transition"
                        />
                      ) : (
                        <div
                          onClick={handleImageClick}
                          className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer border-4 border-dashed border-purple-400"
                        >
                          Upload Image
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Click image to change profile picture
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                      <div className="mt-2">
                        <div className="mb-4">
                          <Label
                            htmlFor="doctorUsername"
                            className="mb-2 block text-gray-700"
                          >
                            Username
                          </Label>
                          <TextInput
                            id="doctorUsername"
                            name="doctorUsername"
                            type="text"
                            value={doctorUsername}
                            onChange={handleDoctorUserChange}
                            placeholder="Enter Username"
                          />
                        </div>
                        <div className="mb-4">
                          <Label
                            htmlFor="doctorEmail"
                            className="mb-2 block text-gray-700"
                          >
                            Email Address
                          </Label>
                          <TextInput
                            id="doctorEmail"
                            name="doctorEmail"
                            type="email"
                            value={doctorEmail}
                            onChange={handleDoctorUserChange}
                            placeholder="Enter Email Address"
                          />
                        </div>
                        <div className="mb-4">
                          <Label
                            htmlFor="doctorPassword"
                            className="mb-2 block text-gray-700"
                          >
                            Password
                          </Label>
                          <TextInput
                            id="doctorPassword"
                            name="doctorPassword"
                            type="password"
                            value={doctorPassword}
                            onChange={handleDoctorUserChange}
                            placeholder="password"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      color="blue"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDoctorUserSubmit(e);
                      }}
                    >
                      Update User
                    </Button>
                  </Card>
                </div>
              </div>
              <div className="mt-4 mb-8 grid grid-cols-1 shadow-lg">
                <Card className="items-center">
                  <div className="flex gap-x-20">
                    <Button
                      color="red"
                      onClick={() => {
                        setOpen(true);
                        setDoctorIdToDelete(doctorId);
                      }}
                    >
                      Delete Account
                    </Button>
                    <Button
                      color="yellow"
                      onClick={() => {
                        setOpenModal(true);
                        setUserIdToDeactivate(userId);
                      }}
                    >
                      Deactivate Account
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {currentUser?.role === "patient" && (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm items-center">
                <div>
                  <Card className="items-center">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                      Patient Details
                    </h1>
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
                          placeholder="Enter Patient's First Name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="patientLastName"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Last Name
                        </Label>
                        <TextInput
                          id="patientLastName"
                          name="patientLastName"
                          type="text"
                          value={patientLastName}
                          disabled
                          placeholder="Enter Patient's Last Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="patientIdNumber"
                          className="mb-2 block text-gray-700"
                        >
                          Patient ID Number
                        </Label>
                        <TextInput
                          id="patientIdNumber"
                          name="patientIdNumber"
                          type="text"
                          value={patientIdNumber}
                          disabled
                          placeholder="Enter Patient's ID Number"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="patientDob"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Date of Birth
                        </Label>
                        <TextInput
                          id="patientDob"
                          name="patientDob"
                          type="text"
                          value={new Date(patientDob).toLocaleDateString()}
                          disabled
                          placeholder="Enter Patient's Date of Birth"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
                      <div className="mb-4">
                        <Label
                          htmlFor="patientGender"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Gender
                        </Label>
                        <TextInput
                          id="patientGender"
                          name="patientGender"
                          type="text"
                          value={patientGender}
                          disabled
                          placeholder="Enter Patient Gender"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <Label
                          htmlFor="contactNumber"
                          className="mb-2 block text-gray-700"
                        >
                          Patient Contact
                        </Label>
                        <TextInput
                          id="contactNumber"
                          name="contactNumber"
                          type="text"
                          value={contactNumber}
                          disabled
                          placeholder="Enter Patient Contact"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label
                        htmlFor="address"
                        className="mb-2 block text-gray-700"
                      >
                        Address
                      </Label>
                      <TextInput
                        id="address"
                        name="address"
                        type="text"
                        value={address}
                        disabled
                        placeholder="Enter Address"
                        required
                      />
                    </div>
                    <Button
                      color="blue"
                      onClick={() => {
                        setPatientModal(true);
                        fetchPatientsByID(patientId);
                      }}
                    >
                      Update
                    </Button>
                  </Card>
                </div>
                <div>
                  <Card className="">
                    <h1 className="text-xl mx-10 font-semibold text-gray-900 sm:text-2xl">
                      Other Details
                    </h1>

                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center mt-4">
                      {patientProfile ? (
                        <img
                          src={patientProfile}
                          onClick={handleImageClick}
                          alt="User Profile"
                          className="w-28 h-28 rounded-full object-cover cursor-pointer border-4 border-purple-400 hover:opacity-80 transition"
                        />
                      ) : (
                        <div
                          onClick={handleImageClick}
                          className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer border-4 border-dashed border-purple-400"
                        >
                          Upload Image
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Click image to change profile picture
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                      <div className="mt-2">
                        <div className="mb-4">
                          <Label
                            htmlFor="patientUsername"
                            className="mb-2 block text-gray-700"
                          >
                            Username
                          </Label>
                          <TextInput
                            id="patientUsername"
                            name="patientUsername"
                            type="text"
                            value={patientUsername}
                            onChange={handlePatientUserChange}
                            placeholder="Enter Username"
                          />
                        </div>
                        <div className="mb-4">
                          <Label
                            htmlFor="patientEmail"
                            className="mb-2 block text-gray-700"
                          >
                            Email Address
                          </Label>
                          <TextInput
                            id="patientEmail"
                            name="patientEmail"
                            type="email"
                            value={patientEmail}
                            onChange={handlePatientUserChange}
                            placeholder="Enter Email Address"
                          />
                        </div>
                        <div className="mb-4">
                          <Label
                            htmlFor="patientPassword"
                            className="mb-2 block text-gray-700"
                          >
                            Password
                          </Label>
                          <TextInput
                            id="patientPassword"
                            name="patientPassword"
                            type="password"
                            value={patientPassword}
                            onChange={handlePatientUserChange}
                            placeholder="password"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      color="blue"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePatientUserSubmit(e);
                      }}
                    >
                      Update User
                    </Button>
                  </Card>
                </div>
              </div>
              <div className="mt-4 mb-8 grid grid-cols-1 shadow-lg">
                <Card className="items-center">
                  <div className="flex gap-x-20">
                    <Button
                      color="red"
                      onClick={() => {
                        setOpen(true);
                        setPatientIdToDelete(patientId);
                      }}
                    >
                      <div className="flex items-center gap-x-2">
                        <HiTrash className="text-lg" />
                        Delete Account
                      </div>
                    </Button>
                    <Button
                      color="yellow"
                      onClick={() => {
                        setOpenModal(true);
                        setUserIdToDeactivate(userId);
                      }}
                    >
                      Deactivate Account
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete user</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this user?
            </p>
            <div className="flex items-center gap-x-6">
              <Button
                color="red"
                onClick={() => {
                  setOpen(false);
                  handleDelete();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal onClose={() => setOpenModal(false)} show={isOpenModal} size="md">
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Deactivate user</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to deactivate this user?
            </p>
            <div className="flex items-center gap-x-6">
              <Button
                color="red"
                onClick={() => {
                  setOpenModal(false);
                  handleDeactivate();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        onClose={() => setPatientModal(false)}
        show={patientModal}
        size="md"
      >
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Update Patient</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          {loadingPatient && (
            <>
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-y-6 text-center"
          >
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
                  onChange={handlePatientUserChange}
                  placeholder="Enter Patient's First Name"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="patientLastName"
                  className="mb-2 block text-gray-700"
                >
                  Patient Last Name
                </Label>
                <TextInput
                  id="patientLastName"
                  name="patientLastName"
                  type="text"
                  value={patientLastName}
                  onChange={handlePatientUserChange}
                  placeholder="Enter Patient's Last Name"
                  required
                />
              </div>
            </div>
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="patientIdNumber"
                  className="mb-2 block text-gray-700"
                >
                  Patient ID Number
                </Label>
                <TextInput
                  id="patientIdNumber"
                  name="patientIdNumber"
                  type="text"
                  value={patientIdNumber}
                  onChange={handlePatientUserChange}
                  placeholder="Enter Patient's ID Number"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="patientDob"
                  className="mb-2 block text-gray-700"
                >
                  Patient Date of Birth
                </Label>
                <TextInput
                  id="patientDob"
                  name="patientDob"
                  type="text"
                  value={new Date(patientDob).toLocaleDateString()}
                  onChange={handlePatientUserChange}
                  placeholder="Enter Patient's Date of Birth"
                  required
                />
              </div>
            </div>
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="patientGender"
                  className="mb-2 block text-gray-700"
                >
                  Patient Gender
                </Label>
                <TextInput
                  id="patientGender"
                  name="patientGender"
                  type="text"
                  value={patientGender}
                  onChange={handlePatientUserChange}
                  placeholder="Enter Patient Gender"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="contactNumber"
                  className="mb-2 block text-gray-700"
                >
                  Patient Contact
                </Label>
                <TextInput
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  value={contactNumber}
                  onChange={handlePatientUserChange}
                  placeholder="Enter Patient Contact"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="address" className="mb-2 block text-gray-700">
                Address
              </Label>
              <TextInput
                id="address"
                name="address"
                type="text"
                value={address}
                onChange={handlePatientUserChange}
                placeholder="Enter Address"
                required
              />
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
              <Button color="gray" onClick={() => setPatientModal(false)}>
                No, cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      <Modal onClose={() => setDoctorModal(false)} show={doctorModal} size="md">
        <ModalHeader className="px-6 pb-0 pt-6">
          <span className="sr-only">Update Doctor</span>
        </ModalHeader>
        <ModalBody className="px-6 pb-6 pt-0">
          {loadingDoctor && (
            <>
              <Spinner size="lg" />
              <span className="pl-3">Loading...</span>
            </>
          )}
          <form
            onSubmit={handleDoctorSubmit}
            className="flex flex-col items-center gap-y-6 text-center"
          >
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
                  onChange={handleDoctorUserChange}
                  placeholder="Enter Doctor Name"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="doctorLastName"
                  className="mb-2 block text-gray-700"
                >
                  Doctor Last Name
                </Label>
                <TextInput
                  id="doctorLastName"
                  name="doctorLastName"
                  type="text"
                  value={doctorLastName}
                  onChange={handleDoctorUserChange}
                  placeholder="Enter Doctor Name"
                  required
                />
              </div>
            </div>
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label
                  htmlFor="doctorIdNumber"
                  className="mb-2 block text-gray-700"
                >
                  Doctor ID Number
                </Label>
                <TextInput
                  id="doctorIdNumber"
                  name="doctorIdNumber"
                  type="text"
                  value={doctorIdNumber}
                  onChange={handleDoctorUserChange}
                  placeholder="Enter Doctor ID Number"
                  required
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="doctorNumber"
                  className="mb-2 block text-gray-700"
                >
                  Doctor Contact
                </Label>
                <TextInput
                  id="doctorNumber"
                  name="doctorNumber"
                  type="text"
                  value={doctorNumber}
                  onChange={handleDoctorUserChange}
                  placeholder="Enter Doctor Contact"
                  required
                />
              </div>
            </div>
            <div className="flex gap-x-4 sm:gap-x-20 md:gap-x-10">
              <div className="mb-4">
                <Label htmlFor="doctorDepartment" className="mb-2">
                  Department Name
                </Label>
                <Select
                  id="doctorDepartment"
                  name="doctorDepartment"
                  onChange={handleDoctorUserChange}
                  required
                  disabled={loadingDoctor}
                >
                  {loadingDoctor ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    <>
                      <option value={doctorDepartment}>
                        {doctorDepartment.department_name}
                      </option>
                      {departments?.map((dep) => (
                        <option key={dep?._id} value={dep?._id}>
                          {dep?.department_name}
                        </option>
                      ))}
                    </>
                  )}
                </Select>
              </div>
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
              <Button color="gray" onClick={() => setDoctorModal(false)}>
                No, cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </NavbarSidebar>
  );
};

export default UserProfile;
