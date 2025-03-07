import mongoose from "mongoose";

// Define department Schema
const departmentSchema = new mongoose.Schema(
  {
    department_name: {
      type: String,
      requred: true,
      unique: true,
    },
    department_description: {
      type: String,
      requred: true,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
