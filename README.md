# ABARE Platform v2 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NextJS](https://img.shields.io/badge/NextJS-13-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.1-009688)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0-47A248)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)](https://www.typescriptlang.org/)
[![Mantine UI](https://img.shields.io/badge/Mantine-6.0-339AF0)](https://mantine.dev/)

## Overview

The ABARE (AI-Based Analysis of Real Estate) Platform v2 is an enterprise-grade commercial real estate intelligence platform that combines AI-powered document processing with institutional-grade financial analysis. This platform helps CRE brokers, investors, and lenders make better-informed decisions by automating document analysis and providing deep insights into property performance.

### Key Features

- **AI Document Processing**: Automatically extract key data from rent rolls, P&Ls, and leases
- **Financial Analysis Engine**: Comprehensive deal metrics (NOI, Cap Rate, DSCR, IRR)
- **Intelligent Dashboard**: Modern, intuitive interface with real-time monitoring
- **Market Intelligence**: Treasury rates and SOFR spreads integration

## Technical Stack

### Backend
- **FastAPI**: Modern, high-performance web framework
- **MongoDB**: NoSQL database (with in-memory fallback option)
- **PyJWT**: JSON Web Token for authentication
- **Pydantic**: Data validation and settings management
- **Motor**: Async MongoDB driver
- **PyPDF2**: PDF processing library

### Frontend
- **Next.js**: React framework with SSR capabilities
- **Mantine UI**: Component library with dark mode support
- **TypeScript**: Type-safe JavaScript
- **Axios**: HTTP client for API requests
- **React Query**: Data fetching and state management
- **Recharts**: Composable charting library
- **React Hook Form**: Form validation

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- Python (v3.10 or higher)
- MongoDB (v5.0 or higher)

### Installation

#### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env.local file
cp .env.local.example .env.local

# Start the development server
npm run dev
```

#### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload
```

## Project Structure

The project follows a modular architecture with separate frontend and backend codebases:

```
abare-v2/
├── backend/              # FastAPI backend
│   ├── app/              # Application code
│   │   ├── api/          # API endpoints
│   │   ├── models/       # MongoDB models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── db/           # Database connections
│   ├── tests/            # Backend tests
│   └── static/           # Static files
│
└── frontend/             # Next.js frontend
    ├── public/           # Static assets
    └── src/              # Source code
        ├── components/   # React components
        ├── pages/        # Next.js pages
        ├── services/     # API client services
        ├── hooks/        # Custom React hooks
        ├── context/      # React contexts
        ├── utils/        # Utility functions
        └── styles/       # CSS and styling
```

## Features

### Authentication
- Secure user authentication with JWT
- Role-based access control

### Properties Management
- Add, edit, and view commercial real estate properties
- Track property metrics and performance

### Document Processing
- Upload and process various commercial real estate documents
- AI-powered data extraction from PDFs

### Financial Analysis
- Generate comprehensive financial analyses
- Visualize key metrics with interactive charts

## Development

### Running Tests

#### Backend Tests
```bash
cd backend
pytest
```

#### Frontend Tests
```bash
cd frontend
npm test
```

### Code Linting

#### Backend
```bash
cd backend
flake8
```

#### Frontend
```bash
cd frontend
npm run lint
```

## Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
For production, it's recommended to use Gunicorn with Uvicorn workers:
```bash
cd backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Docker Deployment
Docker support is coming soon.

## API Documentation

When the backend server is running, interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project is the successor to the original ABARE platform
- Built with modern, open-source technologies
- Developed for the commercial real estate industry 

## Project Status

This project is currently under active development. The frontend structure is in place, and we are now working on implementing the backend authentication API. 