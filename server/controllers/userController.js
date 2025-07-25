import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/users.js";
import { Admin } from "../models/admins.js";
import { Employer } from "../models/employer.js";
import { deleteAllApplicationsWithJobId, revokeAllApplications } from "../utils/applicationUtilities.js";
import { delAllNotifications } from "../utils/notificationUtilities.js";
import { deleteAllJobs } from "../utils/jobUtilities.js";

const SALT_ROUNDS = 10;

// User Section

// Add a new user

export async function addUser(req, res) {
  try {
    const { name, email, password, preferredDomain } = req.body;
    console.log("Attempting to add user:", { name, email });

    if (!name || !email || !password) {
      console.warn("Missing required fields");
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Check if email exists in either User or Employer collection
    const existingUser = await User.findOne({ email });
    const existingEmployer = !existingUser
      ? await Employer.findOne({ email })
      : null;

    if (existingUser || existingEmployer) {
      console.warn(`Email already registered in system: ${email}`);
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({ name, email, password: hashedPassword, preferredDomain });

    const savedUser = await newUser.save();
    console.log("User successfully saved:", savedUser._id);

    const userToReturn = savedUser.toObject();
    delete userToReturn.password;

    return res.status(201).json({
      message: "User added successfully",
      user: userToReturn,
    });
  } catch (err) {
    console.error("Error adding user:", err);
    return res.status(500).json({
      message: "Internal server error while adding user",
      error: err.message || err,
    });
  }
}

// Get user data by ID

export async function getUserData(req, res) {
  try {
    const userId = req.params.userId;
    console.log("Fetching user data for ID:", userId);

    if (!userId) {
      console.warn("No userId provided in request");
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn(`User not found for ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const userToReturn = user.toObject();
    delete userToReturn.password;

    console.log("User data retrieved successfully for:", userId);
    return res.status(200).json({
      message: "User data retrieved successfully",
      user: userToReturn,
    });
  } catch (err) {
    console.error("Error retrieving user data:", err);
    return res.status(500).json({
      message: "Error retrieving user data",
      error: err.message || err,
    });
  }
}

// Update user data by ID

export async function updateUserData(req, res) {
  try {
    const userId = req.params.userId;
    let updatedData = { ...req.body };
    console.log(
      "Updating user data for ID:",
      userId,
      "with data:",
      updatedData
    );

    if (!userId) {
      console.warn("No userId provided for update");
      return res.status(400).json({ message: "User ID is required" });
    }

    delete updatedData._id;
    delete updatedData.__v;
    delete updatedData.createdAt;
    delete updatedData.updatedAt;

    if (updatedData.password) {
      console.log("Hashing updated password for user ID:", userId);
      updatedData.password = await bcrypt.hash(
        updatedData.password,
        SALT_ROUNDS
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.warn(`User not found for update with ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const userToReturn = updatedUser.toObject();
    delete userToReturn.password;

    console.log("User updated successfully for ID:", userId);
    return res.status(200).json({
      message: "User updated successfully",
      user: userToReturn,
    });
  } catch (err) {
    console.error("Error updating user data:", err);
    return res.status(500).json({
      message: "Error updating user data",
      error: err.message || err,
    });
  }
}

// Delete user by ID

export async function deleteUserData(req, res) {
  try {
    const userId = req.params.userId;
    console.log("Attempting to delete user with ID:", userId);

    if (!userId) {
      console.warn("User ID not provided for deletion");
      return res.status(400).json({ message: "User ID is required" }); // 400 is more appropriate here
    }

    await revokeAllApplications(userId);

    await delAllNotifications(userId);

    const userDeleteResult = await User.deleteOne({ _id: userId });

    if (userDeleteResult.deletedCount === 0) {
      console.warn(`Failed to delete user with ID: ${userId}`);
      return res.status(404).json({ message: "Failed to delete user" });
    }

    console.log(`User with ID ${userId} deleted successfully`);
    return res.status(200).json({
      message: "User and associated applications deleted successfully",
      deletedApplications: appDeleteResult.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({
      message: "Some error occurred",
      error: err.message || err,
    });
  }
}

// Employer Section

// Add a new employer

export async function addEmployer(req, res) {
  try {
    const { name, email, password, company } = req.body;
    console.log("Adding new employer:", { name, email, company });

    if (!name || !email || !password) {
      console.warn("Missing required employer fields");
      return res.status(400).json({
        message: "Name, email, password, and company name are required",
      });
    }

    // Check for existing email in Employer and User collections
    const existingEmployer = await Employer.findOne({ email });
    const existingUser = !existingEmployer
      ? await User.findOne({ email })
      : null;

    if (existingEmployer || existingUser) {
      console.warn(`Email already registered in system: ${email}`);
      return res.status(409).json({
        message: `An account already exists with this ${email}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newEmployer = new Employer({
      name,
      email,
      password: hashedPassword,
      company,
    });

    const savedEmployer = await newEmployer.save();
    console.log("Employer successfully saved with ID:", savedEmployer._id);

    const employerToReturn = savedEmployer.toObject();
    delete employerToReturn.password;

    return res.status(201).json({
      message: "Employer added successfully",
      employer: employerToReturn,
    });
  } catch (err) {
    console.error("Error adding employer:", err);
    return res.status(500).json({
      message: "Internal server error while adding employer",
      error: err.message || err,
    });
  }
}

// Get employer data by ID

export async function getEmployerData(req, res) {
  try {
    const employerId = req.params.employerId;
    console.log("Fetching employer data for ID:", employerId);

    if (!employerId) {
      console.warn("No employerId provided in request");
      return res.status(400).json({ message: "Employer ID is required" });
    }

    const employer = await Employer.findById(employerId);
    if (!employer) {
      console.warn("Employer not found for ID:", employerId);
      return res.status(404).json({ message: "Employer not found" });
    }

    const employerToReturn = employer.toObject();
    delete employerToReturn.password;

    console.log("Employer data successfully retrieved for ID:", employerId);
    return res.status(200).json({
      message: "Employer data retrieved successfully",
      employer: employerToReturn,
    });
  } catch (err) {
    console.error("Error retrieving employer data:", err);
    return res.status(500).json({
      message: "Error retrieving employer data",
      error: err.message || err,
    });
  }
}

// Update employer data by ID

export async function updateEmployerData(req, res) {
  try {
    const employerId = req.params.employerId;
    let updatedData = { ...req.body };
    console.log(
      "Updating employer data for ID:",
      employerId,
      "Data:",
      updatedData
    );

    if (!employerId) {
      console.warn("No employerId provided for update");
      return res.status(400).json({ message: "Employer ID is required" });
    }

    delete updatedData._id;
    delete updatedData.__v;
    delete updatedData.createdAt;
    delete updatedData.updatedAt;

    if (updatedData.password) {
      console.log("Hashing new password for employer ID:", employerId);
      updatedData.password = await bcrypt.hash(
        updatedData.password,
        SALT_ROUNDS
      );
    }

    const updatedUser = await Employer.findByIdAndUpdate(
      employerId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.warn("Employer not found for update:", employerId);
      return res.status(404).json({ message: "User not found" });
    }

    const userToReturn = updatedUser.toObject();
    delete userToReturn.password;

    console.log("Employer updated successfully:", employerId);
    return res.status(200).json({
      message: "User updated successfully",
      user: userToReturn,
    });
  } catch (err) {
    console.error("Error updating employer data:", err);
    return res.status(500).json({
      message: "Error updating user data",
      error: err.message || err,
    });
  }
}

// Delete Employer by ID

export async function deleteEmployerData(req, res) {
  try {
    const employerId = req.params.employerId;
    console.log("Attempting to delete employer with ID:", employerId);

    if (!employerId) {
      console.warn("No employerId provided for deletion");
      return res.status(400).json({ message: "Employer ID is required" });
    }

    await deleteAllApplicationsWithJobId(employerId);

    await deleteAllJobs(employerId);

    // Step 2: Delete the employer
    const result = await Employer.deleteOne({ _id: employerId });

    if (result.deletedCount === 0) {
      console.warn("Failed to delete employer - not found:", employerId);
      return res.status(404).json({ message: "Failed to delete employer" });
    }

    console.log("Employer deleted successfully:", employerId);
    return res.status(200).json({
      message: "Employer and associated jobs deleted successfully",
      deletedJobs: result.deletedCount,
    });
  } catch (err) {
    console.error("Error occurred while deleting employer:", err);
    return res.status(500).json({
      message: "Some error occurred",
      error: err.message || err,
    });
  }
}

// Admin Section

// Add a new admin

export async function addAdmin(req, res) {
  try {
    const { name, email, password } = req.body;
    console.log("Adding new admin:", { name, email });

    if (!name || !email || !password) {
      console.warn("Missing required admin fields");
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check for existing admin or user with the same email
    const existingAdmin = await Admin.findOne({ email });
    const existingUser = !existingAdmin
      ? await User.findOne({ email })
      : null;
    const existingEmployer = !existingUser
      ? await Employer.findOne({ email })
      : null;

    if (existingAdmin || existingUser || existingEmployer) {
      console.warn(`Email already registered in system: ${email}`);
      return res.status(409).json({
        message: `An account already exists with this ${email}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newAdmin = new Admin({ name, email, password: hashedPassword });

    const savedAdmin = await newAdmin.save();
    console.log("Admin successfully saved with ID:", savedAdmin._id);

    const adminToReturn = savedAdmin.toObject();
    delete adminToReturn.password;

    return res.status(201).json({
      message: "Admin added successfully",
      admin: adminToReturn,
    });
  } catch (err) {
    console.error("Error adding admin:", err);
    return res.status(500).json({
      message: "Internal server error while adding admin",
      error: err.message || err,
    });
  }
}

// Get admin data by ID

export async function getAdminData(req, res) {
  try {
    const adminId = req.params.adminId;
    console.log("Fetching admin data for ID:", adminId);

    if (!adminId) {
      console.warn("No adminId provided in request");
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      console.warn("Admin not found for ID:", adminId);
      return res.status(404).json({ message: "Admin not found" });
    }

    const adminToReturn = admin.toObject();
    delete adminToReturn.password;

    console.log("Admin data successfully retrieved for ID:", adminId);
    return res.status(200).json({
      message: "Admin data retrieved successfully",
      admin: adminToReturn,
    });
  } catch (err) {
    console.error("Error retrieving admin data:", err);
    return res.status(500).json({
      message: "Error retrieving admin data",
      error: err.message || err,
    });
  }
}