import VideoConsultation from "../models/videoconsultation.model.js";
import { errorHandler } from "../utils/error.js";
import { generateJitsiMeetLink } from "../utils/generateJitsiMeetLink.js";
import mongoose from "mongoose";
import { createNotification } from "./notification.controller.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";

// Get Video consultation by Doctor Id
export const getVideoConsultationsByDoctorId = async (
  request,
  response,
  next
) => {
  const doctorId = request.params.doctor_id;
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;

  try {
    const videoConsultations = await VideoConsultation.find({
      doctor_id: doctorId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_time appointment_date",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    if (!videoConsultations.length) {
      return next(errorHandler(404, `Video Consultations database is empty.`));
    }
    const totalVideoConsultations = await VideoConsultation.find({
      doctor_id: doctorId,
    }).countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthVideoConsultations = await VideoConsultation.find({
      doctor_id: doctorId,
    }).countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    response.status(200).json({
      videoConsultations,
      totalVideoConsultations,
      lastMonthVideoConsultations,
      page,
      limit,
    });
  } catch (error) {
    next(errorHandler(500, "Error retrieving video consultations"));
  }
};

// Get Video Consultation by Patient Id
export const getVideoConsultationsByPatientId = async (
  request,
  response,
  next
) => {
  const patientId = request.params.patient_id;
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;

  if (!patientId) {
    return next(errorHandler(400, "Patient ID is required"));
  }
  try {
    const videoConsultations = await VideoConsultation.find({
      patient_id: patientId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_time appointment_date",
      })
      .populate({
        path: "doctor_id",
        select: "doctor_firstName doctor_lastName",
      })
      .lean();

    if (!videoConsultations.length) {
      return next(
        errorHandler(404, "No video consultations found for this patient")
      );
    }

    const totalVideoConsultations = await VideoConsultation.find({
      patient_id: patientId,
    }).countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthVideoConsultations = await VideoConsultation.find({
      patient_id: patientId,
    }).countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    response.status(200).json({
      videoConsultations,
      totalVideoConsultations,
      lastMonthVideoConsultations,
      page,
      limit,
    });
  } catch (error) {
    next(errorHandler(500, "Error retrieving video consultations"));
  }
};

// Create Video Consultation
export const createVideoConsultation = async (request, next) => {
  try {
    // Generate Jitsi Meet link
    const videoConsultationLink = generateJitsiMeetLink();

    // Extract data from request body
    const { patient_id, doctor_id, appointment_id } = request.body;
    // Accessing current patient user ID
    const currentUserId = request.user._id;

    // Validate ObjectId for required fields
    const isValidObjectId = mongoose.Types.ObjectId.isValid;
    if (
      !isValidObjectId(patient_id) ||
      !isValidObjectId(doctor_id) ||
      !isValidObjectId(appointment_id)
    ) {
      return next(errorHandler(400, "Invalid ObjectId"));
    }

    // Create new VideoConsultation object
    const newVideoConsultation = new VideoConsultation({
      patient_id,
      doctor_id,
      appointment_id,
      video_consultation_link: videoConsultationLink,
      consultation_status: "PENDING VIDEO CONSULTATION",
    });

    // Save the new video consultation to the database
    const savedConsultation = await newVideoConsultation.save();
    // Fetch the patient information
    const patient = await Patient.findById(patient_id).populate("user_id");
    const patientUserId = patient.user_id._id;

    // Fetch the doctor information
    const doctor = await Doctor.findById(doctor_id).populate("user_id");
    const doctorUserId = doctor.user_id._id;

    // Create notifications for both the admin,doctor and the patient
    await createNotification(
      currentUserId,
      "Video Consultation Scheduled",
      `A video consultation has been scheduled for ${patient.patient_firstName} ${patient.patient_lastName} with Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName}. Click here ${videoConsultationLink} to join the consultation.`
    );

    await createNotification(
      doctorUserId,
      "Upcoming Video Consultation",
      `You have a scheduled video consultation with ${patient.patient_firstName} ${patient.patient_lastName}. Click here ${videoConsultationLink} to join the consultation.`
    );

    await createNotification(
      patientUserId,
      "Your Appointment is Scheduled",
      `Your video consultation with Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName} is scheduled successfully. Click here ${videoConsultationLink} to join the consultation.`
    );

    return savedConsultation;
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Error creating video consultation"));
  }
};

// Get all Video Consultations
export const getAllVideoConsultations = async (request, response, next) => {
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;
  try {
    const videoConsultations = await VideoConsultation.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_time appointment_date",
        populate: {
          path: "doctor_id",
          select: "doctor_firstName doctor_lastName",
        },
      })
      .lean();

    if (!videoConsultations.length) {
      return next(errorHandler(404, `Video Consultations database is empty.`));
    }
    const totalVideoConsultations = await VideoConsultation.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthVideoConsultations = await VideoConsultation.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    response.status(200).json({
      videoConsultations,
      totalVideoConsultations,
      lastMonthVideoConsultations,
      page,
      limit,
    });
  } catch (error) {
    next(errorHandler(500, "Failed to retrieve video consultations"));
  }
};

// Get Video Consultation by Id
export const getVideoConsultationById = async (request, response, next) => {
  const videoConsultationId = request.params.id;

  try {
    const videoConsultation = await VideoConsultation.findById(
      videoConsultationId
    )
      .populate({
        path: "patient_id",
        select: "patient_firstName patient_lastName",
      })
      .populate({
        path: "appointment_id",
        select: "appointment_time appointment_date",
        populate: {
          path: "doctor_id",
          select: "doctor_firstName doctor_lastName",
        },
      })
      .lean();

    if (!videoConsultation) {
      return next(errorHandler(404, "Video consultation not found"));
    }

    response.status(200).json(videoConsultation);
  } catch (error) {
    next(errorHandler(500, "Failed to retrieve video consultation"));
  }
};

// Update Video Consultation
export const updateVideoConsultation = async (request, response, next) => {
  const videoConsultationId = request.params.id;
  const { patient_id, doctor_id, consultation_status } = request.body;

  try {
    const updatedConsultation = await VideoConsultation.findByIdAndUpdate(
      videoConsultationId,
      {
        patient_id,
        doctor_id,
        consultation_status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedConsultation) {
      return next(errorHandler(404, "Video consultation not found"));
    }

    // Fetch the patient information
    const patient = await Patient.findById(patient_id).populate("user_id");
    if (!patient || !patient.user_id) {
      console.log("Patient or Patient user not found");
    }
    const patientUserId = patient.user_id._id;

    // Fetch the doctor information
    const doctor = await Doctor.findById(doctor_id).populate("user_id");
    if (!doctor || !doctor.user_id) {
      console.log(404, "Doctor or Doctor user not found");
    }
    const doctorUserId = doctor.user_id._id;

    await createNotification(
      doctorUserId,
      "Video Consultation Updated",
      `Your video consultation with patient ${patient.patient_firstName} ${patient.patient_lastName} has been updated. Please review the new details in your schedule. If you have any questions, contact the support team.`
    );

    await createNotification(
      patientUserId,
      "Video Consultation Updated",
      `Your video consultation with Dr. ${doctor.doctor_firstName} ${doctor.doctor_lastName} has been updated. Please check your account for the latest appointment details. If you have any questions, contact our support team.`
    );
    response.status(200).json(updatedConsultation);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Failed to update video consultation"));
  }
};
