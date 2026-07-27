# API Specification

## Authentication

### Register

POST /api/auth/register

### Login

POST /api/auth/login

### Logout

POST /api/auth/logout

---

## Scanner

### Start Scan

POST /api/scan

### Get Scan Result

GET /api/scan/{scan_id}

### Scan History

GET /api/history

---

## Reports

### Download Report

GET /api/report/{report_id}
