-- Resume templates and resume-only edits (lib/resume.ts). Empty object = Classic, no edits.
ALTER TABLE "profiles" ADD COLUMN "resume_config" JSONB NOT NULL DEFAULT '{}';
