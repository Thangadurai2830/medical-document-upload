# Patient Portal Design Document

## Tech Stack Choices

### Q1. What frontend framework did you use and why? (React, Vue, etc.)
I chose React with TypeScript and Vite for the frontend because:
- React provides a component-based architecture that's ideal for building interactive UIs
- TypeScript adds type safety, reducing runtime errors and improving developer experience
- Vite offers fast development builds and hot module replacement
- Tailwind CSS for styling provides utility-first approach for rapid UI development

### Q2. What backend framework did you choose and why? (Express, Flask, Django, etc.)
I chose Node.js with Express.js for the backend because:
- JavaScript/Node.js allows full-stack consistency with the React frontend
- Express.js is lightweight, flexible, and widely used for REST APIs
- Easy integration with file upload handling (multer) and CORS
- Simple to set up and deploy

### Q3. What database did you choose and why? (SQLite vs PostgreSQL vs others)
The application uses MongoDB with Mongoose for production, but includes an in-memory fallback for development:
- MongoDB was chosen for its flexibility with document-based storage
- Mongoose provides schema validation and easy querying
- In-memory store fallback allows running without database setup for development/demo purposes
- For a simple application like this, MongoDB's document model fits well

### Q4. If you were to support 1,000 users, what changes would you consider?
For 1,000 users, I would consider:
- Implement proper user authentication and authorization
- Use a more robust database like PostgreSQL for ACID compliance
- Add file storage to cloud services (AWS S3, Cloudinary) instead of local storage
- Implement caching (Redis) for frequently accessed data
- Add rate limiting and request validation
- Use a reverse proxy (nginx) for load balancing
- Implement proper logging and monitoring
- Add database indexing and query optimization

## Architecture Overview

### Application Flow
1. **Frontend (React)**: User interacts with the web interface
2. **API Calls**: Frontend makes HTTP requests to backend endpoints
3. **Backend (Express)**: Handles requests, validates data, processes files
4. **Database**: Stores file metadata (or in-memory store for dev)
5. **File Storage**: Local uploads/ folder stores actual PDF files
6. **Response**: Backend returns data to frontend for display

### Data Flow
```
User Action → React Component → API Call → Express Route → Validation → Database/File Operation → Response → UI Update
```

## API Specification

### POST /documents/upload
**Description**: Upload a PDF file
**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: file (PDF file, max 10MB)
**Response**:
```json
{
  "id": 1,
  "filename": "prescription.pdf",
  "filepath": "uploads/1234567890-prescription.pdf",
  "filesize": 245760,
  "created_at": "2024-01-01T10:00:00.000Z"
}
```

### GET /documents
**Description**: List all uploaded documents
**Request**: GET /documents
**Response**:
```json
[
  {
    "id": 1,
    "filename": "prescription.pdf",
    "filepath": "uploads/1234567890-prescription.pdf",
    "filesize": 245760,
    "created_at": "2024-01-01T10:00:00.000Z"
  }
]
```

### GET /documents/:id
**Description**: Download a specific document
**Request**: GET /documents/1
**Response**: Binary PDF file download

### DELETE /documents/:id
**Description**: Delete a document
**Request**: DELETE /documents/1
**Response**: 204 No Content

## Data Flow Description

### Q5. Describe the step-by-step process of what happens when a file is uploaded and when it is downloaded.

**File Upload Process**:
1. User selects PDF file in React component
2. Frontend validates file type and size client-side
3. File is sent via FormData to POST /documents/upload
4. Backend receives file via multer middleware
5. Server validates file type (PDF only) and size (≤10MB)
6. File is saved to uploads/ directory with timestamped filename
7. Metadata (id, filename, filepath, size, created_at) is stored in database
8. Success response with document data is sent back
9. Frontend updates UI to show new document in list

**File Download Process**:
1. User clicks download button for a document
2. Frontend makes GET /documents/:id request
3. Backend looks up document metadata by id
4. Server checks if file exists on disk
5. If found, streams file to client with proper headers
6. Browser downloads the file with original filename

## Assumptions

### Q6. What assumptions did you make while building this?
- Single user system (no authentication needed)
- PDF files only (enforced server-side)
- File size limit of 10MB (reasonable for medical documents)
- Local file storage (uploads/ folder)
- No concurrent file access issues
- Development fallback mode for demo purposes
- CORS allows localhost:5173 (Vite dev server)
- Numeric IDs for documents (auto-incrementing)
- Files are stored locally and not moved after upload
- No file versioning or history tracking
- Simple error handling (basic messages)