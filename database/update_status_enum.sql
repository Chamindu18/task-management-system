-- Update the status enum in the tasks table to match the backend TaskStatus enum
-- Run this in your MySQL client to fix the "Data truncated for column 'status'" error

ALTER TABLE tasks MODIFY COLUMN status enum('TODO','IN_PROGRESS','DONE') DEFAULT NULL;
