import React from 'react';
import { useLocalStorageUser, useUserName, useUserFirstName, useIsLoggedIn } from '../../hooks/useLocalStorageUser';
import { UserDisplay, UserName, UserFirstName } from './UserDisplay';
import { getLocalStorageStatus, fixLocalStorage, backupUserData, restoreUserData, forceRefreshUserData } from '../../utils/localStorageDebug';
import './UserDisplayExample.css';

export const UserDisplayExample: React.FC = () => {
  const {
    user,
    userName,
    firstName,
    lastName,
    username,
    email,
    role,
    isLoggedIn,
    isLoading,
    refreshUser
  } = useLocalStorageUser();

  // Alternative hooks for specific data
  const simpleUserName = useUserName();
  const simpleFirstName = useUserFirstName();
  const simpleIsLoggedIn = useIsLoggedIn();

  if (isLoading) {
    return (
      <div className="user-display-example">
        <h2>Loading user information...</h2>
      </div>
    );
  }

  return (
    <div className="user-display-example">
      <h2>User Display Examples</h2>

      <div className="example-section">
        <h3>1. Full User Display Component</h3>
        <UserDisplay showFullInfo={true} showAvatar={true} />
      </div>

      <div className="example-section">
        <h3>2. Simple User Display (Name Only)</h3>
        <UserDisplay showFullInfo={false} showAvatar={true} />
      </div>

      <div className="example-section">
        <h3>3. User Name Only Component</h3>
        <UserName />
      </div>

      <div className="example-section">
        <h3>4. User First Name Only Component</h3>
        <UserFirstName />
      </div>

      <div className="example-section">
        <h3>5. Using the Hook Directly</h3>
        <div className="hook-examples">
          <div className="hook-example">
            <strong>Full Name:</strong> {userName}
          </div>
          <div className="hook-example">
            <strong>First Name:</strong> {firstName}
          </div>
          <div className="hook-example">
            <strong>Last Name:</strong> {lastName}
          </div>
          <div className="hook-example">
            <strong>Username:</strong> {username}
          </div>
          <div className="hook-example">
            <strong>Email:</strong> {email}
          </div>
          <div className="hook-example">
            <strong>Role:</strong> {role}
          </div>
          <div className="hook-example">
            <strong>Logged In:</strong> {isLoggedIn ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      <div className="example-section">
        <h3>6. Using Simple Hooks</h3>
        <div className="hook-examples">
          <div className="hook-example">
            <strong>Simple User Name:</strong> {simpleUserName}
          </div>
          <div className="hook-example">
            <strong>Simple First Name:</strong> {simpleFirstName}
          </div>
          <div className="hook-example">
            <strong>Simple Logged In:</strong> {simpleIsLoggedIn ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      <div className="example-section">
        <h3>7. Raw User Data</h3>
        <div className="raw-data">
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>

      <div className="example-section">
        <h3>8. Actions</h3>
        <div className="actions">
          <button onClick={refreshUser} className="refresh-button">
            Refresh User Data
          </button>
          <button onClick={forceRefreshUserData} className="refresh-button">
            Force Refresh
          </button>
          <button onClick={() => getLocalStorageStatus()} className="debug-button">
            Debug Storage
          </button>
          <button onClick={() => {
            const result = fixLocalStorage();
            alert(result.message);
            if (result.success) {
              forceRefreshUserData();
            }
          }} className="fix-button">
            Fix Issues
          </button>
          <button onClick={() => {
            const result = backupUserData();
            alert(result.message);
          }} className="backup-button">
            Backup Data
          </button>
          <button onClick={() => {
            const result = restoreUserData();
            alert(result.message);
          }} className="restore-button">
            Restore Data
          </button>
          <button
            onClick={() => {
              // Clear localStorage for testing
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
              window.location.reload();
            }}
            className="clear-button"
          >
            Clear Storage (Test)
          </button>
        </div>
      </div>

      <div className="example-section">
        <h3>9. Browser Console Utilities</h3>
        <p>
          You can also use these functions directly in the browser console:
        </p>
        <ul className="console-functions">
          <li><code>getLoggedInUser()</code> - Get full user object</li>
          <li><code>getLoggedInUserName()</code> - Get user's full name</li>
          <li><code>getLoggedInUserFirstName()</code> - Get user's first name</li>
          <li><code>getLoggedInUserLastName()</code> - Get user's last name</li>
          <li><code>getLoggedInUserUsername()</code> - Get user's username</li>
          <li><code>getLoggedInUserEmail()</code> - Get user's email</li>
          <li><code>getLoggedInUserRole()</code> - Get user's role</li>
          <li><code>isUserLoggedIn()</code> - Check if user is logged in</li>
          <li><code>displayUserInfo()</code> - Display all user info in console</li>
        </ul>
      </div>
    </div>
  );
};

export default UserDisplayExample;
