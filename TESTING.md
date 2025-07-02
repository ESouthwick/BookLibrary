# Testing Guide for BookLibrary

This document provides comprehensive information about running unit tests for both the backend API and frontend React components.

## Backend API Tests

### Prerequisites
- .NET 9.0 SDK
- Visual Studio 2022 or VS Code with C# extensions

### Running Backend Tests

1. **Navigate to the backend test directory:**
   ```bash
   cd backend/BookLibraryApi.Tests
   ```

2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

3. **Run all tests:**
   ```bash
   dotnet test
   ```

4. **Run tests with coverage:**
   ```bash
   dotnet test --collect:"XPlat Code Coverage"
   ```

5. **Run tests with verbose output:**
   ```bash
   dotnet test --verbosity normal
   ```

### Backend Test Structure

The backend tests are located in `backend/BookLibraryApi.Tests/` and include:

- **BooksControllerTests.cs**: Comprehensive tests for all API endpoints
  - GET /api/books - Retrieve all books
  - GET /api/books/{id} - Retrieve book by ID
  - GET /api/books/stats - Get book statistics
  - POST /api/books - Create new book
  - PUT /api/books/{id} - Update existing book
  - DELETE /api/books/{id} - Delete book

### Test Features

- **In-Memory Database**: Uses Entity Framework Core's in-memory database for fast, isolated tests
- **Async/Await**: All tests are asynchronous to match the controller's async methods
- **Comprehensive Coverage**: Tests both success and error scenarios
- **Data Validation**: Tests input validation and business logic
- **HTTP Status Codes**: Verifies correct HTTP responses

## Frontend React Tests

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Running Frontend Tests

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Run all tests:**
   ```bash
   npm test
   ```

4. **Run tests in watch mode:**
   ```bash
   npm run test:watch
   ```

5. **Run tests with coverage:**
   ```bash
   npm run test:coverage
   ```

6. **Run tests with UI:**
   ```bash
   npm run test:ui
   ```

### Frontend Test Structure

The frontend tests are located in `frontend/src/components/__tests__/` and `frontend/src/api/__tests__/`:

#### Component Tests
- **StarRating.test.tsx**: Tests for the star rating component
  - Rendering 5 stars
  - Interactive hover and click functionality
  - Rating display and validation
  - Disabled state handling

- **BookForm.test.tsx**: Tests for the book form component
  - Form validation (required fields, length, format)
  - API integration (create/update)
  - Loading and error states
  - User interactions

- **BookList.test.tsx**: Tests for the book list component
  - Table and card view switching
  - Filtering by title, author, genre, rating
  - Sorting functionality
  - Delete confirmation
  - Loading and error states

- **StatsView.test.tsx**: Tests for the statistics view component
  - Statistics and ratings view switching
  - Chart type switching (bar/pie)
  - Data calculations and display
  - API integration

#### API Tests
- **booksApi.test.ts**: Tests for the API service layer
  - All CRUD operations
  - Error handling
  - Request/response validation
  - Axios integration

### Test Features

- **Vitest**: Fast test runner with native TypeScript support
- **React Testing Library**: User-centric testing approach
- **Mocking**: Comprehensive mocking of external dependencies
- **Async Testing**: Proper handling of async operations
- **Accessibility**: Tests include accessibility considerations

## Test Configuration

### Backend Configuration
- **Test Framework**: xUnit
- **Database**: Entity Framework Core In-Memory
- **Coverage**: Coverlet
- **Project File**: `BookLibraryApi.Tests.csproj`

### Frontend Configuration
- **Test Framework**: Vitest
- **Testing Library**: React Testing Library
- **Environment**: jsdom
- **Configuration**: `vitest.config.ts`

## Running All Tests

### Backend Tests
```bash
cd backend/BookLibraryApi.Tests
dotnet test --verbosity normal
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Combined Test Script (if using a monorepo tool)
```bash
# Backend tests
cd backend/BookLibraryApi.Tests && dotnet test && cd ../..

# Frontend tests
cd frontend && npm test && cd ..
```

## Test Coverage Goals

### Backend Coverage
- **Controllers**: 100% endpoint coverage
- **Business Logic**: 90%+ coverage
- **Error Handling**: 100% coverage
- **Data Validation**: 100% coverage

### Frontend Coverage
- **Components**: 90%+ coverage
- **User Interactions**: 100% coverage
- **API Integration**: 100% coverage
- **Error States**: 100% coverage

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '9.0.x'
      - run: cd backend/BookLibraryApi.Tests && dotnet test
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci && npm test
```

## Troubleshooting

### Common Backend Test Issues
1. **Database Connection**: Ensure in-memory database is properly configured
2. **Dependencies**: Run `dotnet restore` to ensure all packages are installed
3. **Test Isolation**: Each test uses a unique database instance

### Common Frontend Test Issues
1. **Module Resolution**: Ensure all dependencies are installed with `npm install`
2. **Mock Configuration**: Check that mocks are properly set up in `src/test/setup.ts`
3. **Environment**: Ensure jsdom is properly configured for DOM testing

## Best Practices

### Backend Testing
- Use descriptive test names that explain the scenario
- Test both positive and negative cases
- Use arrange-act-assert pattern
- Mock external dependencies
- Test edge cases and error conditions

### Frontend Testing
- Test user behavior, not implementation details
- Use accessible queries (getByRole, getByLabelText)
- Test error states and loading states
- Mock API calls and external dependencies
- Test component integration

## Performance Considerations

### Backend Tests
- Use in-memory database for fast execution
- Avoid unnecessary database operations
- Use test data builders for complex objects

### Frontend Tests
- Mock heavy dependencies (charts, external APIs)
- Use shallow rendering when appropriate
- Avoid testing implementation details
- Focus on user interactions and outcomes 