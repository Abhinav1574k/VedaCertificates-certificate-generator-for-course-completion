# 🎓 Veda Certificate Generator

A full-stack certificate generation system that creates downloadable PDF certificates when a student completes a course.

The application generates a unique certificate ID for every completed course and provides a certificate verification system.

---

## 📌 Project Overview

This project was developed as part of Task 29 of my Web Development Internship.

The objective was to build a system that:

- Accepts a user's name
- Displays course information
- Allows course completion
- Generates a unique certificate ID
- Creates a downloadable PDF certificate
- Prevents certificate generation before completion
- Provides certificate verification

---

## ✨ Features

### 🎓 Course Completion

Users can complete the course after entering their name.

### 🏆 Dynamic Certificate

The certificate dynamically includes:

- Student name
- Course name
- Course duration
- Instructor/organization
- Issue date
- Unique certificate ID

### 📄 PDF Generation

Certificates are generated dynamically on the backend using `pdf-lib`.

### 🆔 Unique Certificate ID

Every generated certificate receives a unique ID such as:

```text
VEDA-2026-A8F39C12D1
```

### 🔐 Certificate Verification

Anyone with a certificate ID can verify whether the certificate exists.

### 🚫 Completion Protection

A certificate cannot be generated before the course is marked as completed.

### 🔁 Duplicate Protection

If a course has already been completed, the existing certificate is returned instead of generating another certificate.

### 📱 Responsive UI

The interface works across desktop, tablet and mobile screen sizes.


## 🛠️ Technology Stack
1. Frontend
HTML5
CSS3
JavaScript
Font Awesome

2. Backend
Node.js
Express.js
PDF
pdf-lib

3. Development Tools
Git
GitHub
VS Code
npm

4. Deployment
Render


## 📁 Project Structure
certificate-generator/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore


## ⚙️ Installation
### Clone the repository:
git clone https://github.com/YOUR_USERNAME/certificate-generator.git

### Enter the project:

cd certificate-generator

### Install dependencies:

npm install

### Start the server:

npm start

### Open:

http://localhost:3000


## 🔄 Application Workflow
Enter Student Name
        ↓
Save Name
        ↓
Complete Course
        ↓
Server Validates Completion
        ↓
Generate Unique Certificate ID
        ↓
Certificate Becomes Available
        ↓
Generate PDF
        ↓
Download Certificate
        ↓
Verify Certificate ID


## 🔌 API Endpoints
### Get Course
GET /api/course

- Returns course information.

### Get User Progress
GET /api/users/:userId/progress

- Returns:
1. User name
2. Completion status
3. Certificate ID
4. Completion date

### Save User Profile
POST /api/users/:userId/profile

Example:

{
  "name": "Abhinav"
}

### Complete Course
POST /api/users/:userId/complete

Marks the course as completed and creates a certificate ID.

### Verify Certificate
GET /api/certificates/:certificateId

Returns certificate information if the ID is valid.

### Download Certificate
GET /api/certificates/:certificateId/download

Generates and downloads the certificate PDF.

### Health Check
GET /api/health

Returns:

{
  "status": "ok",
  "service": "certificate-generator"
}


## 🧠 PDF Generation
- The backend uses pdf-lib to dynamically create a PDF document.

- The certificate contains:
1. VEDA TECHNOLOGY
2. CERTIFICATE OF COURSE COMPLETION
3. Student Name
4. Course Name
5. Course Duration
6. Instructor
7. Issue Date
8. Certificate ID

- The PDF is generated only when a valid certificate exists.

## 🔐 Certificate Verification
1. Each certificate has a unique identifier.

2. Example:

- VEDA-2026-A8F39C12D1

- The verification endpoint checks this ID against the server's certificate records.

- A valid certificate returns:

{
  "valid": true
}

- An invalid certificate returns:

{
  "valid": false
}


## 🛡️ Completion Protection
- Certificate generation is controlled by the backend.

- The server verifies that:
1. The user exists.
2. A valid name has been provided.
3. The course is being completed.
4. A certificate has not already been generated.

- This prevents certificate creation simply by manipulating frontend UI state.


## 🧪 Testing
The following scenarios were tested:

1. Name validation
2. Course completion
3. Certificate generation
4. PDF download
5. Certificate ID generation
6. Valid certificate verification
7. Invalid certificate verification
8. Duplicate completion handling
9. Responsive UI
10. API health check


## 📊 Current Data Storage
- This internship version uses in-memory server storage.

- Therefore, restarting the Node.js server resets the application data.

- For a production system, persistent storage could be implemented using:
1. PostgreSQL
2. MySQL
3. MongoDB


## 🔄 Rollback Strategy
- Git is used for version control.

- A stable Task 29 checkpoint can be created using:

- git tag task-29-complete

- Push the tag:

git push origin task-29-complete

- The commit history provides a way to return to a previously working version if future changes cause issues.



## 🎯 Learning Outcomes
Through this project I learned:

1. Dynamic PDF generation
2. pdf-lib
3. Express.js API development
4. Backend validation
5. Certificate verification
6. Unique ID generation
7. REST API design
8. Client-server communication
9. Frontend form handling
10. Git version control
11. Deployment configuration


## 🔮 Future Improvements
Possible improvements include:

1. User authentication
2. Persistent database
3. QR code verification
4. Digital signatures
5. Certificate templates
6. Email certificate delivery
7. Course progress tracking
8. Admin dashboard
9. Certificate revocation
10. Public verification page
11. Certificate verification QR codes


## 👨‍💻 Author
Abhinav Upadhyay