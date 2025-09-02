# User Display Components & localStorage Utilities

This directory contains components and utilities for displaying user information from localStorage in your React application.

## Overview

The user data is stored in localStorage with the key `'user'` and contains the following structure:

```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'moderator' | 'member';
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Components

### 1. UserDisplay

A flexible component for displaying user information with avatar and optional details.

```tsx
import { UserDisplay } from './components/UserDisplay';

// Basic usage
<UserDisplay />

// With full information
<UserDisplay showFullInfo={true} showAvatar={true} />

// Name only
<UserDisplay showFullInfo={false} showAvatar={true} />
```

**Props:**
- `showFullInfo?: boolean` - Show role, email, and username (default: false)
- `showAvatar?: boolean` - Show user avatar with initials (default: true)
- `className?: string` - Additional CSS classes

### 2. UserName

Simple component that displays just the user's full name.

```tsx
import { UserName } from './components/UserDisplay';

<UserName />
```

### 3. UserFirstName

Simple component that displays just the user's first name.

```tsx
import { UserFirstName } from './components/UserDisplay';

<UserFirstName />
```

## React Hooks

### 1. useLocalStorageUser

Main hook that provides all user information and utilities.

```tsx
import { useLocalStorageUser } from '../hooks/useLocalStorageUser';

const MyComponent = () => {
  const { 
    user,           // Full user object or null
    userName,       // Full name (firstName + lastName)
    firstName,      // First name
    lastName,       // Last name
    username,       // Username
    email,          // Email
    role,           // User role
    isLoggedIn,     // Boolean indicating if user is logged in
    isLoading,      // Boolean indicating if data is being loaded
    refreshUser     // Function to refresh user data from localStorage
  } = useLocalStorageUser();

  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      <p>Role: {role}</p>
      <p>Email: {email}</p>
    </div>
  );
};
```

### 2. useUserName

Simple hook that returns just the user's full name.

```tsx
import { useUserName } from '../hooks/useLocalStorageUser';

const MyComponent = () => {
  const userName = useUserName();
  return <h1>Hello, {userName}!</h1>;
};
```

### 3. useUserFirstName

Simple hook that returns just the user's first name.

```tsx
import { useUserFirstName } from '../hooks/useLocalStorageUser';

const MyComponent = () => {
  const firstName = useUserFirstName();
  return <h1>Hello, {firstName}!</h1>;
};
```

### 4. useIsLoggedIn

Simple hook that returns a boolean indicating if the user is logged in.

```tsx
import { useIsLoggedIn } from '../hooks/useLocalStorageUser';

const MyComponent = () => {
  const isLoggedIn = useIsLoggedIn();
  
  if (!isLoggedIn) {
    return <div>Please log in to continue</div>;
  }
  
  return <div>Welcome back!</div>;
};
```

## Browser Console Utilities

You can also use these functions directly in the browser console:

### Load the utilities

First, include the utility script in your HTML or run it in the console:

```javascript
// Copy and paste the contents of getUserFromStorage.js into the console
```

### Available Functions

- `getLoggedInUser()` - Get full user object
- `getLoggedInUserName()` - Get user's full name
- `getLoggedInUserFirstName()` - Get user's first name
- `getLoggedInUserLastName()` - Get user's last name
- `getLoggedInUserUsername()` - Get user's username
- `getLoggedInUserEmail()` - Get user's email
- `getLoggedInUserRole()` - Get user's role
- `isUserLoggedIn()` - Check if user is logged in
- `displayUserInfo()` - Display all user info in console

### Example Usage in Console

```javascript
// Get user's name
console.log(getLoggedInUserName());

// Check if logged in
if (isUserLoggedIn()) {
  console.log('User is logged in');
  displayUserInfo();
} else {
  console.log('No user logged in');
}
```

## Integration Examples

### 1. In Header/Navigation

```tsx
import { useLocalStorageUser } from '../hooks/useLocalStorageUser';

const Header = () => {
  const { userName, isLoggedIn } = useLocalStorageUser();
  
  return (
    <header>
      <div className="user-info">
        {isLoggedIn ? (
          <span>Welcome, {userName}</span>
        ) : (
          <span>Please log in</span>
        )}
      </div>
    </header>
  );
};
```

### 2. In Dashboard

```tsx
import { UserDisplay } from './components/UserDisplay';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="welcome-section">
        <UserDisplay showFullInfo={true} />
      </div>
      {/* Rest of dashboard content */}
    </div>
  );
};
```

### 3. Conditional Rendering

```tsx
import { useIsLoggedIn } from '../hooks/useLocalStorageUser';

const ProtectedComponent = () => {
  const isLoggedIn = useIsLoggedIn();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return <div>Protected content here</div>;
};
```

## Styling

The components come with built-in CSS that supports:
- Responsive design
- Dark mode
- Loading states
- Hover effects
- Customizable colors

You can override styles by passing custom CSS classes or modifying the CSS files.

## Error Handling

All utilities handle common error cases:
- User not logged in
- Invalid localStorage data
- Missing user properties
- Network errors (for hooks that make API calls)

## Performance

- Hooks use React's `useState` and `useEffect` for optimal performance
- Storage event listeners are properly cleaned up
- Components only re-render when necessary
- Loading states prevent unnecessary renders

## Testing

You can test the components by:
1. Logging in to see the user data
2. Clearing localStorage to see fallback states
3. Using the example component to see all variations
4. Testing in browser console with the utility functions
