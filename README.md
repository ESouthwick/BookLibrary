# BookLibrary

A full-stack book management application built with React frontend and .NET 9 Web API backend. The application allows users to manage their book collection with features like adding, editing, deleting books, viewing statistics, and filtering/searching capabilities.

## Features

- **Book Management**: Add, edit, delete, and view books
- **Rich Book Details**: Title, author, genre, publication date, and star ratings
- **Advanced Filtering**: Filter by title, author, genre, and rating with exact matching
- **Statistics Dashboard**: View book statistics with interactive charts (bar and pie charts)
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Validation**: Form validation with immediate feedback
- **Star Rating System**: Interactive 5-star rating component with visual feedback
- **Comprehensive Testing**: Full test coverage for both frontend and backend
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Modern UI/UX**: Clean, intuitive interface with proper error handling

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API communication
- **Chart.js** with react-chartjs-2 for data visualization
- **Vitest** with React Testing Library for testing
- **CSS Modules** for component styling

### Backend
- **.NET 9** Web API
- **Entity Framework Core** with SQLite
- **xUnit** for testing
- **Swagger/OpenAPI** for API documentation

## Recent Updates & Improvements

### Latest Enhancements (Latest Release)

#### 🎯 **Enhanced User Experience**
- **Improved Filtering**: Genre filter now uses exact matching instead of partial matching
- **Better Error Handling**: Comprehensive error messages and loading states
- **Enhanced Form Validation**: Real-time validation with clear feedback
- **Responsive Layout**: Optimized for all screen sizes

#### 🧪 **Comprehensive Testing**
- **Backend Tests**: 13 xUnit tests covering all API endpoints and edge cases
- **Frontend Tests**: 66 Vitest tests with React Testing Library
- **Test Scripts**: Automated test runners for both platforms
- **Mock API**: Proper API mocking for isolated frontend testing

#### 🛠️ **Development Experience**
- **Concurrent App Runner**: Scripts to run both frontend and backend simultaneously
- **Automatic Setup**: Scripts handle database migrations and dependency installation
- **Cross-Platform Support**: PowerShell (Windows) and Bash (Linux/macOS) scripts
- **API Documentation**: Live Swagger UI for API exploration and testing

#### 🔧 **Technical Improvements**
- **React 19 Compatibility**: Updated to latest React version with proper testing library support
- **TypeScript Strict Mode**: Enhanced type safety throughout the application
- **Performance Optimizations**: Efficient re-renders and optimized API calls
- **Code Quality**: ESLint configuration and consistent code formatting

#### 📊 **Data Visualization**
- **Interactive Charts**: Bar charts for genre distribution and publication years
- **Statistics Dashboard**: Combined view with ratings and book statistics
- **Real-time Updates**: Charts update automatically when data changes

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

### Common Issues

#### npm install fails with React dependency conflicts
If you encounter errors like `ERESOLVE could not resolve` or conflicts between React versions:

```bash
# The package.json has been updated to fix React 19 compatibility
# If you still encounter issues, try:
npm install --legacy-peer-deps
```

#### Node.js version warnings
If you see warnings about Node.js version requirements:
- **Warning only**: The application will still work with Node.js 18+
- **For optimal experience**: Consider upgrading to Node.js 20.19.0+ or 22.12.0+

#### Security vulnerabilities in dev dependencies
The project may show moderate security vulnerabilities in development dependencies (esbuild, vite, vitest). These are:
- **Development-only**: Don't affect production builds
- **Low risk**: Related to development server features
- **Optional fix**: Can be addressed with `npm audit fix --force` (may cause breaking changes)

## Quick Start

For developers who want to get up and running quickly:

```bash
# 1. Clone and navigate to the project
git clone <repository-url>
cd BookLibrary

# 2. Run both applications (handles setup automatically)
.\run-apps.ps1  # Windows
# OR
./run-apps.sh   # Linux/macOS

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
- ✅ Start both backend API and frontend development server
- ✅ Run database migrations if needed
- ✅ Install frontend dependencies if needed
- ✅ Show clear URLs for accessing each application
- ✅ Handle graceful shutdown with Ctrl+C

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
- `https://localhost:7226/swagger` (HTTPS)
- `http://localhost:5086/swagger` (HTTP)

### API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get a specific book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/{id}` - Update an existing book
- `DELETE /api/books/{id}` - Delete a book

### Important Notes

- **Root URL**: The root URL (`http://localhost:5086` or `https://localhost:7226`) will show "Page Can't Be Reached" - this is normal behavior for REST APIs
- **API Access**: Use the specific endpoint URLs (e.g., `/api/books`) to interact with the API
- **Swagger UI**: The best way to explore and test the API is through the Swagger interface

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
- `./run-tests.ps1` (Windows)
- `./run-apps.ps1` (Windows)

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
│   │   ├── api/                  # API service layer (booksApi)
│   │   ├── __tests__/            # Frontend tests (66 tests)
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
├── run-apps.sh                   # Bash script for running both apps concurrently
├── run-tests.ps1                 # PowerShell script for running all tests
├── run-tests.sh                  # Bash script for running all tests
└── TESTING.md                    # Comprehensive testing guide
```

## Design Decisions and Trade-offs

### Architecture Decisions

1. **Monorepo Structure**: 
   - **Pros**: Easier to manage dependencies, consistent tooling, simplified CI/CD
   - **Cons**: Larger repository size, potential for tight coupling

2. **SQLite Database**:
   - **Pros**: Zero configuration, portable, perfect for development and small deployments
   - **Cons**: Limited concurrent users, not suitable for high-scale production

3. **React 19 with TypeScript**:
   - **Pros**: Type safety, better developer experience, modern React features
   - **Cons**: Learning curve for TypeScript, additional build complexity

### Frontend Design Decisions

1. **Component Architecture**:
   - **Reusable Components**: StarRating, BookForm, BookList designed for reusability
   - **Separation of Concerns**: API logic separated from UI components
   - **State Management**: Local state with React hooks (no external state management needed for this scale)

2. **Form Validation**:
   - **Real-time Validation**: Immediate feedback on field blur and submit
   - **Comprehensive Rules**: Length limits, character validation, date constraints
   - **User Experience**: Clear error messages with data-testid for testing

3. **Data Visualization**:
   - **Chart.js Integration**: Professional charts with smooth animations
   - **Multiple Chart Types**: Bar and pie charts for different data perspectives
   - **Responsive Design**: Charts adapt to container size

### Backend Design Decisions

1. **API Design**:
   - **RESTful Endpoints**: Standard HTTP methods for CRUD operations
   - **Consistent Response Format**: Standardized error handling and success responses
   - **Swagger Documentation**: Auto-generated API documentation

2. **Database Design**:
   - **Entity Framework Core**: ORM for type-safe database operations
   - **Code-First Approach**: Database schema defined in C# models
   - **Migrations**: Version-controlled database schema changes

3. **Testing Strategy**:
   - **In-Memory Database**: Fast, isolated tests without external dependencies
   - **Comprehensive Coverage**: Tests for all endpoints, validation, and error scenarios
   - **Async Testing**: Proper handling of asynchronous operations

### Performance Considerations

1. **Frontend Performance**:
   - **Vite Build Tool**: Fast development server and optimized production builds
   - **Lazy Loading**: Components loaded on demand
   - **Efficient Re-renders**: React.memo and useMemo for expensive operations

2. **Backend Performance**:
   - **Async Operations**: Non-blocking API calls
   - **Efficient Queries**: Optimized Entity Framework queries
   - **Caching**: HTTP response caching where appropriate

### Security Considerations

1. **Input Validation**: 
   - **Frontend**: Client-side validation for immediate feedback
   - **Backend**: Server-side validation for security
   - **Character Restrictions**: Prevent injection attacks

2. **CORS Configuration**: Properly configured for development and production
3. **HTTPS**: Configured for secure communication in production

## Development Workflow

1. **Feature Development**:
   - Create feature branch from main
   - Implement backend API endpoints first
   - Add comprehensive tests
   - Implement frontend components
   - Test integration

2. **Testing Strategy**:
   - Unit tests for all components and API endpoints
   - Integration tests for API workflows
   - Manual testing for user experience

3. **Code Quality**:
   - ESLint for frontend code quality
   - TypeScript for type safety
   - Consistent code formatting

## Deployment Considerations

### Frontend Deployment
- Build optimized production bundle: `npm run build`
- Serve static files from any web server
- Configure environment variables for API endpoints

### Backend Deployment
- Publish self-contained application: `dotnet publish -c Release`
- Configure production database (PostgreSQL/MySQL recommended)
- Set up reverse proxy (nginx/Apache)
- Configure HTTPS certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.