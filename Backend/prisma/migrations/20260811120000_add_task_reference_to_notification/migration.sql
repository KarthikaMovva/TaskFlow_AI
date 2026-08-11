-- Allow assignment notifications to link to their task after a refresh.
ALTER TABLE "Notification" ADD COLUMN "taskId" TEXT;

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_taskId_fkey"
FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
