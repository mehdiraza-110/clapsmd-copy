import Announcement from "@/models/Announcement";

export async function publishDueAnnouncements() {
  const results = { expired: [], published: [] };

  const dueAnnouncementsForExpiry = await Announcement.getDueAnnouncementsForExpiry();
  for (const announcement of dueAnnouncementsForExpiry) {
    try {
      const expired = await Announcement.markAsExpired(announcement.id);
      if (expired) {
        console.log(`[announcement-cron] Expired announcement #${announcement.id}`);
        results.expired.push(announcement.id);
      }
    } catch (err) {
      console.error(`[announcement-cron] Failed to expire announcement #${announcement.id}:`, err.message);
    }
  }

  const dueAnnouncements = await Announcement.getDueScheduledAnnouncements();
  for (const announcement of dueAnnouncements) {
    try {
      const published = await Announcement.markAsPublished(announcement.id);
      if (published) {
        console.log(`[announcement-cron] Published announcement #${announcement.id}`);
        results.published.push(announcement.id);
      }
    } catch (err) {
      console.error(`[announcement-cron] Failed to publish announcement #${announcement.id}:`, err.message);
    }
  }

  return results;
}
