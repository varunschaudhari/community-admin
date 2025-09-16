# Token Expiry Implementation

This document describes the comprehensive token expiry checking and automatic logout functionality implemented in the application.

## Overview

The application now includes automatic token expiry checking for both **Community Users** and **System Users** with the following features:

- ✅ Automatic token expiry detection
- ✅ Periodic token validation (every minute)
- ✅ Automatic logout when tokens expire
- ✅ Visual warning when session is about to expire
- ✅ Different expiry times for different user types
- ✅ Token refresh on successful API calls
- ✅ Comprehensive logging for debugging

## User Types and Token Expiry

### Community Users
- **Token Expiry**: 24 hours
- **Warning Time**: 10 minutes before expiry
- **Storage Keys**: `authToken`, `user`, `tokenExpiry`

### System Users
- **Token Expiry**: 8 hours
- **Warning Time**: 10 minutes before expiry
- **Storage Keys**: `systemAuthToken`, `systemUser`, `systemTokenExpiry`

## Implementation Details

### 1. Enhanced Services

#### SystemAuthService.ts
- Added `isTokenExpired()` method
- Added `getTokenExpiry()` and `getTimeUntilExpiry()` methods
- Enhanced `isAuthenticated()` to check token expiry
- Updated `validateToken()` and `getProfile()` to refresh token expiry
- Enhanced `logout()` to clear all auth data

#### AuthService.ts
- Already had token expiry functionality
- Enhanced with better logging and error handling

### 2. AuthContext.tsx
- Updated to handle both user types
- Enhanced periodic token checking
- Improved logout logic for different user types
- Better error handling and storage cleanup

### 3. New Components and Hooks

#### useTokenExpiry Hook (`src/hooks/useTokenExpiry.ts`)
Provides utilities for:
- Checking token expiry status
- Getting time until expiry
- Handling automatic logout
- Getting formatted expiry information

#### TokenExpiryWarning Component (`src/components/TokenExpiryWarning/`)
Features:
- Visual token status indicator (top-right corner)
- Modal warning when session is about to expire
- Countdown timer
- Progress bar showing session progress
- Automatic logout when countdown reaches zero

### 4. Integration

The `TokenExpiryWarning` component is integrated into the main `App.tsx` and will:
- Show a token status indicator when logged in
- Display warning modal 10 minutes before expiry
- Automatically logout users when tokens expire

## Testing the Implementation

### Browser Console Commands

The following test utilities are available in the browser console:

```javascript
// Check current token status
tokenExpiryTest.checkTokenStatus()

// Set token to expire in 1 minute (for testing)
tokenExpiryTest.setTestCommunityTokenExpiry()  // For community users
tokenExpiryTest.setTestSystemTokenExpiry()     // For system users

// Set token to expire immediately
tokenExpiryTest.setImmediateExpiry('community')  // or 'system'

// Reset token expiry to normal
tokenExpiryTest.resetTokenExpiry('community')    // or 'system'

// Show all auth data in localStorage
tokenExpiryTest.showAuthData()
```

### Testing Scenarios

1. **Normal Operation**: Login and verify token status indicator shows correct time
2. **Warning Modal**: Set token to expire in 10 minutes and verify warning appears
3. **Automatic Logout**: Set token to expire immediately and verify automatic logout
4. **Token Refresh**: Make API calls and verify token expiry is refreshed

## Configuration

### Token Expiry Times
- **Community Users**: 24 hours (configurable in `AuthService.ts`)
- **System Users**: 8 hours (configurable in `SystemAuthService.ts`)

### Warning Settings
- **Warning Time**: 10 minutes before expiry (configurable in `App.tsx`)
- **Check Interval**: Every minute (configurable in `useTokenExpiry.ts`)

### Buffer Time
- **Expiry Buffer**: 5 minutes before actual expiry (configurable in both services)

## Security Features

1. **Automatic Cleanup**: All auth data is cleared on logout/expiry
2. **Token Validation**: Tokens are validated before API calls
3. **Expiry Buffer**: Tokens are considered expired 5 minutes before actual expiry
4. **Cross-Service Compatibility**: System and community auth data is properly isolated

## Error Handling

- Graceful handling of expired tokens
- Proper cleanup of localStorage
- User-friendly error messages
- Comprehensive logging for debugging

## Browser Compatibility

- Works in all modern browsers
- Uses localStorage for token storage
- Responsive design for mobile devices
- Dark theme support

## Future Enhancements

Potential improvements that could be added:

1. **Token Refresh**: Implement refresh token mechanism
2. **Remember Me**: Extend token expiry for "remember me" functionality
3. **Activity-Based Extension**: Extend token expiry based on user activity
4. **Multiple Tab Sync**: Sync token expiry across browser tabs
5. **Custom Warning Times**: Allow users to configure warning times

## Troubleshooting

### Common Issues

1. **Token not expiring**: Check if `tokenExpiry` is set in localStorage
2. **Warning not showing**: Verify `TokenExpiryWarning` component is rendered
3. **Automatic logout not working**: Check browser console for errors
4. **Wrong expiry time**: Verify user type and corresponding service

### Debug Commands

```javascript
// Check if user is logged in
getUserFromStorage()

// Check token status
tokenExpiryTest.checkTokenStatus()

// View all auth data
tokenExpiryTest.showAuthData()

// Test immediate expiry
tokenExpiryTest.setImmediateExpiry()
```

## Files Modified/Created

### Modified Files
- `src/services/SystemAuthService.ts`
- `src/contexts/AuthContext.tsx`
- `src/App.tsx`

### New Files
- `src/hooks/useTokenExpiry.ts`
- `src/components/TokenExpiryWarning/TokenExpiryWarning.tsx`
- `src/components/TokenExpiryWarning/TokenExpiryWarning.css`
- `src/components/TokenExpiryWarning/index.ts`
- `src/utils/tokenExpiryTest.ts`
- `TOKEN_EXPIRY_IMPLEMENTATION.md`

This implementation provides a robust, user-friendly token expiry system that automatically handles session management for both user types while providing clear feedback to users about their session status.
