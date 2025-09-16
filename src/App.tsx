import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import User from './components/User';
import UserManagement from './components/UserManagement/UserManagement';
import Roles from './components/Roles/Roles';
import SystemUserManagement from './components/SystemUserManagement/SystemUserManagement';
import { LocalStorageDebugButton } from './components/LocalStorageDebugger/LocalStorageDebugger';
import PermissionManager from './components/PermissionManager/PermissionManager';
import { TokenExpiryWarning } from './components/TokenExpiryWarning';
import { useDynamicPermissions } from './hooks/useDynamicPermissions';
import './utils/tokenExpiryTest'; // Import test utilities

// Simple localStorage debug utilities
const debugLocalStorage = () => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('authToken');

  console.log('🔍 LocalStorage Debug:');
  console.log('User Data:', userData);
  console.log('Token:', token);

  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      console.log('Parsed User:', parsed);
      console.log('User Name:', parsed.firstName + ' ' + parsed.lastName);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  return { userData, token };
};

// Test backend connectivity
const testBackend = async () => {
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    console.log('✅ Backend is running:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend is not running:', error);
    return false;
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).debugLocalStorage = debugLocalStorage;
  (window as any).testBackend = testBackend;
  (window as any).getUserFromStorage = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };
  (window as any).getUserName = () => {
    const user = (window as any).getUserFromStorage();
    if (user && user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user && user.firstName) {
      return user.firstName;
    } else if (user && user.username) {
      return user.username;
    }
    return 'Unknown User';
  };
}

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showPermissionManager, setShowPermissionManager] = useState(false);
  const { canAccessResource, isLoading: permissionsLoading } = useDynamicPermissions();

  // Redirect users away from pages they don't have permission to access
  useEffect(() => {
    if (!permissionsLoading && currentPage !== 'dashboard' && !canAccessResource(currentPage)) {
      console.log(`🚫 User doesn't have permission to access ${currentPage}, redirecting to dashboard`);
      setCurrentPage('dashboard');
    }
  }, [currentPage, canAccessResource, permissionsLoading]);

  const renderContent = () => {
    // Check if user has permission to access the current page
    if (!permissionsLoading && currentPage !== 'dashboard' && !canAccessResource(currentPage)) {
      console.log(`🚫 Access denied for ${currentPage}, showing dashboard`);
      setCurrentPage('dashboard');
      return <Dashboard />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      case 'user':
        return <User />;
      case 'user-management':
        return <UserManagement />;
      case 'roles':
        return <Roles />;
      case 'system-users':
        return <SystemUserManagement />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderContent()}
      </DashboardLayout>
      <TokenExpiryWarning showWarningMinutes={10} />
      <LocalStorageDebugButton />
      <PermissionManager isVisible={showPermissionManager} />

      {/* Permission Manager Toggle Button */}
      <button
        onClick={() => setShowPermissionManager(!showPermissionManager)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 9999
        }}
        title="Permission Manager"
      >
        🔧
      </button>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
