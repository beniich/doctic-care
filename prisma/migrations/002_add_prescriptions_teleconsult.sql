-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Document Counters Table for Auto-Numbering
CREATE TABLE IF NOT EXISTS "document_counters" (
    "year" INTEGER NOT NULL,
    "type" TEXT NOT NULL, -- 'ORD' for Prescriptions, 'TC' for Teleconsultations
    "count" INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY ("year", "type")
);

-- Prescriptions Table
CREATE TABLE IF NOT EXISTS "prescriptions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "prescription_number" TEXT UNIQUE NOT NULL,
    "patient_id" TEXT NOT NULL, -- Assuming string ID/UUID from auth system
    "doctor_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active', -- active, dispensed, expired
    "notes" TEXT,
    "valid_until" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medications Table
CREATE TABLE IF NOT EXISTS "medications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "prescription_id" UUID NOT NULL REFERENCES "prescriptions"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teleconsult Sessions Table
CREATE TABLE IF NOT EXISTS "teleconsult_sessions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "session_number" TEXT UNIQUE NOT NULL,
    "patient_id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 30,
    "status" TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in-progress, completed, cancelled
    "daily_room_url" TEXT,
    "daily_room_name" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL, -- VIEW, CREATE, UPDATE, DELETE, EXPORT
    "resource_type" TEXT NOT NULL, -- PRESCRIPTION, TELECONSULT, PATIENT
    "resource_id" TEXT NOT NULL,
    "details" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to generate document numbers (ORD-2025-00001)
CREATE OR REPLACE FUNCTION generate_document_number() RETURNS TRIGGER AS $$
DECLARE
    current_year INTEGER;
    doc_type TEXT;
    prefix TEXT;
    next_val INTEGER;
    formatted_number TEXT;
BEGIN
    current_year := cast(to_char(CURRENT_DATE, 'YYYY') as INTEGER);
    
    IF TG_TABLE_NAME = 'prescriptions' THEN
        doc_type := 'ORD';
        prefix := 'ORD';
    ELSIF TG_TABLE_NAME = 'teleconsult_sessions' THEN
        doc_type := 'TC';
        prefix := 'TC';
    ELSE
        RETURN NEW;
    END IF;

    -- Upsert counter for the current year
    INSERT INTO "document_counters" ("year", "type", "count")
    VALUES (current_year, doc_type, 0)
    ON CONFLICT ("year", "type") DO NOTHING;

    -- Increment and get next value
    UPDATE "document_counters"
    SET "count" = "count" + 1
    WHERE "year" = current_year AND "type" = doc_type
    RETURNING "count" INTO next_val;

    -- Format: PREFIX-YYYY-00001
    formatted_number := prefix || '-' || current_year || '-' || lpad(cast(next_val as text), 5, '0');

    IF TG_TABLE_NAME = 'prescriptions' THEN
        NEW.prescription_number := formatted_number;
    ELSIF TG_TABLE_NAME = 'teleconsult_sessions' THEN
        NEW.session_number := formatted_number;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-numbering
DROP TRIGGER IF EXISTS set_prescription_number ON "prescriptions";
CREATE TRIGGER set_prescription_number
BEFORE INSERT ON "prescriptions"
FOR EACH ROW
WHEN (NEW.prescription_number IS NULL)
EXECUTE FUNCTION generate_document_number();

DROP TRIGGER IF EXISTS set_teleconsult_number ON "teleconsult_sessions";
CREATE TRIGGER set_teleconsult_number
BEFORE INSERT ON "teleconsult_sessions"
FOR EACH ROW
WHEN (NEW.session_number IS NULL)
EXECUTE FUNCTION generate_document_number();

-- Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_prescriptions_modtime ON "prescriptions";
CREATE TRIGGER update_prescriptions_modtime
BEFORE UPDATE ON "prescriptions"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teleconsult_modtime ON "teleconsult_sessions";
CREATE TRIGGER update_teleconsult_modtime
BEFORE UPDATE ON "teleconsult_sessions"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
