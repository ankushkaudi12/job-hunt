import { Application } from "../models/applications.js";
import mongoose from "mongoose";

export async function revokeApplication(applicationId) {
    console.log("[revokeApplication] Request received with application_id:", applicationId);

    if (!applicationId) {
        throw new Error("Application ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error("Invalid Application ID format");
    }

    const application = await Application.findById(applicationId);
    if (!application) {
        throw new Error("Application not found");
    }

    const jobId = application.jobId;

    await changeApplicantCount(jobId, 'dec');

    if (application.status === "Accepted") {
        await changeVacancyCount(jobId, 'inc');
    }

    const deletedApplication = await Application.findByIdAndDelete(applicationId);
    console.info("[revokeApplication] Deleted application:", deletedApplication);

    return deletedApplication;
}

export async function revokeAllApplications(userId) {
    console.log("[revokeAll] Request received for userId:", userId);

    if (!userId) {
        throw new Error("User ID is required");
    }

    const applications = await Application.find({ userId });

    if (!applications.length) {
        console.warn("[revokeAll] No applications found to revoke for userId:", userId);
        return { message: "No applications to revoke" };
    }

    // Track job updates and errors
    const jobUpdatePromises = applications.map(app => {
        const jobId = app.jobId;

        return Promise.all([
            changeApplicantCount(jobId, 'dec'),
            changeVacancyCount(jobId, 'inc')
        ]).catch(err => {
            console.error(`[revokeAll] Failed to update job counters for jobId ${jobId}:`, err);
        });
    });

    await Promise.allSettled(jobUpdatePromises);

    const deleteResult = await Application.deleteMany({ userId });

    console.info(`[revokeAll] ${deleteResult.deletedCount} applications revoked for userId:`, userId);
    return {
        message: "All applications revoked successfully",
        deletedCount: deleteResult.deletedCount
    };
}

export async function deleteAllApplicationsWithEmployerId(employerId) {
    console.log("[deleteAllApplicationsWithEmployerId] Request received with employerId:", employerId);

    if (!employerId) {
        throw new Error("Employer ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(employerId)) {
        throw new Error("Invalid Employer ID format");
    }

    const applications = await Application.deleteMany({ employerId });

    if (applications.deletedCount === 0) {
        console.warn("[deleteAllApplicationsWithEmployerId] No applications found for employerId:", employerId);
        return { message: "No applications to delete" };
    }
    console.info(`[deleteAllApplicationsWithJobId] ${applications.deletedCount} applications deleted for employerId:`, employerId);
    return {
        message: "All applications deleted successfully",
        deletedCount: applications.deletedCount
    };
}

export async function deleteAllApplicationsWithJobId(jobId) {
    console.log("[deleteAllApplicationsWithJobId] Request received with jobId:", jobId);

    if (!jobId) {
        throw new Error("Job ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error("Invalid Job ID format");
    }

    const applications = await Application.deleteMany({ jobId });

    if (applications.deletedCount === 0) {
        console.warn("[deleteAllApplicationsWithJobId] No applications found for jobId:", jobId);
        return { message: "No applications to delete" };
    }
    console.info(`[deleteAllApplicationsWithJobId] ${applications.deletedCount} applications deleted for jobId:`, jobId);
    return {
        message: "All applications deleted successfully",
        deletedCount: applications.deletedCount
    };
}
