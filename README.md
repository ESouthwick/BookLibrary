# BookLibrary

A full-stack book management application built with React frontend and .NET 9 Web API backend. The application allows users to manage their book collection with features like adding, editing, deleting books, viewing comprehensive statistics, and advanced filtering/searching capabilities.

## Features

- **Book Management**: Add, edit, delete, and view books with comprehensive validation
- **Advanced Filtering**: Filter by title, author, genre, and rating with exact matching
- **Comprehensive Statistics Dashboard**: View detailed book statistics with interactive charts (bar and pie charts), summary cards, and data tables
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Validation**: Comprehensive form validation with immediate feedback
- **Star Rating System**: Interactive 5-star rating component with visual feedback
- **Comprehensive Testing**: Full test coverage for both frontend and backend
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API communication with interceptors
- **Chart.js** with react-chartjs-2 for data visualization
- **Vitest** with React Testing Library for testing
- **CSS Modules** for component styling

### Backend
- **.NET 9** Web API
- **Entity Framework Core** with SQLite
- **xUnit** for testing
- **Swagger/OpenAPI** for API documentation

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and npm
- **.NET 9 SDK**
- **Git** for version control

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check .NET version
dotnet --version
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BookLibrary
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend/BookLibraryApi

# Restore .NET dependencies
dotnet restore

# Run database migrations
dotnet ef database update

# Build the project
dotnet build
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Build the project
npm run build
```

## Troubleshooting

#### If npm install fails with React dependency conflicts
If you encounter errors like `ERESOLVE could not resolve` or conflicts between React versions:

```bash
# The package.json has been updated to fix React 19 compatibility
# If you still encounter issues, try:
npm install --legacy-peer-deps
```

## Quick Start

For developers who want to get up and running quickly:

```bash
# 1. Clone and navigate to the project
git clone <repository-url>
cd BookLibrary

# 2. Run both applications (handles setup automatically)
`.\run-apps.ps1`  # Windows

# 3. Access the applications
# Frontend: http://localhost:5173
# API Docs: http://localhost:5086/swagger
```

The scripts will automatically:
- Install dependencies
- Run database migrations
- Start both frontend and backend servers
- Open applications in separate windows

## Running the Applications

### Option 1: Run Both Apps Concurrently (Recommended)

#### Using PowerShell (Windows)
```powershell
# In the root directory
.\run-apps.ps1
```

#### Using Bash (Linux/macOS)
```bash
# In the root directory
./run-apps.sh
```

**What these scripts do:**
- Start both backend API and frontend development server
- Run database migrations if needed
- Install frontend dependencies if needed
- Show clear URLs for accessing each application
- Handle graceful shutdown with Ctrl+C

**Access URLs:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5086
- **API Documentation**: http://localhost:5086/swagger

### Option 2: Run Apps Separately

#### Backend API
```bash
cd backend/BookLibraryApi
dotnet run
```

#### Frontend Application
```bash
cd frontend
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## API Documentation

Once the backend is running, you can access the Swagger API documentation at:
- `http://localhost:5086/swagger` (HTTP)

### API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get a specific book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/{id}` - Update an existing book
- `DELETE /api/books/{id}` - Delete a book
- `GET /api/books/stats` - Get book statistics

### Important Notes

- **Root URL**: The root URL (`http://localhost:5086`) will show "Page Can't Be Reached" - this is normal behavior for REST APIs
- **API Access**: With the backend running use the specific endpoint URLs (`http://localhost:5086/api/books`) to interact with the API
- **Swagger UI**: The best way to explore and test the API is through the Swagger interface With the backend running go here(`http://localhost:5086/swagger/`)

## Testing

### Backend Tests
```bash
cd backend/BookLibraryApi.Tests
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
```

For detailed testing information, see [TESTING.md](./TESTING.md).

**Note:** There are also test runner scripts available:
- `.\run-tests.ps1` (Windows)

## Project Structure

```
BookLibrary/
├── backend/
│   ├── BookLibraryApi/           # .NET 9 Web API
│   │   ├── Controllers/          # API endpoints (BooksController)
│   │   ├── Data/                 # Entity Framework context
│   │   ├── Models/               # Data models (Book entity)
│   │   ├── Migrations/           # Database migrations
│   │   └── Properties/           # Launch settings and configuration
│   └── BookLibraryApi.Tests/     # Backend unit tests (13 tests)
├── frontend/
│   ├── src/
│   │   ├── components/           # React components (BookList, BookForm, StarRating, StatsView)
│   │   ├── api/                  # API service layer (booksApi with axios interceptors)
│   │   ├── services/             # Business logic layer (BookService)
│   │   ├── hooks/                # Custom hooks (useBooks, useBookFilters, useBookStats)
│   │   ├── types/                # TypeScript interfaces and types
│   │   ├── __tests__/            # Frontend tests (46 tests)
│   │   └── assets/               # Static assets and images
│   ├── public/                   # Public assets
│   └── package.json              # Dependencies and scripts
├── run-apps.ps1                  # PowerShell script for running both apps concurrently
├── run-apps.sh                   # Bash script for running both apps concurrently
├── run-tests.ps1                 # PowerShell script for running all tests
├── run-tests.sh                  # Bash script for running all tests
├── README.md                     # This file
└── TESTING.md                    # Comprehensive testing guide
```

## Key Features in Detail


## Recent Updates & Improvements

### Enhancements 

#### **Enhanced Statistics Dashboard**
- **Comprehensive Stats Cards**: 6 summary cards showing Total Books, Average Rating, Top Genre, Top Rating, Distinct Authors, and Newest Book
- **Interactive Charts**: Toggle between Bar and Pie charts for both Genre and Rating statistics
- **Data Tables**: Detailed tables showing genre distribution and rating breakdown with percentages
- **Clean Pie Charts**: Removed grid lines and background for cleaner pie chart visualization
- **Rating Integration**: Star ratings displayed inline with rating labels throughout the application
- **Responsive Layout**: Stats cards and tables adapt to different screen sizes

#### **Enhanced Form Validation & User Experience**
- **Comprehensive Validation Rules**: 
  - Title: Minimum 2 characters, maximum 100 characters
  - Author: No numbers allowed, maximum 50 characters
  - Published Date: Cannot be in the future, proper date format validation
  - Genre: Required field validation
  - Rating: Must be between 1-5 stars
- **Real-time Validation**: Immediate feedback on field blur and form submission
- **Clear Error Messages**: User-friendly validation messages with proper data-testid attributes
- **Improved Filtering**: Genre filter uses exact matching instead of partial matching
- **Better Error Handling**: Comprehensive error messages and loading states
- **Responsive Layout**: Optimized for all screen sizes

#### **Comprehensive Testing Suite**
- **Backend Tests**: 13 xUnit tests covering all API endpoints and edge cases
- **Frontend Tests**: 46 Vitest tests with React Testing Library covering all components
- **Test Coverage**: 
  - BookForm: 8 tests (form rendering, validation, submission, editing)
  - BookList: 14 tests (filtering, sorting, pagination, CRUD operations)
  - StatsView: 13 tests (chart rendering, data visualization, empty states)
  - StarRating: 11 tests (interactive rating, visual feedback, accessibility)
- **Stable Test Selectors**: All tests use data-testid attributes for reliable element selection
- **Mock API**: Proper API mocking for isolated frontend testing

#### **Architecture Improvements**
- **Service Layer**: Centralized business logic in BookService for validation, filtering, and data transformation
- **Custom Hooks**: Reusable hooks for data fetching (useBooks), filtering (useBookFilters), and statistics (useBookStats)
- **API Layer**: Centralized API communication with axios interceptors for logging and error handling
- **Type Safety**: Comprehensive TypeScript interfaces and strict type checking
- **Separation of Concerns**: Clear separation between presentation, business logic, and API layers

#### **Development Experience**
- **Concurrent App Runner**: Scripts to run both frontend and backend simultaneously
- **Automatic Setup**: Scripts handle database migrations and dependency installation
- **Cross-Platform Support**: PowerShell (Windows) and Bash (Linux/macOS) scripts
- **API Documentation**: Live Swagger UI for API exploration and testing
- **React 19 Compatibility**: Updated to latest React version with proper testing library support

#### **Technical Improvements**
- **TypeScript Strict Mode**: Enhanced type safety throughout the application
- **Performance Optimizations**: Efficient re-renders and optimized API calls
- **Code Quality**: ESLint configuration and consistent code formatting
- **Error Boundaries**: Proper error handling and user feedback
- **Accessibility**: ARIA labels and keyboard navigation support

#### **Data Visualization**
- **Interactive Charts**: Bar and pie charts for genre distribution and ratings
- **Statistics Dashboard**: Comprehensive view with summary cards, tables, and charts
- **Real-time Updates**: Charts update automatically when data changes
- **Empty States**: Proper handling of empty data scenarios
- **Clean Visualization**: Optimized chart options for different chart types

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.