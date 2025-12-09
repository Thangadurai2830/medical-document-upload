# Patient Portal

A full-stack web application for patients to upload, manage, and access their medical documents (PDFs). This application provides a clean, modern interface with glassmorphism design for uploading prescriptions, test results, and other medical documents.

## Features
- **Upload PDF Documents**: Drag-and-drop or click to upload PDF files with validation
- **Document Management**: View all uploaded documents in a sortable, filterable table
- **Download Documents**: Download any document with one click
- **Delete Documents**: Remove documents with confirmation dialog
- **Modern UI**: Elegant glassmorphism design with dark theme and smooth animations
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Toast notifications for all operations

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose (development fallback to in-memory store)
- **Storage**: Local folder `backend/src/uploads/`
- **UI Components**: Custom components with glassmorphism effects

## Project Structure
```
├── design.md              # Design document with architecture and decisions
├── frontend/               # React application (Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── api/            # API client functions
├── backend/                # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # Database models
│   │   └── uploads/        # File storage directory
└── README.md              # This file
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Run the Application

1. **Clone and install dependencies**:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

2. **Configure environment**:
```bash
# Backend: Copy and configure .env
cp .env.example .env
# Edit .env to enable development fallback (optional)
echo "DEV_FALLBACK=true" >> .env
```

3. **Start the backend**:
```bash
cd backend
npm run start
# API will be available at http://localhost:54112 (or configured port)
```

4. **Start the frontend** (in a new terminal):
```bash
cd frontend
npm run dev
# Open http://localhost:5173 in your browser
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/documents/upload` | Upload a PDF file |
| GET | `/documents` | List all documents |
| GET | `/documents/:id` | Download document by ID |
| DELETE | `/documents/:id` | Delete document by ID |

### Example API Calls

#### Upload a PDF
```bash
curl -X POST -F "file=@prescription.pdf" http://localhost:54112/documents/upload
```

#### List all documents
```bash
curl http://localhost:54112/documents
```

#### Download a document
```bash
curl -O http://localhost:54112/documents/1
```

#### Delete a document
```bash
curl -X DELETE http://localhost:54112/documents/1
```

## Database Configuration

The application supports two database modes:

### Production Mode (MongoDB)
- Install MongoDB locally or use MongoDB Atlas
- Set `MONGO_URI` in `backend/.env`
- Example: `MONGO_URI=mongodb://127.0.0.1:27017/patient_portal`

### Development Mode (In-Memory)
- Set `DEV_FALLBACK=true` in `backend/.env`
- No database installation required
- Data persists only during server runtime

## Design Decisions

- **Glassmorphism UI**: Modern, translucent design with backdrop blur effects
- **TypeScript**: Type safety for better code quality
- **Component Architecture**: Modular, reusable React components
- **RESTful API**: Clean, standard HTTP endpoints
- **File Validation**: Server-side PDF validation and size limits (10MB)
- **Error Handling**: Comprehensive error handling with user feedback

## Assumptions & Limitations

- Single-user system (no authentication)
- PDF files only (enforced validation)
- Local file storage (not suitable for production scaling)
- In-memory database for development/demo purposes
- File size limit: 10MB per document
- No concurrent access protection for file operations

## Development Notes

- Frontend expects numeric document IDs
- CORS configured for `http://localhost:5173` (Vite dev server)
- File uploads stored in `backend/src/uploads/` directory
- Development fallback mode allows running without MongoDB
- All components are responsive and mobile-friendly

For detailed architecture, API specifications, and design rationale, see [design.md](design.md).

