import cron from "node-cron";
import { refreshAllFeeds } from "./feed-parser";

let isRunning = false;

export function startCronJob() {
  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    if (isRunning) {
      console.log("[Cron] Previous refresh still running, skipping...");
      return;
    }

    isRunning = true;
    console.log("[Cron] Starting scheduled feed refresh...");

    try {
      const result = await refreshAllFeeds();
      console.log(`[Cron] Refresh complete: ${result.added} items processed`);

      if (result.errors.length > 0) {
        console.log(`[Cron] Errors: ${result.errors.join(", ")}`);
      }
    } catch (error) {
      console.error("[Cron] Refresh failed:", error);
    } finally {
      isRunning = false;
    }
  });

  console.log("[Cron] Scheduled feed refresh every 30 minutes");
}

// For manual testing
export async function runRefreshNow() {
  console.log("[Manual] Starting feed refresh...");
  const result = await refreshAllFeeds();
  console.log(`[Manual] Refresh complete: ${result.added} items processed`);
  return result;
}
