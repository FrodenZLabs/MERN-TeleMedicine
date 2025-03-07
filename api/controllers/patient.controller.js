import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import { createNotification } from "./notification.controller.js";
import Notification from "../models/notification.model.js";

// Get all patients
export const getAllPatients = async (request, response, next) => {
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;
  const searchTerm = request.query.searchTerm || "";

  let patient_gender = request.query.patient_gender;
  // If no specific patient_gender is requested or 'all' is specified, fetch all patient_genders
  if (patient_gender === undefined || patient_gender === "All") {
    patient_gender = { $in: ["Male", "Female", "Other"] };
  }

  // Create a filter for searching patients
  const searchFilter = {
    $or: [
      { patient_firstName: { $regex: searchTerm, $options: "i" } },
      { patient_lastName: { $regex: searchTerm, $options: "i" } },
    ],
    patient_gender,
  };

  try {
    const patients = await Patient.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "user_id",
        select: "email username user_profile",
      });

    if (!patients.length) {
      return next(
        errorHandler(
          404,
          `Patients not found for the specified search term, ${searchTerm}`
        )
      );
    }

    const totalPatients = await Patient.countDocuments(searchFilter);
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPatients = await Patient.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    // Calculate age for each patient based on patient_dob
    const patientsWithAge = patients.map((patient) => {
      const dob = patient.patient_dob;
      const ageDiffMs = Date.now() - dob.getTime();
      const ageDate = new Date(ageDiffMs);
      return {
        ...patient.toObject(),
        age: Math.abs(ageDate.getUTCFullYear() - 1970),
      };
    });
    response.status(200).json({
      patients: patientsWithAge,
      totalPatients,
      lastMonthPatients,
      page,
      limit,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error retrieving patients from the database"));
  }
};

// Get a patient by ID
export const getPatientById = async (request, response, next) => {
  const patientId = request.params.id;
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return next(errorHandler(404, "Patient not found"));
    }
    response.status(200).json(patient);
  } catch (error) {
    next(errorHandler(500, "Error retrieving patient from the database"));
  }
};

// Create a new patient
export const createPatient = async (request, response, next) => {
  const {
    patient_firstName,
    patient_lastName,
    patient_idNumber,
    patient_dob,
    patient_gender,
    contact_number,
    address,
    username, // Username for the new user
    password, // Password for the new user
    role = "patient", // Default role for the new user
  } = request.body;

  try {
    // Accessing current patient user ID
    const currentUserId = request.user._id;
    // Check for common required fields
    if (!username || !password || !role) {
      return next(
        errorHandler(400, "Username, password, and role are required.")
      );
    }

    // Check if patient_idNumber already exists
    const existingPatientId = await Patient.findOne({ patient_idNumber });
    if (existingPatientId) {
      return next(errorHandler(409, "Patient ID number already exists."));
    }

    // Check if contact number already exists for patients
    const existingPatientNo = await Patient.findOne({ contact_number });
    if (existingPatientNo) {
      return next(
        errorHandler(409, "Contact number already exists for a patient.")
      );
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(errorHandler(400, "Username already exists."));
    }
    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user with hashed password
    const newUser = new User({
      user_profile:
        "https://imgs.search.brave.com/gV6Xy99WsNTWpgT2KUNxopKhP45u8QMrrL2DGi5HYxg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc",
      username,
      password: hashedPassword,
      role,
    });

    // Save the new user
    const savedUser = await newUser.save();

    try {
      // Use the saved user's ID for the patient
      const newPatient = new Patient({
        patient_firstName,
        patient_lastName,
        patient_idNumber,
        patient_dob,
        patient_gender,
        contact_number,
        address,
        user_id: savedUser._id, // Linking the patient to the newly created user
      });

      // Save the new patient
      const savedPatient = await newPatient.save();

      await createNotification(
        currentUserId,
        "New Patient Registered",
        `A new patient has been added to the system by the admin. Please review the patient's details for any necessary actions`
      );
      // Send a notification to the new user
      await createNotification(
        savedUser._id,
        "Welcome to Mediclinic Center!",
        `Welcome, ${username}!\n\nThank you for signing up with Mediclinic Center. We are delighted to have you join us.\n\nAt Mediclinic Center, we strive to provide top-quality healthcare services to our patients. Should you have any questions or need assistance, please feel free to reach out.\n\nBest regards,\nThe Mediclinic Center Team`
      );
      // Respond with the new patient data
      response.status(201).json(savedPatient);
    } catch (rollError) {
      // Error occurred while creating role-specific data
      await User.findByIdAndDelete(savedUser._id);
      return next(
        errorHandler(
          500,
          "An error occurred while creating role-specific data."
        )
      );
    }
  } catch (error) {
    next(errorHandler(500, "Error creating patient and user"));
  }
};

// Update a patient
export const updatePatient = async (request, response, next) => {
  const patientId = request.params.id;
  const {
    patient_firstName,
    patient_lastName,
    patient_idNumber,
    patient_dob,
    patient_gender,
    contact_number,
    address,
  } = request.body;
  try {
    // Accessing current patient user ID
    const currentUserId = request.user._id;
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        patient_firstName,
        patient_lastName,
        patient_idNumber,
        patient_dob,
        patient_gender,
        contact_number,
        address,
      },
      { new: true, runValidators: true }
    );
    if (!updatedPatient) {
      return next(errorHandler(404, "Patient not found"));
    }

    // Send a notification to the new user
    await createNotification(
      currentUserId,
      "Profile Update Confirmation",
      `Dear ${patient_firstName} ${patient_lastName}, your profile has been successfully updated. Please review your updated profile information to ensure everything is correct. If you have any questions or notice any discrepancies, please contact our support team. Thank you for keeping your information current.`
    );
    response.status(200).json(updatedPatient);
  } catch (error) {
    next(errorHandler(500, "Error updating patient"));
  }
};

// Delete a patient
export const deletePatient = async (request, response, next) => {
  const patientId = request.params.id;

  try {
    // Access all admin user IDs
    const adminUsers = await User.find({ role: "admin" });

    if (!adminUsers || adminUsers.length === 0) {
      return next(errorHandler(404, "Admin users not found"));
    }
    // Find the patient by ID to get the user_id
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return next(errorHandler(404, "Patient not found"));
    }

    // Retrieve the user_id from the patient document
    const userId = patient.user_id;

    // Find and delete all appointments associated with the patient
    const deletedAppointments = await Appointment.deleteMany({
      patient_id: patientId,
    });

    // Delete the patient
    await Patient.findByIdAndDelete(patientId);
    // Delete related notifications
    await Notification.deleteMany({ user_id: userId });

    // Delete the associated user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return next(errorHandler(404, "Associated user with ID not found."));
    }

    // Send notifications to all admin users
    await Promise.all(
      adminUsers.map((adminUser) =>
        createNotification(
          adminUser._id,
          "Patient Account Deleted",
          `Patient ${patient.patient_firstName} ${patient.patient_lastName}'s account has been successfully deleted from our system. If you have any questions or need further assistance, please contact our support team. Thank you for being a part of our clinic.`
        )
      )
    );

    response.status(200).json({
      message:
        "Patient, associated user, and appointments deleted successfully",
      deletedAppointments: deletedAppointments.deletedCount,
    });
  } catch (error) {
    next(errorHandler(500, "Error deleting patient or associated user"));
  }
};

// Get patient details
export const getPatientDetails = async (request, response, next) => {
  const { id } = request.params;

  try {
    // Fetch patient details
    const patient = await Patient.findById(id).lean();

    if (!patient) {
      return next(errorHandler(404, "Patient not found"));
    }

    // Fetch related appointments, doctors, and departments
    const appointments = await Appointment.find({ patient_id: id })
      .populate({
        path: "doctor_id",
        select:
          "doctor_firstName doctor_lastName doctor_idNumber doctor_number department_id",
        populate: {
          path: "department_id",
          select: "department_name",
        },
      })
      .lean();

    // Construct response
    const patientDetails = {
      patient: {
        patient_id: patient._id,
        patient_firstName: patient.patient_firstName,
        patient_lastName: patient.patient_lastName,
        patient_idNumber: patient.patient_idNumber,
        patient_dob: patient.patient_dob,
        patient_gender: patient.patient_gender,
        contact_number: patient.contact_number,
        address: patient.address,
      },
      appointments: appointments.map((appt) => ({
        appointment_id: appt._id,
        appointment_date: appt.appointment_date,
        appointment_time: appt.appointment_time,
        appointment_type: appt.appointment_type,
        appointment_status: appt.appointment_status,
        doctor: {
          doctor_id: appt.doctor_id._id,
          doctor_firstName: appt.doctor_id.doctor_firstName,
          doctor_lastName: appt.doctor_id.doctor_lastName,
          doctor_idNumber: appt.doctor_id.doctor_idNumber,
          doctor_number: appt.doctor_id.doctor_number,
          department: {
            department_id: appt.doctor_id.department_id._id,
            department_name: appt.doctor_id.department_id.department_name,
          },
        },
      })),
    };

    response.status(200).json(patientDetails);
  } catch (error) {
    next(
      errorHandler(500, "Error retrieving patient details from the database")
    );
  }
};
