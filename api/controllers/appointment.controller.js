import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Payment from "../models/payment.model.js";
import Prescription from "../models/prescription.model.js";
import User from "../models/user.model.js";
import VideoConsultation from "../models/videoconsultation.model.js";
import { errorHandler } from "../utils/error.js";
import { createNotification } from "./notification.controller.js";
import { createVideoConsultation } from "./video.controller.js";
import moment from "moment";

// Get all appointments with department_name, doctor_name, and patient_name
export const getAllAppointments = async (request, response, next) => {
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;

  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    if (!appointments.length) {
      return next(errorHandler(404, "Appointment not found"));
    }
    const totalAppointments = await Appointment.countDocuments();
    const totalPendingAppointments = await Appointment.countDocuments({
      appointment_status: "Pending with admin",
    });
    const totalConfirmedAppointments = await Appointment.countDocuments({
      appointment_status: "Scheduled",
    });
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthAppointments = await Appointment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    response.status(200).json({
      appointments,
      totalAppointments,
      totalConfirmedAppointments,
      totalPendingAppointments,
      lastMonthAppointments,
      page,
      limit,
    });
  } catch (error) {
    next(errorHandler(500, "Error retrieving appointments from the database"));
  }
};

// Get an appointment by ID with department_name, doctor_name, and patient_name
export const getAppointmentByID = async (request, response, next) => {
  const appointmentId = request.params.id;
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    if (!appointment) {
      return next(errorHandler(404, "Appointment not found"));
    }
    response.status(200).json(appointment);
  } catch (error) {
    next(errorHandler(500, "Error retrieving appointments from the database"));
  }
};

// Get an appointment by Doctor ID with department_name, doctor_name, and patient_name
export const getAppointmentByDoctorID = async (request, response, next) => {
  const doctorId = request.params.doctor_id;
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;

  try {
    const appointments = await Appointment.find({ doctor_id: doctorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName contact_number user_id",
        populate: { path: "user_id", select: "email" },
      })
      .lean();

    if (!appointments.length) {
      return next(errorHandler(404, "Appointment not found"));
    }

    // Fetch the completed appointment
    const completeAppointment = await Appointment.findOne({
      doctor_id: doctorId,
      appointment_status: "Completed",
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    // Fetch the latest "Scheduled" appointment
    const scheduledAppointment = await Appointment.findOne({
      doctor_id: doctorId,
      appointment_status: "Scheduled",
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    if (!appointments && !completeAppointment && !scheduledAppointment) {
      return next(errorHandler(404, "Appointments not found for this doctor"));
    }
    const totalAppointments = await Appointment.find({
      doctor_id: doctorId,
    }).countDocuments();

    response.status(200).json({
      appointments,
      totalAppointments,
      completeAppointment,
      scheduledAppointment,
      page,
      limit,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error retrieving appointments from the database"));
  }
};

// Get an appointment by Patient ID
export const getAppointmentByPatientID = async (request, response, next) => {
  const patientId = request.params.patient_id;
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page } = request.query;
  const skip = (page - 1) * limit;

  if (!patientId) {
    return next(errorHandler(400, "Patient ID is required"));
  }
  try {
    const appointment = await Appointment.find({
      patient_id: patientId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName user_id",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName user_id",
      })
      .lean();

    if (!appointment.length) {
      return next(errorHandler(404, "Appointment not found"));
    }
    // Fetch the latest "Pending with admin" appointment
    const pendingAppointment = await Appointment.findOne({
      patient_id: patientId,
      appointment_status: "Pending with admin",
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    // Fetch the latest "Scheduled" appointment
    const scheduledAppointment = await Appointment.findOne({
      patient_id: patientId,
      appointment_status: "Scheduled",
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    if (!appointment && !pendingAppointment && !scheduledAppointment) {
      return next(errorHandler(404, "Patient Appointments not found"));
    }

    const totalAppointments = await Appointment.find({
      patient_id: patientId,
    }).countDocuments();
    response.status(200).json({
      appointment,
      totalAppointments,
      pendingAppointment,
      scheduledAppointment,
      page,
      limit,
    });
  } catch (error) {
    console.log(error);
    next(
      errorHandler(
        500,
        "Error retrieving patient appointments from the database"
      )
    );
  }
};

// Create a new appointment
export const createAppointment = async (request, response, next) => {
  const {
    patient_id,
    department_id,
    appointment_date,
    appointment_time,
    appointment_type,
  } = request.body;

  // Set default values for doctor_id and appointment_status
  const doctor_id = null; // Doctor is not assigned initially
  const appointment_status = "Pending with admin"; // Default status
  // Accessing current patient user ID
  const currentUserId = request.user._id;

  try {
    // Parse the appointment time correctly and format in AM/PM
    const parsedAppointmentTime = moment(appointment_time, "HH:mm").format(
      "h:mm A"
    );

    const newAppointment = new Appointment({
      patient_id,
      doctor_id,
      department_id,
      appointment_date,
      appointment_time: parsedAppointmentTime,
      appointment_status,
      appointment_type,
    });
    const savedAppointment = await newAppointment.save();
    // Format appointment date and time using Moment.js
    const formattedDate = moment(appointment_date).format("LL");
    const formattedTime = moment(parsedAppointmentTime, "h:mm A").format("LT");
    await createNotification(
      currentUserId,
      "Appointment Booked Successfully",
      `Appointment booked for ${formattedDate} at ${formattedTime}. Thank you for scheduling your appointment with us.`
    );
    response.status(201).json(savedAppointment);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error creating appointment"));
  }
};

// Update an appointment
export const updateAppointment = async (request, response, next) => {
  const appointmentId = request.params.id;
  const {
    patient_id,
    doctor_id,
    department_id,
    appointment_date,
    appointment_time,
    appointment_status,
    appointment_type,
  } = request.body;
  try {
    // Accessing current patient user ID
    const currentUserId = request.user._id;
    // Fetch the current appointment
    const previousAppointment = await Appointment.findById(appointmentId);
    if (!previousAppointment) {
      return next(errorHandler(404, "Appointment not found"));
    }
    console.log("Current User:", currentUserId);

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        patient_id,
        doctor_id,
        department_id,
        appointment_date,
        appointment_time,
        appointment_status,
        appointment_type,
      },
      { new: true, runValidators: true }
    );
    const isCreateVideoLink =
      updatedAppointment.appointment_status === "Scheduled" &&
      updatedAppointment.appointment_type === "Online";

    if (!updatedAppointment) {
      return next(errorHandler(404, "Appointment not found"));
    }
    // Handle video consultation link creation
    if (isCreateVideoLink) {
      const isSuccess = await createVideoConsultation(
        {
          body: {
            patient_id: updatedAppointment.patient_id._id,
            doctor_id,
            appointment_id: updatedAppointment._id,
          },
          user: request.user,
        },
        next
      );
      if (!isSuccess) {
        return next(errorHandler(500, "Error creating video link"));
      }
    }
    // Format appointment date and time using Moment.js
    const formattedDate = moment(appointment_date).format("LL");
    const formattedTime = moment(appointment_time, "h:mm A").format("LT");
    // Fetch the patient information
    const patient = await Patient.findById(patient_id).populate("user_id");
    const patientUserId = patient.user_id._id;

    // Fetch the doctor information
    const doctor = await Doctor.findById(doctor_id).populate("user_id");
    console.log("Doctor ID: ", doctor_id);
    console.log("Doctor: ", doctor);

    const doctorUserId = doctor.user_id._id;

    // Create notifications for both the admin,doctor and the patient
    await createNotification(
      currentUserId,
      "Appointment Scheduled Successfully",
      `You have scheduled an appointment for patient ${patient.patient_firstName} ${patient.patient_lastName} with Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName} on ${formattedDate} at ${formattedTime}.`
    );

    await createNotification(
      doctorUserId,
      "New Appointment Scheduled",
      `You have a new appointment with patient ${patient.patient_firstName} ${patient.patient_lastName} on ${formattedDate} at ${formattedTime}.`
    );

    await createNotification(
      patientUserId,
      "Your Appointment is Scheduled",
      `Your appointment with Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName} has been scheduled on ${formattedDate} at ${formattedTime}.`
    );
    response.status(200).json(updatedAppointment);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error updating appointment"));
  }
};

// Delete an appointment
export const deleteAppointment = async (request, response, next) => {
  const appointmentId = request.params.id;

  try {
    const appointment = await Appointment.findById(appointmentId).populate(
      "patient_id doctor_id appointment_date appointment_time"
    );

    if (!appointment) {
      return next(errorHandler(404, "Appointment not found"));
    }

    const patient = appointment.patient_id;
    const doctor = appointment.doctor_id;
    const appointmentDate = moment(appointment.appointment_date).format("LL");
    const appointmentTime = moment(
      appointment.appointment_time,
      "h:mm A"
    ).format("LT");

    if (doctor) {
      await createNotification(
        doctor.user_id,
        "Appointment Cancellation Notice",
        `Your appointment with patient ${patient.patient_firstName} ${patient.patient_lastName} scheduled for ${appointmentDate} at ${appointmentTime} has been successfully deleted. Please check your schedule for any updates.`
      );
    }
    await createNotification(
      patient.user_id,
      "Appointment Cancellation Confirmation",
      `Your appointment${
        doctor
          ? ` with Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName}`
          : ""
      } scheduled for ${appointmentDate} at ${appointmentTime} has been successfully canceled. Please contact us to reschedule or for any further assistance.`
    );

    // Fetch all admin users
    const admins = await User.find({ role: "admin" });

    // Send notification to all admins
    for (const admin of admins) {
      await createNotification(
        admin._id,
        "Appointment Deleted",
        `An appointment scheduled for ${appointmentDate} at ${appointmentTime} with patient ${
          patient.patient_firstName
        } ${patient.patient_lastName}${
          doctor
            ? ` and Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName}`
            : ""
        } has been successfully deleted.`
      );
    }

    // Delete related payments
    await Payment.deleteMany({ appointment_id: appointmentId });
    // Delete related prescriptions
    await Prescription.deleteMany({ appointment_id: appointmentId });
    // Delete related video consultations
    await VideoConsultation.deleteMany({ appointment_id: appointmentId });

    // Delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);
    response.status(200).json("Appointment deleted successfully");
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error deleting appointment"));
  }
};

// API endpoint to fetch all reports
export const getAllReports = async (request, response, next) => {
  try {
    // Query 1: Revenue by month
    const revenueData = await Appointment.find({
      appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
    })
      .populate({
        path: "payments",
        match: {
          appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
        },
        select: "payment_amount appointment_date",
      })
      .then((appointments) => {
        return appointments.reduce((acc, appointment) => {
          const month = appointment.appointment_date.toLocaleString("default", {
            month: "short",
          });
          const revenue = appointment.payments.reduce(
            (sum, payment) => sum + payment.payment_amount,
            0
          );
          if (!acc[month]) {
            acc[month] = 0;
          }
          acc[month] += revenue;
          return acc;
        }, {});
      });

    // Convert revenueData to array of objects for consistency
    const revenueResult = Object.keys(revenueData).map((month) => ({
      month,
      revenue: revenueData[month],
    }));

    // Query 2: Appointments by department
    const departmentsData = await Appointment.find({
      appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
    })
      .populate({
        path: "department_id",
        select: "department_name",
      })
      .then((appointments) => {
        return appointments.reduce((acc, appointment) => {
          const departmentName = appointment.department_id.department_name;
          if (!acc[departmentName]) {
            acc[departmentName] = 0;
          }
          acc[departmentName]++;
          return acc;
        }, {});
      });

    // Convert departmentsData to array of objects for consistency
    const departmentsResult = Object.keys(departmentsData).map(
      (departmentName) => ({
        label: departmentName,
        appointments: departmentsData[departmentName],
      })
    );

    // Query 3: Appointments by doctor
    const doctorsData = await Appointment.find({
      appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
    })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .then((appointments) => {
        return appointments.reduce((acc, appointment) => {
          const doctorName = `${appointment.doctor_id.doctor_firstName} ${appointment.doctor_id.doctor_lastName}`;
          if (!acc[doctorName]) {
            acc[doctorName] = 0;
          }
          acc[doctorName]++;
          return acc;
        }, {});
      });

    // Convert doctorsData to array of objects for consistency
    const doctorsResult = Object.keys(doctorsData).map((doctorName) => ({
      doctor: doctorName,
      appointments: doctorsData[doctorName],
    }));

    // Query 4: Appointments by age group
    const ageGroupData = await Appointment.find({
      appointment_status: { $in: ["Scheduled", "Completed", "Follow-up"] },
    })
      .populate({
        path: "patient_id",
        select: "patient_dob",
      })
      .then((appointments) => {
        return appointments.reduce((acc, appointment) => {
          const patientAge = Math.floor(
            (Date.now() -
              new Date(appointment.patient_id.patient_dob).getTime()) /
              (1000 * 60 * 60 * 24 * 365.25)
          );
          let ageGroup;
          if (patientAge < 18) {
            ageGroup = "Children";
          } else if (patientAge >= 18 && patientAge <= 65) {
            ageGroup = "Adults";
          } else if (patientAge > 65) {
            ageGroup = "Seniors";
          } else {
            ageGroup = "Unknown";
          }
          if (!acc[ageGroup]) {
            acc[ageGroup] = 0;
          }
          acc[ageGroup]++;
          return acc;
        }, {});
      });

    // Convert ageGroupData to array of objects for consistency
    const ageGroupResult = Object.keys(ageGroupData).map((ageGroup) => ({
      age_group: ageGroup,
      appointments: ageGroupData[ageGroup],
    }));

    // Sending the aggregated data as response
    response.status(200).json({
      revenue: revenueResult,
      departments: departmentsResult,
      doctors: doctorsResult,
      ageGroup: ageGroupResult,
    });
  } catch (error) {
    next(errorHandler(500, "Error fetching reports"));
  }
};
