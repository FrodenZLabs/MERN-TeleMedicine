import moment from "moment";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Prescription from "../models/prescription.model.js";
import { errorHandler } from "../utils/error.js";
import { createNotification } from "./notification.controller.js";

// Get all prescription
export const getAllPrescriptions = async (request, response, next) => {
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;

  try {
    const prescriptions = await Prescription.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_time appointment_date appointment_status",
      })
      .lean();

    if (!prescriptions.length) {
      return next(errorHandler(404, "Prescription not found"));
    }
    const totalPrescriptions = await Prescription.countDocuments();
    response
      .status(200)
      .json({ prescriptions, totalPrescriptions, page, limit });
  } catch (error) {
    next(errorHandler(500, "Error retrieving prescriptions from the database"));
  }
};

export const getPrescriptionByID = async (request, response, next) => {
  const prescriptionId = request.params.id;
  try {
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      return next(errorHandler(404, "Prescription not found"));
    }
    response.status(200).json(prescription);
  } catch (error) {
    next(errorHandler(500, "Error retrieving prescription from the database"));
  }
};

// Fetch prescriptions by doctor ID
export const getPrescriptionsByDoctorID = async (request, response, next) => {
  const doctorId = request.params.doctor_id;
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;

  try {
    const prescriptions = await Prescription.find({ doctor_id: doctorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    if (!prescriptions || prescriptions.length === 0) {
      return next(errorHandler(404, "No prescriptions found for this doctor"));
    }

    const totalPrescriptions = await Prescription.find({ doctor_id: doctorId }).countDocuments();
    response
      .status(200)
      .json({ prescriptions, totalPrescriptions, page, limit });
  } catch (error) {
    next(errorHandler(500, "Error retrieving prescriptions from the database"));
  }
};

// Adjusted function to fetch prescription by patient ID
export const getPrescriptionByPatientID = async (request, response, next) => {
  const patientId = request.params.patient_id;
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;

  try {
    const prescriptions = await Prescription.find({ patient_id: patientId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    if (!prescriptions.length) {
      return next(errorHandler(404, "No prescriptions found for the patient"));
    }

        const totalPrescriptions = await Prescription.find({ patient_id: patientId }).countDocuments();
    response
      .status(200)
      .json({ prescriptions, totalPrescriptions, page, limit });
  } catch (error) {
    next(errorHandler(500, "Error retrieving prescriptions from the database"));
  }
};

// Adjusted function to fetch prescription by appointment ID
export const getPrescriptionByAppointmentID = async (
  request,
  response,
  next
) => {
  const appointmentId = request.params.appointment_id;

  try {
    const prescriptions = await Prescription.find({
      appointment_id: appointmentId,
    })
      .sort({ createdAt: -1 })
      .limit(1);
    if (!prescriptions) {
      return next(errorHandler(404, "No prescriptions found for the patient"));
    }
    response.status(200).json(prescriptions);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error retrieving prescriptions from the database"));
  }
};

// Create a new prescription
export const createPrescription = async (request, response, next) => {
  const {
    patient_id,
    appointment_id,
    doctor_id,
    prescription_date,
    prescription_details,
  } = request.body;

  try {
    // Accessing current patient user ID
    const currentUserId = request.user._id;
    const newPrescription = new Prescription({
      patient_id,
      doctor_id,
      appointment_id,
      prescription_date,
      prescription_details,
    });
    const savedPrescription = await newPrescription.save();
    const formattedDate = moment(prescription_date).format("LL");
    // Fetch the patient information
    const patient = await Patient.findById(patient_id).populate("user_id");
    const patientUserId = patient.user_id._id;
    // Fetch the doctor information
    const doctor = await Doctor.findById(doctor_id);

    await createNotification(
      currentUserId,
      "Prescription Issued",
      `You have successfully issued a new prescription for patient ${patient.patient_firstName} ${patient.patient_lastName}. Ensure the patient receives their medication as prescribed`
    );
    await createNotification(
      patientUserId,
      "Your Prescription is Ready",
      `Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName} has created a new prescription for you on ${formattedDate}. Please check your appointment dashboard for details and instructions.`
    );

    response.status(201).json(savedPrescription);
  } catch (error) {
    next(errorHandler(500, "Error creating prescription"));
  }
};

// Update a prescription
export const updatePrescription = async (request, response, next) => {
  const prescriptionId = request.params.id;
  const { patient_id, doctor_id, prescription_date, prescription_details } =
    request.body;
  try {
    // Accessing current patient user ID
    const currentUserId = request.user._id;
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      {
        patient_id,
        doctor_id,
        prescription_date,
        prescription_details,
      },
      { new: true, runValidators: true }
    );
    if (!updatedPrescription) {
      return next(errorHandler(404, "Prescription not found"));
    }

    const formattedDate = moment(prescription_date).format("LL");
    // Fetch the patient information
    const patient = await Patient.findById(patient_id).populate("user_id");
    const patientUserId = patient.user_id._id;
    // Fetch the doctor information
    const doctor = await Doctor.findById(doctor_id);

    await createNotification(
      currentUserId,
      "Prescription Updated",
      `The prescription for patient ${patient.patient_firstName} ${patient.patient_lastName} has been updated. Please review the updated prescription for any necessary actions`
    );
    await createNotification(
      patientUserId,
      "Your Prescription Has Been Updated",
      `Your prescription has been updated by Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName} for you on ${formattedDate}. Please check your account for the latest prescription details.`
    );

    response.status(200).json(updatedPrescription);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error updating prescription"));
  }
};

// Delete a prescription
export const deletePrescription = async (request, response, next) => {
  const prescriptionId = request.params.id;

  try {
    // Find the prescription by ID to get the user_id
    const prescription = await Prescription.findById(prescriptionId).populate(
      "patient_id doctor_id"
    );

    if (!prescription) {
      return next(errorHandler(404, "Prescription not found"));
    }

    const patient = prescription.patient_id;
    const doctor = prescription.doctor_id;

    await createNotification(
      doctor.user_id,
      "Prescription Deleted",
      `The prescription for patient ${patient.patient_firstName} ${patient.patient_lastName} has been successfully deleted. Please review the patient’s records for any necessary updates.`
    );
    await createNotification(
      patient.user_id,
      "Your Prescription Has Been Deleted",
      `Your prescription has been removed from the system by Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName}. Please contact your doctor for further assistance or to discuss your treatment options.`
    );
    // Delete the prescription
    await Prescription.findByIdAndDelete(prescriptionId);
    response.status(200).json("Prescription deleted successfully");
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error deleting prescription"));
  }
};
