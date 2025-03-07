/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Label, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineArrowRight, HiPlus, HiX } from "react-icons/hi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddPaymentModalWrapper from "./AddPaymentModal";

const AddAppointmentModal = ({ onAppointmentAdded }) => {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const { currentUser } = useSelector((state) => state.authentication);
  const patientId = currentUser?.patient_id;

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
    if (!formData || !formData.appointment_date) {
      errors.appointment_date = "Appointment Date is required.";
    }
    if (!formData || !formData.appointment_time) {
      errors.appointment_time = "Appointment Time is required.";
    }
    if (!formData || !formData.appointment_type) {
      errors.appointment_type = "Appointment Type is required.";
    }
    if (!formData || !formData.department_id) {
      errors.department_id = "Department ID is required.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const formDataWithPatientId = {
        ...formData,
        patient_id: patientId,
      };

      const response = await fetch(
        "/mediclinic/appointment/createAppointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataWithPatientId),
        }
      );

      const data = await response.json();
      if (data.success === false) {
        setErrorMessage(data.message);
        toast.error(data.message);
      } else {
        toast.success("Appointment created successfully");
        setAppointmentId(data._id);
        setShowPaymentModal(true);
        setOpen(false);
      }

      setLoading(false);
      if (onAppointmentAdded) {
        onAppointmentAdded();
      }
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false); // Close the payment modal on success
    toast.success("Payment was successful!");
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Appointment
        </div>
      </Button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="md:mx-auto mx-4 p-8 md:p-12 bg-white rounded-lg shadow-lg max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center uppercase">
              Add New <span className="text-yellow-300">Appointment</span>
            </h2>
            <form className="flex flex-col">
              <div className="grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-2">
                <div className="mb-4">
                  <Label htmlFor="appointmentDate" className="mb-2">
                    Appointment Date
                  </Label>
                  <TextInput
                    type="date"
                    id="appointment_date"
                    name="appointmentDate"
                    placeholder="Appointment Date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    required
                  />
                  {errorMessage?.appointment_date && (
                    <p className="text-red-500">
                      {errorMessage.appointment_date}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="appointmentTime" className="mb-2">
                    Appointment Time
                  </Label>
                  <TextInput
                    type="time"
                    id="appointment_time"
                    name="appointmentTime"
                    placeholder="Appointment Time"
                    onChange={handleChange}
                    required
                  />
                  {errorMessage?.appointment_time && (
                    <p className="text-red-500">
                      {errorMessage.appointment_time}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="gender" className="mb-2 block text-gray-700">
                    Select Appointment Type
                  </Label>
                  <Select
                    id="appointment_type"
                    name="appointmentType"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Online">Online</option>
                  </Select>
                  {errorMessage?.appointment_type && (
                    <p className="text-red-500">
                      {errorMessage.appointment_type}
                    </p>
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
              <div className="flex justify-between items-center">
                <Button
                  color="failure"
                  className="justify-end"
                  onClick={() => setOpen(false)}
                >
                  <HiX className=" h-5 w-5 mr-2" />
                  Close
                </Button>
                <Button
                  size="lg"
                  type="submit"
                  className="bg-blue-400 hover:bg-blue-500 justify-end"
                  outline
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment</span>
                      <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <AddPaymentModalWrapper
          appointmentId={appointmentId}
          patientId={patientId}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default AddAppointmentModal;
