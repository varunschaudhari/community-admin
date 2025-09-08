import React, { useState } from 'react';
import { useDynamicPermissions } from '../../hooks/useDynamicPermissions';

interface PermissionDebuggerProps {
  isVisible?: boolean;
}

const PermissionDebugger: React.FC<PermissionDebuggerProps> = ({ isVisible = false }) => {
  const { userPermissions, isLoading, canAccessResource } = useDynamicPermissions();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      maxWidth: '400px',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, color: '#333' }}>🔐 Permission Debug</h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer'
          }}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong> {isLoading ? 'Loading...' : 'Ready'}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>User Role:</strong> {userPermissions?.role || 'Unknown'}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Allowed Resources ({userPermissions?.resources?.length || 0}):</strong>
        <div style={{ maxHeight: '100px', overflowY: 'auto', marginTop: '5px' }}>
          {userPermissions?.resources?.map(resource => (
            <div key={resource} style={{
              background: '#e8f4fd',
              padding: '2px 6px',
              margin: '2px 0',
              borderRadius: '3px',
              fontSize: '11px'
            }}>
              {resource}
            </div>
          ))}
        </div>
      </div>

      {isExpanded && (
        <div>
          <strong>Page Access:</strong>
          <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '5px' }}>
            {['dashboard', 'analytics', 'messages', 'team', 'documents', 'users', 'user-management', 'system-users', 'roles', 'settings'].map(page => {
              const hasAccess = canAccessResource(page);
              return (
                <div key={page} style={{
                  background: hasAccess ? '#d4edda' : '#f8d7da',
                  padding: '4px 6px',
                  margin: '2px 0',
                  borderRadius: '3px',
                  fontSize: '11px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{page}</span>
                  <span style={{
                    color: hasAccess ? '#155724' : '#721c24',
                    fontWeight: 'bold'
                  }}>
                    {hasAccess ? '✅' : '❌'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionDebugger;
