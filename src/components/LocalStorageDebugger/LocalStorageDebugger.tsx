import React, { useState, useEffect } from 'react';
import { getLocalStorageStatus, fixLocalStorage, backupUserData, restoreUserData, forceRefreshUserData } from '../../utils/localStorageDebug';
import { useLocalStorageUser } from '../../hooks/useLocalStorageUser';
import './LocalStorageDebugger.css';

interface LocalStorageDebuggerProps {
  show?: boolean;
  onClose?: () => void;
}

export const LocalStorageDebugger: React.FC<LocalStorageDebuggerProps> = ({ 
  show = false, 
  onClose 
}) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(show);
  const { user, userName, isLoggedIn, isLoading } = useLocalStorageUser();

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const runDebug = () => {
    const status = getLocalStorageStatus();
    setDebugInfo(status);
  };

  const handleFix = () => {
    const result = fixLocalStorage();
    alert(result.message);
    if (result.success) {
      forceRefreshUserData();
      runDebug();
    }
  };

  const handleBackup = () => {
    const result = backupUserData();
    alert(result.message);
  };

  const handleRestore = () => {
    const result = restoreUserData();
    alert(result.message);
    if (result.success) {
      runDebug();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="local-storage-debugger">
      <div className="debugger-header">
        <h3>🔧 LocalStorage Debugger</h3>
        <button onClick={onClose || (() => setIsVisible(false))} className="close-button">
          ×
        </button>
      </div>

      <div className="debugger-content">
        <div className="current-status">
          <h4>Current Status</h4>
          <div className="status-grid">
            <div className="status-item">
              <span className="label">User Name:</span>
              <span className="value">{userName}</span>
            </div>
            <div className="status-item">
              <span className="label">Logged In:</span>
              <span className="value">{isLoggedIn ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div className="status-item">
              <span className="label">Loading:</span>
              <span className="value">{isLoading ? '⏳ Yes' : '✅ No'}</span>
            </div>
            <div className="status-item">
              <span className="label">User ID:</span>
              <span className="value">{user?._id || 'None'}</span>
            </div>
          </div>
        </div>

        <div className="debug-actions">
          <h4>Debug Actions</h4>
          <div className="action-buttons">
            <button onClick={runDebug} className="debug-btn">
              🔍 Run Debug
            </button>
            <button onClick={handleFix} className="fix-btn">
              🔧 Fix Issues
            </button>
            <button onClick={forceRefreshUserData} className="refresh-btn">
              🔄 Force Refresh
            </button>
            <button onClick={handleBackup} className="backup-btn">
              💾 Backup Data
            </button>
            <button onClick={handleRestore} className="restore-btn">
              📥 Restore Data
            </button>
          </div>
        </div>

        {debugInfo && (
          <div className="debug-results">
            <h4>Debug Results</h4>
            <div className="debug-details">
              <div className="debug-item">
                <strong>Has User Data:</strong> {debugInfo.debug.hasUser ? '✅ Yes' : '❌ No'}
              </div>
              <div className="debug-item">
                <strong>Has Token:</strong> {debugInfo.debug.hasToken ? '✅ Yes' : '❌ No'}
              </div>
              <div className="debug-item">
                <strong>Valid User:</strong> {debugInfo.debug.isValidUser ? '✅ Yes' : '❌ No'}
              </div>
              <div className="debug-item">
                <strong>Storage Test:</strong> {debugInfo.test.success ? '✅ Passed' : '❌ Failed'}
              </div>
              
              {debugInfo.debug.issues.length > 0 && (
                <div className="issues-section">
                  <strong>Issues Found:</strong>
                  <ul>
                    {debugInfo.debug.issues.map((issue: string, index: number) => (
                      <li key={index}>⚠️ {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {debugInfo.debug.userData && (
                <div className="user-data-section">
                  <strong>User Data:</strong>
                  <pre>{JSON.stringify(debugInfo.debug.userData, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Floating debug button
export const LocalStorageDebugButton: React.FC = () => {
  const [showDebugger, setShowDebugger] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowDebugger(true)}
        className="floating-debug-button"
        title="Debug LocalStorage"
      >
        🔧
      </button>
      
      <LocalStorageDebugger 
        show={showDebugger} 
        onClose={() => setShowDebugger(false)} 
      />
    </>
  );
};

export default LocalStorageDebugger;
