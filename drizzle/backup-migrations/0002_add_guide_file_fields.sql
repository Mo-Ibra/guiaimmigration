-- Add file fields to guides table
ALTER TABLE "guides" ADD COLUMN "file_name" text;
ALTER TABLE "guides" ADD COLUMN "file_content" text;
ALTER TABLE "guides" ADD COLUMN "file_type" text;

ALTER TABLE "guides" ADD COLUMN "file_name_2" text;
ALTER TABLE "guides" ADD COLUMN "file_content_2" text;
ALTER TABLE "guides" ADD COLUMN "file_type_2" text;