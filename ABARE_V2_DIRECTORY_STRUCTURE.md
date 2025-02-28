# ABARE v2 Directory Structure

```
abare-v2/
├── README.md
├── requirements.txt
├── ABARE_V2_IMPLEMENTATION_PLAN.md
├── ABARE_V2_DIRECTORY_STRUCTURE.md
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── deps.py
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── router.py
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── router.py
│   │   │   │   └── utils.py
│   │   │   │
│   │   │   ├── properties/
│   │   │   │   ├── __init__.py
│   │   │   │   └── router.py
│   │   │   │
│   │   │   ├── documents/
│   │   │   │   ├── __init__.py
│   │   │   │   └── router.py
│   │   │   │
│   │   │   └── analyses/
│   │   │       ├── __init__.py
│   │   │       └── router.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── property.py
│   │   │   ├── document.py
│   │   │   └── analysis.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── property.py
│   │   │   ├── document.py
│   │   │   └── analysis.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── property.py
│   │   │   ├── document.py
│   │   │   └── analysis.py
│   │   │
│   │   └── db/
│   │       ├── __init__.py
│   │       └── mongodb.py
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_properties.py
│   │   ├── test_documents.py
│   │   └── test_analyses.py
│   │
│   └── static/
│       └── uploads/
│
└── frontend/
    ├── public/
    │   ├── favicon.ico
    │   └── assets/
    │       └── images/
    │
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Layout.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── Footer.jsx
    │   │   │
    │   │   ├── ui/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Card.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── Form.jsx
    │   │   │   ├── Table.jsx
    │   │   │   └── Loader.jsx
    │   │   │
    │   │   ├── auth/
    │   │   │   ├── LoginForm.jsx
    │   │   │   └── RegisterForm.jsx
    │   │   │
    │   │   ├── properties/
    │   │   │   ├── PropertyCard.jsx
    │   │   │   ├── PropertyForm.jsx
    │   │   │   ├── PropertyList.jsx
    │   │   │   └── PropertyDetails.jsx
    │   │   │
    │   │   ├── documents/
    │   │   │   ├── DocumentUpload.jsx
    │   │   │   ├── DocumentList.jsx
    │   │   │   └── DocumentViewer.jsx
    │   │   │
    │   │   └── analyses/
    │   │       ├── AnalysisForm.jsx
    │   │       ├── AnalysisList.jsx
    │   │       └── AnalysisResults.jsx
    │   │
    │   ├── pages/
    │   │   ├── index.jsx
    │   │   ├── dashboard.jsx
    │   │   ├── login.jsx
    │   │   ├── register.jsx
    │   │   │
    │   │   ├── properties/
    │   │   │   ├── index.jsx
    │   │   │   ├── [id].jsx
    │   │   │   └── new.jsx
    │   │   │
    │   │   ├── documents/
    │   │   │   ├── index.jsx
    │   │   │   ├── [id].jsx
    │   │   │   └── upload.jsx
    │   │   │
    │   │   └── analyses/
    │   │       ├── index.jsx
    │   │       ├── [id].jsx
    │   │       └── new.jsx
    │   │
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── auth.js
    │   │   ├── properties.js
    │   │   ├── documents.js
    │   │   └── analyses.js
    │   │
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useProperties.js
    │   │   ├── useDocuments.js
    │   │   └── useAnalyses.js
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   │
    │   ├── utils/
    │   │   ├── formatters.js
    │   │   └── validators.js
    │   │
    │   └── styles/
    │       └── globals.css
    │
    ├── .env.local
    ├── .env.development
    ├── .env.production
    ├── next.config.js
    ├── package.json
    └── tailwind.config.js
```

## Explanation of Key Directories

### Backend Structure

- **app/**: Main package containing all application code
  - **main.py**: Entry point of the application
  - **config.py**: Configuration settings
  - **deps.py**: Dependency injection utilities
  
  - **api/**: API routes and controllers
    - **router.py**: Main API router
    - **auth/**, **properties/**, etc.: Route modules by feature
  
  - **models/**: MongoDB document models
  - **schemas/**: Pydantic schemas for validation
  - **services/**: Business logic layer
  - **db/**: Database connection and utilities

- **tests/**: Unit and integration tests
- **static/**: Static files including document uploads

### Frontend Structure

- **public/**: Static assets served directly
- **src/**: Source code
  - **components/**: React components organized by feature
  - **pages/**: Next.js pages and routing
  - **services/**: API client services
  - **hooks/**: Custom React hooks
  - **context/**: React context providers
  - **utils/**: Utility functions
  - **styles/**: CSS and styling files 