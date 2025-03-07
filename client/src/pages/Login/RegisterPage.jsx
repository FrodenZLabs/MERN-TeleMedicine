/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import NavbarPage from "../../components/NavbarPage";
import backgroundImage from "/images/homepage.jpg";
import {
  Button,
  Label,
  Select,
  Spinner,
  TextInput,
  Textarea,
} from "flowbite-react";
import FooterPage from "../../components/FooterPage";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import { HiOutlineArrowRight } from "react-icons/hi";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ role: "patient" });
  const [showCredentials, setShowCredentials] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    setShowCredentials(false);
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value.trim(),
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData || !formData.patient_firstName) {
      errors.patient_firstName = "Patient First Name is required.";
    }
    if (!formData || !formData.patient_lastName) {
      errors.patient_lastName = "Patient Last Name is required.";
    }
    if (
      !formData ||
      !formData.patient_dob ||
      !isValidDate(formData.patient_dob)
    ) {
      errors.patient_dob = "Patient Date of Birth is required.";
    }
    if (!formData || !formData.patient_idNumber) {
      errors.patient_idNumber = "ID Number is required.";
    }
    if (!formData || !formData.patient_gender) {
      errors.patient_gender = "Gender is required.";
    }
    if (!formData || !formData.contact_number) {
      errors.contact_number = "Contact number is required.";
    }
    if (!formData || !formData.address) {
      errors.address = "Address is required.";
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

  const isValidDate = (dateString) => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
  };

  const handlePatientDetailsSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
    } else {
      setErrorMessage(null);
      setShowCredentials(true);
    }
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
      const response = await fetch("/mediclinic/auth/signup", {
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
      toast.success("Patient created successfully");
      navigate("/patient-login");
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loader overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <RingLoader color="#FFFF00" size={150} />
        </div>
      )}
      <div
        className="min-h-screen flex items-center opacity-90 justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <NavbarPage />
        <div className="md:mx-auto mx-4 mt-24 mb-8 md:mt-32 p-8 md:p-12 bg-white rounded-lg shadow-lg max-w-2xl">
          {!showCredentials ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center uppercase">
                Patient's <span className="text-yellow-300">Signup</span>
              </h2>
              <form className="flex flex-col">
                <div className="grid grid-cols-1 gap-2 lg:gap-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="mb-4">
                    <Label htmlFor="patientfirstName" className="mb-2">
                      Patient First Name
                    </Label>
                    <TextInput
                      type="text"
                      id="patient_firstName"
                      name="patientfirstName"
                      placeholder="Patient's First Name"
                      onChange={handleChange}
                      required
                    />
                    {errorMessage?.patient_firstName && (
                      <p className="text-red-500">
                        {errorMessage.patient_firstName}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="patientlastName" className="mb-2">
                      Patient Last Name
                    </Label>
                    <TextInput
                      type="text"
                      id="patient_lastName"
                      name="patientlastName"
                      placeholder="Patient's Last Name"
                      onChange={handleChange}
                      required
                    />
                    {errorMessage?.patient_lastName && (
                      <p className="text-red-500">
                        {errorMessage.patient_lastName}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="patientlastName" className="mb-2">
                      Patient ID Number
                    </Label>
                    <TextInput
                      type="text"
                      id="patient_idNumber"
                      name="patientidNumber"
                      placeholder="Patient's ID Number"
                      onChange={handleChange}
                      required
                    />
                    {errorMessage?.patient_idNumber && (
                      <p className="text-red-500">
                        {errorMessage.patient_idNumber}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="patientDob" className="mb-2">
                      Patient Date of Birth
                    </Label>
                    <TextInput
                      type="date"
                      id="patient_dob"
                      name="patientDob"
                      placeholder="Patient's Date of Birth"
                      onChange={handleChange}
                      required
                    />
                    {errorMessage?.patient_dob && (
                      <p className="text-red-500">{errorMessage.patient_dob}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label
                      htmlFor="gender"
                      className="mb-2 block text-gray-700"
                    >
                      Gender
                    </Label>
                    <Select
                      id="patient_gender"
                      name="gender"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                    {errorMessage?.patient_gender && (
                      <p className="text-red-500">
                        {errorMessage.patient_gender}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="contactNumber" className="mb-2">
                      Contact Number
                    </Label>
                    <TextInput
                      type="text"
                      id="contact_number"
                      name="contactNumber"
                      placeholder="Contact Number"
                      onChange={handleChange}
                      required
                      pattern="\d{10}"
                    />
                    {errorMessage?.contact_number && (
                      <p className="text-red-500">
                        {errorMessage.contact_number}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="address" className="mb-2">
                      Address
                    </Label>
                    <Textarea
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Enter your Address"
                      rows={3}
                      onChange={handleChange}
                      required
                    ></Textarea>
                    {errorMessage?.address && (
                      <p className="text-red-500">{errorMessage.address}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    size="lg"
                    type="submit"
                    className="bg-blue-400 hover:bg-blue-500 justify-end"
                    outline
                    onClick={handlePatientDetailsSubmit}
                  >
                    Next
                    <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center uppercase">
                Patient's <span className="text-yellow-300">Signup</span>
              </h2>
              <form
                className="flex flex-col md:flex-row items-center justify-center gap-4"
                onSubmit={handleSubmit}
              >
                <div className="md:flex md:flex-col">
                  <div className="md:flex md:gap-4">
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
                  </div>

                  <div className="md:flex md:gap-4">
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

                  <div className="flex justify-between items-center">
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={loading}
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
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <FooterPage />
    </>
  );
};

export default RegisterPage;
