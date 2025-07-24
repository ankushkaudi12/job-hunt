import { Notification } from "../models/notification.js";

export async function delAllNotifications(userId) {
    console.log("[delAllNotification] Request received for userId:", userId);

    if (!userId) {
        throw new Error("User ID is required");
    }

    const result = await Notification.deleteMany({ userId });

    if (result.deletedCount === 0) {
        console.warn("[delAllNotification] No notifications found for userId:", userId);
        return { message: "No notifications to delete" };
    }

    console.info(`[delAllNotification] ${result.deletedCount} notifications deleted for userId:`, userId);
    return { message: "All notifications deleted successfully", deletedCount: result.deletedCount };
}