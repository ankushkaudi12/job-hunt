import { Router } from "express";
import {
  addUser,
  addEmployer,
  getEmployerData,
  getUserData,
  updateUserData,
  updateEmployerData,
  deleteUserData,
  deleteEmployerData,
  addAdmin,
  getAdminData,
} from "../controllers/userController.js";
import { loginUser, refreshAccessToken } from "../controllers/loginController.js";
import {
  addJob,
  deleteJob,
  updateJob,
  getJobsSummaryForEmployer,
  getJobsByDomain,
  getJobById,
  getJobsForEmployer,
  searchJobsForUsers,
} from "../controllers/jobsController.js";
import {
  applyForJob,
  updateApplicationStatus,
  getUserAppliedJobs,
  revokeSingleApplication,
} from "../controllers/applicationController.js";
import { getUserNotifications, clearNotifications } from "../controllers/notificationsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/authMiddleware.js";
import {
  getApplicationsByDomain,
  getApplicationsDataForEmployerBasedOnStatus,
  getApplicationsDataForUserBasedOnStatus,
} from "../controllers/chartsDataController.js";
import { isCommonPassword } from "../utils/passwordCheckUtility.js";

const router = Router();

// POST methods

/**
 * @swagger
 * /addUser:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongP@ssw0rd!
 *               preferredDomain:
 *                 type: string
 *                 example: software engineering
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User added successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60f7d9c2e3f4a45bfc2e2e91
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     preferredDomain:
 *                       type: string
 *                       example: software engineering
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Name, email, and password are required
 *       409:
 *         description: Email already exists in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An account with this email already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error while adding user
 *                 error:
 *                   type: string
 *                   example: Error details here
 */
router.post("/addUser", addUser);

/**
 * @swagger
 * /addEmployer:
 *   post:
 *     summary: Register a new employer
 *     tags:
 *       - Employers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - company
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice Johnson
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@techfirm.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *               company:
 *                 type: string
 *                 example: TechFirm Inc.
 *     responses:
 *       201:
 *         description: Employer successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employer added successfully
 *                 employer:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60f7e9c2a3f4a45abc1d3f12
 *                     name:
 *                       type: string
 *                       example: Alice Johnson
 *                     email:
 *                       type: string
 *                       example: alice@techfirm.com
 *                     company:
 *                       type: string
 *                       example: TechFirm Inc.
 *       400:
 *         description: Missing required employer fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Name, email, password, and company name are required
 *       409:
 *         description: Email already registered in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An account already exists with this alice@techfirm.com
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error while adding employer
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
router.post("/addEmployer", addEmployer);

/**
 * @swagger
 * /addAdmin:
 *   post:
 *     summary: Register a new admin
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Michael Scott
 *               email:
 *                 type: string
 *                 format: email
 *                 example: michael@dundermifflin.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: PaperBoss@2024
 *     responses:
 *       201:
 *         description: Admin successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin added successfully
 *                 admin:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f9c65bcf1e3b2f0c7a1111
 *                     name:
 *                       type: string
 *                       example: Michael Scott
 *                     email:
 *                       type: string
 *                       example: michael@dundermifflin.com
 *       400:
 *         description: Missing required admin fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Name, email, and password are required
 *       409:
 *         description: Email already registered in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An account already exists with this michael@dundermifflin.com
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error while adding admin
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/addAdmin", addAdmin);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user, employer, or admin
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MySecurePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refresh_token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60f7d9c2e3f4a45bfc2e2e91
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       enum: [user, employer, admin]
 *                       example: user
 *                     name:
 *                       type: string
 *                       example: John Doe
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /addJob:
 *   post:
 *     summary: Add a new job listing (Employer only)
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - employerId
 *               - employerName
 *               - domain
 *               - description
 *               - company
 *               - location
 *               - type
 *               - experience
 *               - vacancies
 *             properties:
 *               title:
 *                 type: string
 *                 example: Full Stack Developer
 *               employerId:
 *                 type: string
 *                 example: 64f8e2f7aabc12345678abcd
 *               employerName:
 *                 type: string
 *                 example: John Employer
 *               domain:
 *                 type: string
 *                 example: Software Engineering
 *               description:
 *                 type: object
 *                 required:
 *                   - overview
 *                   - responsibilities
 *                   - requiredSkills
 *                 properties:
 *                   overview:
 *                     type: string
 *                     example: We are looking for a Full Stack Developer to join our team...
 *                   responsibilities:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Develop and maintain web applications", "Collaborate with cross-functional teams"]
 *                   requiredSkills:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["JavaScript", "React", "Node.js"]
 *                   preferredSkills:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["TypeScript", "GraphQL"]
 *                   whatWeOffer:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Remote work", "Flexible hours", "Health insurance"]
 *               company:
 *                 type: string
 *                 example: TechCorp Ltd.
 *               location:
 *                 type: string
 *                 example: New York, NY
 *               salary:
 *                 type: string
 *                 example: $80,000 - $100,000
 *               type:
 *                 type: string
 *                 example: Full-time
 *               experience:
 *                 type: string
 *                 example: 2+ years
 *               vacancies:
 *                 type: number
 *                 example: 3
 *               status:
 *                 type: string
 *                 enum: [open, closed]
 *                 example: open
 *     responses:
 *       201:
 *         description: Job added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job added successfully
 *       400:
 *         description: Missing required fields in job description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields in job description
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role (not an employer)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: insufficient permissions"
 *       500:
 *         description: Server error while adding job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error adding job
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
router.post("/addJob", verifyToken, requireRole(["employer"]), addJob);

/**
 * @swagger
 * /applyForJob:
 *   post:
 *     summary: Apply for a job (User only)
 *     tags:
 *       - Job Applications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - jobId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64f8e2f7aabc12345678abcd
 *               jobId:
 *                 type: string
 *                 example: 64f8e2f7aabc12345678dcba
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application submitted successfully.
 *                 application:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64fb9eecb2f315001fc1e5c9
 *                     userId:
 *                       type: string
 *                       example: 64f8e2f7aabc12345678abcd
 *                     jobId:
 *                       type: string
 *                       example: 64f8e2f7aabc12345678dcba
 *                     employer:
 *                       type: string
 *                       example: TechCorp Ltd.
 *                     employerId:
 *                       type: string
 *                       example: 64f8e2f7aabc12345678aaee
 *       400:
 *         description: Missing or invalid userId or jobId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID and Job ID are required.
 *       404:
 *         description: User or Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job not found.
 *       409:
 *         description: Duplicate application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You have already applied for this job.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.post("/applyForJob/", verifyToken, requireRole(["user"]), applyForJob);

/**
 * @swagger
 * /refreshToken:
 *   post:
 *     summary: Refresh the access token using a valid refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 message:
 *                   type: string
 *                   example: Access token refreshed
 *       401:
 *         description: No refresh token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token required
 *       403:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired refresh token
 */
router.post("/refreshToken", refreshAccessToken);

// GET methods

/**
 * @swagger
 * /getJobs/{employerId}:
 *   get:
 *     summary: Get paginated list of jobs for a specific employer
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the employer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (12 jobs per page)
 *     responses:
 *       200:
 *         description: Successfully retrieved jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalJobs:
 *                   type: integer
 *                   example: 60
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       400:
 *         description: Employer ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employer ID is required
 *       404:
 *         description: No jobs found for this employer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No jobs found for this employer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Error details here
 */
router.get(
  "/getJobs/:employerId",
  verifyToken,
  requireRole(["employer"]),
  getJobsForEmployer
);

/**
 * @swagger
 * /getEmployerData/{employerId}:
 *   get:
 *     summary: Retrieve employer profile data by ID
 *     tags:
 *       - Employers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the employer
 *     responses:
 *       200:
 *         description: Employer data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employer data retrieved successfully
 *                 employer:
 *                   $ref: '#/components/schemas/Employer'
 *       400:
 *         description: Employer ID not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employer ID is required
 *       404:
 *         description: Employer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employer not found
 *       500:
 *         description: Internal server error while retrieving employer data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving employer data
 *                 error:
 *                   type: string
 *                   example: Error details here
 */
router.get(
  "/getEmployerData/:employerId",
  verifyToken,
  requireRole(["employer"]),
  getEmployerData
);

/**
 * @swagger
 * /getUserData/{userId}:
 *   get:
 *     summary: Retrieve user profile data by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data retrieved successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User ID not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error while retrieving user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving user data
 *                 error:
 *                   type: string
 *                   example: Error details here
 */
router.get("/getUserData/:userId", getUserData);

/**
 * @swagger
 * /getAdminData/{adminId}:
 *   get:
 *     summary: Retrieve admin profile data by ID
 *     tags:
 *       - Admins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the admin
 *     responses:
 *       200:
 *         description: Admin data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin data retrieved successfully
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Admin ID not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin ID is required
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin not found
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - User does not have the required role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden
 *       500:
 *         description: Internal server error while retrieving admin data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving admin data
 *                 error:
 *                   type: string
 *                   example: Error details here
 */
router.get("/getAdminData/:adminId", verifyToken, requireRole(["admin"]), getAdminData);

/**
 * @swagger
 * /employer/{employerId}/jobs-summary:
 *   get:
 *     summary: Get a paginated summary of jobs for a specific employer
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the employer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (9 jobs per page)
 *     responses:
 *       200:
 *         description: Paginated job summaries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalJobs:
 *                   type: integer
 *                   example: 45
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobSummary'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - User does not have employer role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get(
  "/employer/:employerId/jobs-summary",
  verifyToken,
  requireRole(["employer"]),
  getJobsSummaryForEmployer
);

/**
 * @swagger
 * /notifications/{userId}:
 *   get:
 *     summary: Get paginated notifications for a user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (5 notifications per page)
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid user ID.
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - User does not have the required role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden
 *       500:
 *         description: Internal server error while fetching notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get(
  "/notifications/:userId",
  verifyToken,
  requireRole(["user"]),
  getUserNotifications
);

router.get("/appliedJobs/:userId", getUserAppliedJobs);

/**
 * @swagger
 * /jobs-by-domain:
 *   get:
 *     summary: Get open jobs by domain not yet applied to by the user
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: The job domain to filter by (e.g., Engineering, Design)
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user (used to exclude already applied jobs)
 *     responses:
 *       200:
 *         description: List of open jobs in the domain not applied to by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       400:
 *         description: Missing domain or userId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Domain and user ID are required.
 *       500:
 *         description: Internal server error while retrieving jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/jobs-by-domain", getJobsByDomain);

/**
 * @swagger
 * /getJobById/{jobId}:
 *   get:
 *     summary: Retrieve job details by ID along with applicant information
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the job
 *     responses:
 *       200:
 *         description: Job data and list of applicants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *                 applicants:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApplicationWithUser'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job not found
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - User does not have employer role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden
 *       500:
 *         description: Internal server error while retrieving job data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get(
  "/getJobById/:jobId",
  verifyToken,
  requireRole(["employer"]),
  getJobById
);

/**
 * @swagger
 * /getJobsForUser:
 *   get:
 *     summary: Search and retrieve paginated list of open jobs for a user
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *         required: false
 *         description: Specific job domain to filter by (used if no search term is provided)
 *       - in: query
 *         name: preferredDomain
 *         schema:
 *           type: string
 *         required: false
 *         description: User's preferred job domain (used as a fallback if domain is not specified)
 *       - in: query
 *         name: experience
 *         schema:
 *           type: number
 *         required: false
 *         description: Filter jobs requiring up to this many years of experience
 *       - in: query
 *         name: expectedSalary
 *         schema:
 *           type: number
 *         required: false
 *         description: Filter jobs offering at least this salary
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Type of job (e.g., full-time, part-time, internship)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Keyword search across job title, company, location, and skills
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: The ID of the user to exclude already applied jobs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination (12 jobs per page)
 *     responses:
 *       200:
 *         description: List of matching jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 36
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       500:
 *         description: Internal server error during job search
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Error message details
 */
router.get("/getJobsForUser", searchJobsForUsers);

/**
 * @swagger
 * /searchJobs:
 *   get:
 *     summary: Search for open jobs with filters and keyword support
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *         required: false
 *         description: Specific job domain to filter by (applied only if no search term is provided)
 *       - in: query
 *         name: preferredDomain
 *         schema:
 *           type: string
 *         required: false
 *         description: User's preferred domain (fallback if domain is not provided and no search term)
 *       - in: query
 *         name: experience
 *         schema:
 *           type: number
 *         required: false
 *         description: Filters jobs requiring up to this many years of experience
 *       - in: query
 *         name: expectedSalary
 *         schema:
 *           type: number
 *         required: false
 *         description: Filters jobs offering at least this salary
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Type of job (e.g., full-time, part-time, internship)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Keyword search across job title, company, location, and skills
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: User ID to exclude jobs already applied to
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination (12 jobs per page)
 *     responses:
 *       200:
 *         description: Successfully retrieved matching jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 48
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *       500:
 *         description: Internal server error during job search
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get("/searchJobs", searchJobsForUsers);

/**
 * @swagger
 * /echartStatus/{userId}:
 *   get:
 *     summary: Get aggregated application status counts for an employer
 *     tags:
 *       - Applications
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the employer (not the candidate)
 *     responses:
 *       200:
 *         description: Status counts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Applied:
 *                   type: integer
 *                   example: 12
 *                 In Progress:
 *                   type: integer
 *                   example: 5
 *                 Accepted:
 *                   type: integer
 *                   example: 3
 *                 Rejected:
 *                   type: integer
 *                   example: 7
 *       400:
 *         description: Missing employer ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employer ID is required
 *       500:
 *         description: Internal server error during aggregation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get(
  "/echartStatus/:userId",
  getApplicationsDataForEmployerBasedOnStatus
);

/**
 * @swagger
 * /user/{userId}/status-summary:
 *   get:
 *     summary: Get application status summary for a user
 *     description: Returns a count of applications per status (Applied, In Progress, Accepted, Rejected) for the specified user.
 *     tags:
 *       - Applications
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user (candidate)
 *     responses:
 *       200:
 *         description: Status counts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Applied:
 *                   type: integer
 *                   example: 5
 *                 In Progress:
 *                   type: integer
 *                   example: 3
 *                 Accepted:
 *                   type: integer
 *                   example: 1
 *                 Rejected:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID is required
 *       500:
 *         description: Internal server error during aggregation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get(
  "/user/:userId/status-summary",
  getApplicationsDataForUserBasedOnStatus
);

/**
 * @swagger
 * /user/{userId}/applications-by-domain:
 *   get:
 *     summary: Get application counts grouped by job domain for a user
 *     description: Returns a list of job domains with the number of applications the user has submitted in each.
 *     tags:
 *       - Applications
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user (candidate)
 *     responses:
 *       200:
 *         description: Successfully retrieved application counts by domain
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   domain:
 *                     type: string
 *                     example: "Engineering"
 *                   count:
 *                     type: integer
 *                     example: 4
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       500:
 *         description: Server error during aggregation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get("/user/:userId/applications-by-domain", getApplicationsByDomain);

// PUT methods

/**
 * @swagger
 * /updateJob/{jobId}:
 *   put:
 *     summary: Update an existing job
 *     description: Allows employers to update a job posting by job ID. Only accessible to users with the 'employer' role. Validates the job description structure before updating.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: number
 *               description:
 *                 type: object
 *                 properties:
 *                   overview:
 *                     type: string
 *                   responsibilities:
 *                     type: array
 *                     items:
 *                       type: string
 *                   requiredSkills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   preferredSkills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   whatWeOffer:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job updated successfully
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error in request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Description overview cannot be empty
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job not found
 *       500:
 *         description: Server error while updating job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating job
 *                 error:
 *                   type: string
 *     examples:
 *       application/json:
 *         {
 *           "title": "Senior Frontend Developer",
 *           "location": "Remote",
 *           "description": {
 *             "overview": "Work with a passionate team to build great products.",
 *             "responsibilities": ["Develop UI components", "Collaborate with backend team"],
 *             "requiredSkills": ["React", "TypeScript"],
 *             "preferredSkills": ["GraphQL"],
 *             "whatWeOffer": ["Flexible hours", "Remote-first team"]
 *           }
 *         }
 */
router.put(
  "/updateJob/:jobId",
  verifyToken,
  requireRole(["employer"]),
  updateJob
);

/**
 * @swagger
 * /updateUser/{userId}:
 *   put:
 *     summary: Update user profile
 *     description: Allows a user to update their profile information. Passwords are hashed before saving. Certain fields like `_id`, `__v`, `createdAt`, and `updatedAt` are ignored if provided.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: john@example.com
 *               password: mysecurepassword
 *               phone: "+1234567890"
 *               address: "123 Main St, Springfield"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *       400:
 *         description: Bad request (e.g., missing userId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating user data
 *                 error:
 *                   type: string
 */
router.put(
  "/updateUser/:userId",
  verifyToken,
  requireRole(["user"]),
  updateUserData
);

/**
 * @swagger
 * /updateEmployer/{employerId}:
 *   put:
 *     summary: Update employer profile
 *     description: Updates an employer's profile information. Password is securely hashed if included. Certain fields like `_id`, `__v`, `createdAt`, and `updatedAt` are automatically ignored.
 *     tags:
 *       - Employers
 *    security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the employer to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               website:
 *                 type: string
 *               address:
 *                 type: string
 *             example:
 *               companyName: Acme Corp
 *               email: contact@acmecorp.com
 *               password: newsecurepassword
 *               phone: "+19876543210"
 *               website: "https://acmecorp.com"
 *               address: "456 Corporate Blvd, Metropolis"
 *     responses:
 *       200:
 *         description: Employer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     website:
 *                       type: string
 *                     address:
 *                       type: string
 *       400:
 *         description: Missing employer ID in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employer ID is required
 *       404:
 *         description: Employer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error while updating employer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.put("/updateEmployer/:employerId", verifyToken, requireRole(["employer"]), updateEmployerData);

/**
 * @swagger
 * /{applicationId}/status:
 *   put:
 *     summary: Update application status
 *     description: Allows an employer to update the status of a job application. Handles vacancy count updates if status is changed to or from "Accepted". Sends a notification to the user.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the application to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [In Progress, Accepted, Rejected]
 *             example:
 *               status: Accepted
 *     responses:
 *       200:
 *         description: Application status updated and user notified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application status updated and user notified.
 *                 application:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     jobId:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Invalid input (e.g., bad status or applicationId format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid status value.
 *       404:
 *         description: Application or associated job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application not found.
 *       500:
 *         description: Server error during status update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.put(
  "/:applicationId/status",
  verifyToken,
  requireRole(["employer"]),
  updateApplicationStatus
);

// DELETE methods

/**
 * @swagger
 * /deleteJob/{jobId}:
 *   delete:
 *     summary: Delete a job and its related applications
 *     description: Deletes a job post by its ID along with all associated applications. Only accessible by users with the "employer" role.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64a7b2f4c5e84b1234567890
 *         description: The ID of the job to delete
 *     responses:
 *       200:
 *         description: Job and related applications deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job and related applications deleted successfully
 *                 deletedApplications:
 *                   type: number
 *                   example: 5
 *                 deletedJob:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64a7b2f4c5e84b1234567890
 *                     title:
 *                       type: string
 *                       example: Frontend Developer
 *                     description:
 *                       type: string
 *                       example: Job description goes here
 *                     employerId:
 *                       type: string
 *                       example: 64a7b2f4c5e84b1234567899
 *       400:
 *         description: Invalid job ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid job ID format
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job not found
 *       500:
 *         description: Server error during deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting job
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
router.delete(
  "/deleteJob/:jobId",
  verifyToken,
  requireRole(["employer"]),
  deleteJob
);

/**
 * @swagger
 * /deleteUser/{userId}:
 *   delete:
 *     summary: Delete a user and their associated data
 *     description: Deletes a user account by ID along with their applications and notifications. Only accessible by users with the "user" role.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64a7b2f4c5e84b1234567890
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User and associated data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User and associated applications deleted successfully
 *                 deletedApplications:
 *                   type: number
 *                   example: 5
 *       400:
 *         description: User ID not provided or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID is required
 *       404:
 *         description: User not found or failed to delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete user
 *       500:
 *         description: Internal server error during deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Some error occurred
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
router.delete(
  "/deleteUser/:userId",
  verifyToken,
  requireRole(["user"]),
  deleteUserData
);

/**
 * @swagger
 * /deleteEmployer/{employerId}:
 *   delete:
 *     summary: Delete an employer and all associated jobs and applications
 *     description: Deletes an employer account by ID along with all jobs posted by them and related applications. Only accessible by users with the "employer" role.
 *     tags:
 *       - Employers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64a7b2f4c5e84b1234567890
 *         description: The ID of the employer to delete
 *     responses:
 *       200:
 *         description: Employer and associated data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employer and associated jobs deleted successfully
 *                 deletedJobs:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Employer ID not provided or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employer ID is required
 *       404:
 *         description: Employer not found or failed to delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete employer
 *       500:
 *         description: Internal server error during deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Some error occurred
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */
router.delete(
  "/deleteEmployer/:employerId",
  verifyToken,
  requireRole(["employer"]),
  deleteEmployerData
);

/**
 * @swagger
 * /revokeApplication/{application_id}:
 *   delete:
 *     summary: Revoke a specific job application
 *     description: Allows a user to revoke (delete) their job application by its ID. Only accessible by users with the "user" role.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: application_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64b8f9e1f2d98a1234567890
 *         description: The ID of the application to revoke
 *     responses:
 *       200:
 *         description: Application revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application revoked successfully.
 *                 application:
 *                   type: object
 *                   description: The deleted application object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64b8f9e1f2d98a1234567890
 *                     jobId:
 *                       type: string
 *                       example: 64b8f9e1f2d98a1234567899
 *                     userId:
 *                       type: string
 *                       example: 64b8f9e1f2d98a1234567888
 *                     status:
 *                       type: string
 *                       example: revoked
 *       400:
 *         description: Invalid or missing application ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Application ID format
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application not found
 *       500:
 *         description: Internal server error during application revocation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.delete(
  "/revokeApplication/:application_id",
  verifyToken,
  requireRole(["user"]),
  revokeSingleApplication
);

/**
 * @swagger
 * /notifications/clear/{userId}:
 *   delete:
 *     summary: Clear all notifications for a user
 *     description: Deletes all notifications associated with a specific user. Only accessible by users with the "user" role.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64b9c1f2e1a2b41234567890
 *         description: The ID of the user whose notifications will be cleared
 *     responses:
 *       200:
 *         description: Notifications cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notifications cleared successfully.
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid user ID.
 *       500:
 *         description: Server error during notification clearing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.delete(
  "/notifications/clear/:userId",
  verifyToken,
  requireRole(["user"]),
  clearNotifications
)

// Check password strength

router.post('/check-password-strength', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: "Password is required" });
    }

    const found = await isCommonPassword(password.toLowerCase());

    return res.status(200).json({
      message: found
        ? "This password was leaked previously. Please use strong password"
        : "Password is strong. You can continue registration"
    });
  } catch (error) {
    console.error("Password check failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
