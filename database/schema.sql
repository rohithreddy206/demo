-- ============================================================
-- Recruitment Management System — MySQL Schema & Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS recruitpro_db;
USE recruitpro_db;

-- ------------------------------------------------------------
-- Users table (mock auth seed only)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id        INT            PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100)   NOT NULL,
    email     VARCHAR(100)   UNIQUE NOT NULL,
    role      ENUM('recruiter','manager') NOT NULL
);

INSERT INTO users (full_name, email, role) VALUES
    ('Alex Morgan',   'manager@demo.com',   'manager'),
    ('Sam Rivera',    'recruiter@demo.com', 'recruiter');

-- ------------------------------------------------------------
-- Jobs table
-- ------------------------------------------------------------
DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (
    id                       INT           PRIMARY KEY AUTO_INCREMENT,
    date                     DATE          NOT NULL,
    company_name             VARCHAR(150)  NOT NULL,
    job_title                VARCHAR(150)  NOT NULL,
    num_candidates_required  INT           NOT NULL,
    experience               VARCHAR(100),
    budgeted_package         VARCHAR(100),
    assigned_recruiter_name  VARCHAR(100),
    created_at               DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at               DATETIME      ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO jobs (date, company_name, job_title, num_candidates_required, experience, budgeted_package, assigned_recruiter_name) VALUES
    ('2026-03-01', 'TechNova Solutions',   'Senior Backend Engineer',      3, '5-8 years',  '20-28 LPA',  'Sam Rivera'),
    ('2026-03-05', 'Infosys Limited',      'Frontend Developer',           5, '2-4 years',  '10-15 LPA',  'Sam Rivera'),
    ('2026-03-10', 'Wipro Technologies',   'Data Scientist',               2, '3-5 years',  '18-24 LPA',  'Sam Rivera'),
    ('2026-03-15', 'HCL Technologies',     'DevOps Engineer',              4, '4-6 years',  '16-22 LPA',  'Sam Rivera'),
    ('2026-03-20', 'Tata Consultancy',     'Product Manager',              1, '6-10 years', '30-40 LPA',  'Sam Rivera');
