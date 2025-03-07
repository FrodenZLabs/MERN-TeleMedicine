import Department from "../models/department.model.js";
import { errorHandler } from "../utils/error.js";
import { createNotification } from "./notification.controller.js";

// Get all departments
export const getAllDepartments = async (request, response, next) => {
  try {
    const limit = parseInt(request.query.limit, 10) || 0;
    const { page = 1 } = request.query;
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    const searchTerm = request.query.searchTerm || "";

    // Create a filter for searching doctors
    const searchFilter = {
      $or: [{ department_name: { $regex: searchTerm, $options: "i" } }],
    };
    const departments = await Department.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    if (!departments.length) {
      return next(errorHandler(404, "Department name not found"));
    }

    const totalDepartments = await Department.countDocuments(searchFilter);
    response.status(200).json({ departments, totalDepartments, page, limit });
  } catch (error) {
    next(errorHandler(500, "Error retrieving departments from the database"));
  }
};

export const getDepartmentByID = async (request, response, next) => {
  const departmentId = request.params.id;
  try {
    const department = await Department.findById(departmentId).sort({
      createdAt: -1,
    });

    if (!department) {
      return next(errorHandler(404, "Department not found"));
    }
    response.status(200).json(department);
  } catch (error) {
    next(errorHandler(500, "Error retrieving departments from the database"));
  }
};

// Create a department
export const createDepartment = async (request, response, next) => {
  try {
    const { department_name, department_description } = request.body;
    if (!department_name) {
      return next(errorHandler(404, "Department name is required."));
    }
    // Accessing current admin user ID
    const currentUserId = request.user._id;

    const newDepartment = new Department({
      department_name,
      department_description,
    });
    await newDepartment.save();
    await createNotification(
      currentUserId,
      `Introducing ${department_name} Department`,
      `We are pleased to introduce the ${department_name} Department, offering comprehensive services and cutting-edge treatments.\n\n\n\n Our experts are ready to deliver specialized care and advanced medical services to our community.\n\n We offer state-of-the-art facilities and a team of experienced professionals to ensure the highest quality care.`
    );
    response.status(201).json("Department created successfully.");
  } catch (error) {
    next(errorHandler(500, "Error creating department"));
  }
};

// Update a department
export const updateDepartment = async (request, response, next) => {
  const departmentId = request.params.id;
  const { department_name, department_description } = request.body;
  try {
    // Accessing current admin user ID
    const currentUserId = request.user._id;

    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      { department_name, department_description },
      { new: true, runValidators: true }
    );
    if (!updatedDepartment) {
      return next(errorHandler(404, "Department not found"));
    }

    await createNotification(
      currentUserId,
      `Department Updated Successfully`,
      `The department details have been updated successfully by the admin. Please review the changes to ensure all information is accurate.`
    );
    response.status(200).json(updatedDepartment);
  } catch (error) {
    next(errorHandler(500, "Error updating department"));
  }
};

// Delete a department
export const deleteDepartment = async (request, response, next) => {
  const departmentId = request.params.id;

  try {
    // Accessing current admin user ID
    const currentUserId = request.user._id;

    // Find the department by ID to get the user_id
    const department = await Department.findById(departmentId);

    if (!department) {
      return next(errorHandler(404, "Department not found"));
    }

    // Delete the department
    await Department.findByIdAndDelete(departmentId);

    await createNotification(
      currentUserId,
      `Department Deleted Successfully`,
      `The department ${department.department_name} has been successfully deleted. All associated data has been removed. If you have any questions, please contact support`
    );
    response.status(200).json("Department deleted successfully");
  } catch (error) {
    next(errorHandler(500, "Error deleting Department"));
  }
};
