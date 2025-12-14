# Cotrans Global - Employment Application Platform

![Cotrans Global](https://www.cotransglobal.com)

## Overview

**Cotrans Global** is a comprehensive web-based employment application and recruitment management system designed for international employment placement services. The platform streamlines the entire application process from job posting to applicant tracking and document management.

## About Cotrans Global

Cotrans Global is an **International Employment & Recruitment Corporation** specializing in connecting qualified candidates with employment opportunities worldwide. We facilitate the complete recruitment lifecycle including application processing, medical assessments, visa processing, and placement services.

### Contact Information
- **Website**: [www.cotransglobal.com](https://www.cotransglobal.com)
- **Email**: hello@cotransglobal.com
- **Phone**: +254 700 000 000
- **Location**: Nairobi, Kenya

---

## Features

### For Applicants
- 📝 **Online Application Form** - Easy-to-use application interface
- 📄 **Document Upload** - Upload passport photos and supporting documents
- 💳 **Medical Fee Payment** - Secure payment processing via M-Pesa
- 📧 **Email Notifications** - Automated application confirmations
- 📑 **PDF Generation** - Professional application documents

### For Administrators
- 👥 **Applicant Management** - Track and manage all applications
- 💼 **Job Posting System** - Create and manage job listings
- 📊 **Application Tracking** - Monitor application status and progress
- 🔍 **Search & Filter** - Advanced applicant search capabilities
- 📥 **PDF Export** - Generate professional application PDFs

### Technical Features
- 🔐 **Secure Authentication** - JWT-based authentication system
- 📱 **Responsive Design** - Mobile-friendly interface
- ☁️ **Cloud Storage** - Integrated file storage system
- 📧 **Email Integration** - Automated email communications
- 🎨 **Modern UI** - Clean, professional user interface

---

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **PDFKit** - PDF generation
- **Nodemailer** - Email functionality
- **Multer** - File upload handling
- **JWT** - Authentication

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file with required variables
# See .env.example for reference

# Start the server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Project Structure

```
cotrans-global/
├── Backend/
│   ├── public/              # Static assets (logo, etc.)
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── emails/          # Email templates
│   ├── storage/             # File storage
│   └── server.js            # Entry point
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context providers
│   │   ├── services/        # API services
│   │   └── App.tsx          # Main app component
│   └── public/              # Public assets
│
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Admin)
- `PUT /api/jobs/:id` - Update job (Admin)
- `DELETE /api/jobs/:id` - Delete job (Admin)

### Applications
- `GET /api/applicants` - Get all applications (Admin)
- `GET /api/applicants/:id` - Get single application
- `POST /api/applicants` - Submit application
- `PUT /api/applicants/:id` - Update application
- `DELETE /api/applicants/:id` - Delete application
- `GET /api/applicants/:id/pdf` - Download application PDF

---

## Key Features Explained

### PDF Generation
The system automatically generates professional, branded PDF documents for each application including:
- Company branding and logo
- Applicant personal information
- Work experience and education
- Position details
- Medical fee confirmation
- Legal disclaimers and privacy notices

### Email Notifications
Applicants receive automated emails containing:
- Application confirmation
- Reference number
- Application summary
- Next steps information

### Payment Integration
Integrated M-Pesa payment processing for medical fee collection with automatic verification.

---

## Development

### Running Tests
```bash
# Backend tests
cd Backend
npm test

# Frontend tests
cd Frontend
npm test
```

### Building for Production

```bash
# Build frontend
cd Frontend
npm run build

# Build backend
cd Backend
npm run build
```

---

## Contributing

We welcome contributions to improve the platform. Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is proprietary software owned by **Cotrans Global**. All rights reserved.

---

## Support

For technical support or inquiries:
- **Email**: hello@cotransglobal.com
- **Phone**: +254 700 000 000
- **Website**: [www.cotransglobal.com](https://www.cotransglobal.com)

---

## Acknowledgments

Built with dedication to streamline international employment recruitment and provide exceptional service to both employers and job seekers worldwide.

---

**© 2025 Cotrans Global - International Employment & Recruitment Corporation**