/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { toast } from "react-toastify";

const AddDoctorModal = ({ onDoctorAdded }) => {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [showCredentials, setShowCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch("/mediclinic/department/getDepartments");
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage("Failed to fetch department data.");
        toast.error(errorMessage);
        setLoading(false);
      }
      setDepartments(data.departments);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Fetch departments when the component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value.trim(),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.doctor_firstName) {
      errors.doctor_firstName = "Doctor First Name is required.";
    }
    if (!formData.doctor_lastName) {
      errors.doctor_lastName = "Doctor Last Name is required.";
    }
    if (!formData.doctor_idNumber) {
      errors.doctor_idNumber = "ID Number is required.";
    }
    if (!formData.doctor_number) {
      errors.doctor_number = "Doctor Number is required.";
    }

    if (!formData.department_id) {
      errors.department_id = "Department is required.";
    }
    if (showCredentials) {
      if (!formData || !formData.username) {
        errors.username = "Username is required.";
      }
      if (!formData.email) {
        errors.email = "Email is required.";
      }
      if (!formData || !formData.password) {
        errors.password = "Password is required.";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }
    return errors;
  };

  const handleDoctorDetailsSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
    } else {
      setErrorMessage(null);
      setShowCredentials(true);
    }
  };

  const handleGoBack = () => {
    setShowCredentials(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...dataToSubmit } = formData;

    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch("/mediclinic/doctor/createDoctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();
      if (data.success === false) {
        setErrorMessage(data.message);
        toast.error(data.message);
        setLoading(false);
      }
      setLoading(false);
      setOpen(false);
      setShowCredentials(false);
      toast.success("Doctor created successfully");
      if (onDoctorAdded) {
        onDoctorAdded();
      }
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Doctor
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add New Doctor</strong>
        </Modal.Header>
        {!showCredentials ? (
          <>
            <Modal.Body>
              <div className="grid grid-cols-1 gap-2 lg:gap-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="mb-4">
                  <Label htmlFor="doctorfirstName" className="mb-2">
                    Doctor First Name
                  </Label>
                  <TextInput
                    type="text"
                    id="doctor_firstName"
                    name="doctorfirstName"
                    placeholder="Doctor's First Name"
                    onChange={handleChange}
                    required
                  />
                  {errorMessage?.doctor_firstName && (
                    <p className="text-red-500">
                      {errorMessage.doctor_firstName}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="doctorlastName" className="mb-2">
                    Doctor Last Name
                  </Label>
                  <TextInput
                    type="text"
                    id="doctor_lastName"
                    name="doctorlastName"
                    placeholder="Doctor's Last Name"
                    onChange={handleChange}
                    required
                  />
                  {errorMessage?.doctor_lastName && (
                    <p className="text-red-500">
                      {errorMessage.doctor_lastName}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="doctoridNumber" className="mb-2">
                    Doctor ID Number
                  </Label>
                  <TextInput
                    type="text"
                    id="doctor_idNumber"
                    name="doctoridNumber"
                    placeholder="Doctor's ID Number"
                    onChange={handleChange}
                    required
                  />
                  {errorMessage?.doctor_idNumber && (
                    <p className="text-red-500">
                      {errorMessage.doctor_idNumber}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="doctorNumber" className="mb-2">
                    Doctor Number
                  </Label>
                  <TextInput
                    type="text"
                    id="doctor_number"
                    name="doctorNumber"
                    placeholder="Doctor Number"
                    onChange={handleChange}
                    required
                    pattern="\d{10}"
                  />
                  {errorMessage?.doctor_number && (
                    <p className="text-red-500">{errorMessage.doctor_number}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="departmentId" className="mb-2">
                    Department
                  </Label>
                  <Select
                    id="department_id"
                    name="departmentId"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </Select>
                  {errorMessage?.department_id && (
                    <p className="text-red-500">{errorMessage.department_id}</p>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-end">
              <Button type="submit" onClick={handleDoctorDetailsSubmit}>
                Next
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Body>
              <div className="grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-2">
                <div className="mb-4">
                  <Label htmlFor="username">Username</Label>
                  <TextInput
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                  />
                  {errorMessage?.username && (
                    <p className="text-red-500">{errorMessage.username}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <TextInput
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter Email Address"
                    onChange={handleChange}
                    required
                  />
                  {errorMessage?.email && (
                    <p className="text-red-500">{errorMessage.email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <Label htmlFor="password">Enter Password</Label>
                  <TextInput
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    required
                  />
                  {errorMessage?.password && (
                    <p className="text-red-500">{errorMessage.password}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <TextInput
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    required
                  />
                  {errorMessage?.confirmPassword && (
                    <p className="text-red-500">
                      {errorMessage.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-end">
              <div className="flex justify-between items-center gap-4">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-400 hover:bg-blue-600"
                  outline
                  onClick={handleGoBack}
                >
                  Go Back
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default AddDoctorModal;
