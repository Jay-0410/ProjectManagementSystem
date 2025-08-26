# Data Source Configuration Guide

This project supports easy switching between mock data and server API data. You can change the data source with a single configuration change.

## Quick Setup

### 🔧 To Use Mock Data (Default)
Open `src/config/dataSource.js` and set:
```javascript
export const USE_MOCK_DATA = true;
```

### 🌐 To Use Server API
Open `src/config/dataSource.js` and set:
```javascript
export const USE_MOCK_DATA = false;
```

## Configuration Options

### Main Configuration File: `src/config/dataSource.js`

```javascript
// Primary switch - change this line to switch data sources
export const USE_MOCK_DATA = true; // Set to false for server API

// Alternative: Use environment-based configuration (Vite)
// export const USE_MOCK_DATA = import.meta.env.DEV; // true in development, false in production

export const DATA_SOURCE_CONFIG = {
  // API settings (used when USE_MOCK_DATA is false)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  endpoints: {
    projects: '/projects',
    projectById: '/projects/{id}',
    // ... more endpoints
  },
  
  // Mock data settings
  mockDelay: 500, // Simulate network delay (milliseconds)
};
```

## Environment Variables

Create a `.env` file in your project root:

```env
# For production API
VITE_API_BASE_URL=https://your-api-server.com/api

# For local development API
# VITE_API_BASE_URL=http://localhost:8080/api
```

## Features

### ✅ Automatic Fallback
- If server API fails, automatically falls back to mock data
- Comprehensive error handling and logging

### ✅ Consistent Interface
- Same function calls work for both mock and real data
- No need to change component code

### ✅ Development Features
- Console logging shows current data source
- Simulated network delays for realistic testing
- Easy debugging with source identification

### ✅ Production Ready
- Environment-based configuration
- Proper error handling
- Timeout and retry configuration

## Usage Examples

### Components automatically use the configured data source:

```javascript
import projectService from '../services/projectService';

// This works with both mock and real API
const projects = await projectService.getAllProjects();
const project = await projectService.getProjectById(id);
const filtered = await projectService.getProjectsByCategory('web');
```

### Check current configuration:
```javascript
import { shouldUseMockData } from '../config/dataSource';

console.log('Using mock data:', shouldUseMockData());
```

## Switching Data Sources

### For Development:
1. Set `USE_MOCK_DATA = true` in `dataSource.js`
2. Optionally adjust `mockDelay` for testing loading states

### For Production:
1. Set `USE_MOCK_DATA = false` in `dataSource.js`
2. Configure `VITE_API_BASE_URL` in environment variables
3. Ensure your API endpoints match the configuration

### For Testing:
1. Use environment-based switching:
   ```javascript
   export const USE_MOCK_DATA = import.meta.env.DEV; // Vite environment variable
   ```

## API Endpoint Structure

When using server API, ensure your endpoints follow this structure:

- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `GET /api/projects?category={category}` - Filter by category
- `GET /api/projects?search={keyword}` - Search projects
- `GET /api/projects?status={status}` - Filter by status
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

## Console Output

The application will log the current data source:
- `📊 Data loaded from: Mock Data`
- `📊 Data loaded from: Server API`
- `🔄 Server request failed, falling back to mock data...`

## Files Modified

- `src/config/dataSource.js` - Main configuration
- `src/services/projectService.js` - Data service layer
- `src/pages/Home/ProjectList/ProjectList.jsx` - Updated to use service
- `src/pages/ProjectDetails/ProjectDetails.jsx` - Updated to use service

## Benefits

1. **One-Line Switch** - Change data source instantly
2. **No Code Duplication** - Same service layer for both sources
3. **Robust Error Handling** - Automatic fallbacks and logging
4. **Development Friendly** - Mock delays and debugging features
5. **Production Ready** - Environment configuration and proper error handling
