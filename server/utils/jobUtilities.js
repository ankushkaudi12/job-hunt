// utils/jobCounters.js

import { Job } from '../models/jobs.js'; // adjust path to your Job model

export const changeApplicantCount = async (jobId, action = 'inc') => {
    try {
        const incrementValue = action === 'dec' ? -1 : 1;

        const result = await Job.updateOne(
            { _id: jobId },
            { $inc: { applicantCount: incrementValue } }
        );

        if (result.modifiedCount === 0 && result.nModified === 0) {
            console.warn(`[changeApplicantCount] No job found with ID: ${jobId}`);
        } else {
            console.info(
                `[changeApplicantCount] Successfully ${action === 'dec' ? 'decremented' : 'incremented'} applicantCount for job ${jobId}`
            );
        }
    } catch (error) {
        console.error(
            `[changeApplicantCount] Error ${action === 'dec' ? 'decrementing' : 'incrementing'} applicantCount for job ${jobId}:`,
            error
        );
    }
};

export const changeVacancyCount = async (jobId, action = 'inc') => {
    try {
        const incrementValue = action === 'dec' ? -1 : 1;

        const result = await Job.updateOne(
            { _id: jobId },
            { $inc: { vacancies: incrementValue } }
        );

        if (result.modifiedCount === 0 && result.nModified === 0) {
            console.warn(`[changeVacancyCount] No job found with ID: ${jobId}`);
        } else {
            console.info(
                `[changeVacancyCount] Successfully ${action === 'dec' ? 'decremented' : 'incremented'} vacancies for job ${jobId}`
            );
        }
    } catch (error) {
        console.error(
            `[changeVacancyCount] Error ${action === 'dec' ? 'decrementing' : 'incrementing'} vacancies for job ${jobId}:`,
            error
        );
    }
};

export async function deleteSingleJob(jobId) {
    console.log("[deleteSingleJob] Request received with jobId:", jobId);

    if (!jobId) {
        throw new Error("Job ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error("Invalid Job ID format");
    }

    const job = await Job.findById(jobId);
    if (!job) {
        throw new Error("Job not found");
    }

    await changeApplicantCount(job._id, 'dec');
    await changeVacancyCount(job._id, 'inc');

    const deletedJob = await Job.findByIdAndDelete(jobId);
    console.info("[deleteSingleJob] Deleted job:", deletedJob);

    return deletedJob;
}

export async function deleteAllJobs(employerId) {
    console.log("[deleteAllJobs] Request received to delete all jobs for employerId:", employerId);

    if (!employerId) {
        console.error("[deleteAllJobs] Missing employerId");
        throw new Error("Employer ID is required");
    }

    const result = await Job.deleteMany({ employerId });

    if (result.deletedCount === 0) {
        console.warn("[deleteAllJobs] No jobs found to delete for employerId:", employerId);
        return { message: "No jobs to delete" };
    }

    console.info(`[deleteAllJobs] Deleted ${result.deletedCount} job(s) for employerId:`, employerId);
    return {
        message: "All jobs deleted successfully",
        deletedCount: result.deletedCount
    };
}

