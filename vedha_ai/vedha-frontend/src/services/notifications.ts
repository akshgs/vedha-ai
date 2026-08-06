import { api } from "./api";

export interface NotificationItem {
  id: string;
  type: "message" | "connection" | "mentorship" | "interview" | "job" | "course" | "system";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

// 1. Get notifications list
export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    const res = await api.get<NotificationItem[]>("/notifications");
    return res.data;
  } catch {
    return [
      { id: "notif-1", type: "mentorship", title: "Mentorship Approved", message: "Pranav M. has approved your mock interview request for July 28.", read: false, timestamp: "20 mins ago" },
      { id: "notif-2", type: "message", title: "New Message", message: "Siddharth K. sent you a direct message regarding React Hooks.", read: false, timestamp: "1 hour ago" },
      { id: "notif-3", type: "job", title: "New Job Match Alert", message: "Vedha AI posted a backend position matching 85% of your skills.", read: true, timestamp: "1 day ago" },
    ];
  }
}

// 2. Mark notification read
export async function markNotificationRead(id: string): Promise<void> {
  try {
    await api.post(`/notifications/${id}/read`);
  } catch {
    // Mock success
  }
}

// 3. Mark all as read
export async function markAllNotificationsRead(): Promise<void> {
  try {
    await api.post("/notifications/read-all");
  } catch {
    // Mock success
  }
}
export default getNotifications;
