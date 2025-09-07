# System User Management Module

This module provides a comprehensive interface for managing system users - creating, listing, updating, and monitoring system administrators, operators, and other system-level users.

## 🎯 Features

### ✅ **User Management**
- **Create System Users**: Add new system users with detailed information
- **List & View**: Display all system users with pagination and filtering
- **Edit Users**: Update user details, roles, and permissions
- **Activate/Deactivate**: Enable or disable user accounts
- **Password Management**: Reset passwords and unlock accounts

### ✅ **Advanced Filtering & Search**
- **Search**: Find users by username, email, employee ID, name, or department
- **Filter by Department**: IT, HR, Finance, Operations, Security, Management, Support
- **Filter by Role**: System Admin, System Manager, System Operator, System Viewer
- **Filter by Status**: Active, Inactive, Locked, Verified
- **Quick Filters**: One-click filtering for common scenarios

### ✅ **Statistics & Analytics**
- **Overview Stats**: Total users, active users, verified users, locked users
- **Department Distribution**: Visual breakdown by department
- **Role Distribution**: Visual breakdown by system role
- **Interactive Charts**: Click on stats to filter users

### ✅ **Security Features**
- **Role-Based Access**: Different permissions for different system roles
- **Access Levels**: 1-5 access levels with different capabilities
- **Permission Management**: Granular permission system
- **Account Security**: Lockout, password expiry, two-factor ready

## 📁 Components

### 1. **SystemUserManagement** (Main Component)
- Main container component that orchestrates all functionality
- Handles state management and API calls
- Provides the overall layout and user experience

### 2. **SystemUserList**
- Displays system users in a responsive table format
- Shows user information, status, and action buttons
- Handles pagination and user interactions
- Includes password reset and account unlock functionality

### 3. **SystemUserForm**
- Form for creating and editing system users
- Comprehensive validation and error handling
- Permission selection with category grouping
- Role-based access level assignment

### 4. **SystemUserStats**
- Interactive statistics dashboard
- Clickable stats for filtering
- Visual distribution charts
- Quick action buttons

### 5. **SystemUserFilters**
- Advanced search and filtering interface
- Real-time search functionality
- Quick filter buttons for common scenarios
- Active filter display and management

## 🔧 Usage

### Basic Usage
```tsx
import { SystemUserManagement } from './components/SystemUserManagement';

function App() {
  return (
    <div className="app">
      <SystemUserManagement />
    </div>
  );
}
```

### With Custom Styling
```tsx
import { SystemUserManagement } from './components/SystemUserManagement';

function App() {
  return (
    <div className="app">
      <SystemUserManagement className="custom-system-users" />
    </div>
  );
}
```

## 🎨 Styling

The module includes comprehensive CSS styling with:
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface
- **Interactive Elements**: Hover effects, transitions, and animations
- **Accessibility**: Proper contrast, focus states, and ARIA labels
- **Customizable**: Easy to override with custom CSS

## 🔐 Security

### Authentication Required
- Uses system user authentication (separate from community users)
- Requires system user JWT token
- Different API endpoints (`/api/system/auth/*`)

### Permission-Based Access
- **System Admin**: Full access to all features
- **System Manager**: Can manage users and view stats
- **System Operator**: Limited user management
- **System Viewer**: Read-only access

## 📊 Data Flow

1. **Load Data**: Component loads system users and statistics
2. **User Interactions**: Search, filter, create, edit, delete operations
3. **API Calls**: All operations go through SystemUserManagementService
4. **State Updates**: UI updates based on API responses
5. **Error Handling**: Comprehensive error handling and user feedback

## 🚀 API Integration

The module integrates with the following API endpoints:

### System User Management
- `GET /api/system/users` - List system users
- `POST /api/system/auth/register` - Create system user
- `PUT /api/system/users/:id` - Update system user
- `POST /api/system/users/:id/activate` - Activate user
- `POST /api/system/users/:id/deactivate` - Deactivate user
- `POST /api/system/users/:id/reset-password` - Reset password
- `POST /api/system/users/:id/unlock` - Unlock account

### Statistics & Search
- `GET /api/system/users/stats` - Get user statistics
- `GET /api/system/users/search` - Search users
- `GET /api/system/users/department/:dept` - Filter by department
- `GET /api/system/users/role/:role` - Filter by role

## 🎯 User Roles & Permissions

### System Admin (Level 5)
- Full access to all features
- Can create, edit, delete any system user
- Can reset passwords and unlock accounts
- Can view all statistics and reports

### System Manager (Level 4)
- Can manage most system users
- Can view statistics and reports
- Cannot delete system admins
- Limited password management

### System Operator (Level 3)
- Can view and edit limited user information
- Can view basic statistics
- Cannot create or delete users
- Read-only access to most features

### System Viewer (Level 2)
- Read-only access to user information
- Can view basic statistics
- Cannot modify any user data
- Limited feature access

## 🔧 Configuration

### Environment Variables
```env
# System JWT Secret (different from community users)
SYSTEM_JWT_SECRET=your-system-secret-key

# API Base URL
REACT_APP_API_URL=http://localhost:5000
```

### Service Configuration
The `SystemUserManagementService` can be configured with:
- Custom API base URL
- Custom authentication headers
- Request/response interceptors
- Error handling strategies

## 📱 Responsive Design

The module is fully responsive and works on:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Simplified interface with essential features

## 🎨 Customization

### CSS Customization
```css
/* Override default styles */
.system-user-management {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --success-color: #your-color;
  --warning-color: #your-color;
  --danger-color: #your-color;
}
```

### Component Customization
```tsx
// Custom form validation
const customValidation = (userData) => {
  // Your custom validation logic
};

// Custom permission options
const customPermissions = [
  { value: 'custom:permission', label: 'Custom Permission', category: 'Custom' }
];
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure system user is logged in
   - Check JWT token validity
   - Verify API endpoints are accessible

2. **Permission Errors**
   - Check user's system role and access level
   - Verify required permissions are assigned
   - Ensure user is active and verified

3. **API Connection Issues**
   - Check API base URL configuration
   - Verify backend server is running
   - Check network connectivity

### Debug Mode
Enable debug mode by setting:
```javascript
localStorage.setItem('debug', 'system-user-management');
```

## 📚 Related Documentation

- [System User Management Service](../services/SystemUserManagementService.ts)
- [System User API Documentation](../../../community-backend/SYSTEM_USERS_README.md)
- [Authentication Guide](../../../community-backend/LOGIN_ROUTES_SEPARATION.md)

## 🚀 Future Enhancements

- **Bulk Operations**: Select multiple users for bulk actions
- **Export/Import**: Export user data to CSV/Excel
- **Audit Logs**: Track all user management activities
- **Advanced Analytics**: More detailed statistics and reports
- **Two-Factor Authentication**: Enhanced security features
- **User Groups**: Group users for easier management
