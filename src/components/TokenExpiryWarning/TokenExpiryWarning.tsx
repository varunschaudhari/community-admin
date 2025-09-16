import React, { useState, useEffect } from 'react';
import { useTokenExpiry } from '../../hooks/useTokenExpiry';
import { useAuth } from '../../contexts/AuthContext';
import { Modal, Button, Progress, Alert, message } from 'antd';
import { ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './TokenExpiryWarning.css';

interface TokenExpiryWarningProps {
  showWarningMinutes?: number; // Show warning when token expires in this many minutes
}

const TokenExpiryWarning: React.FC<TokenExpiryWarningProps> = ({
  showWarningMinutes = 10
}) => {
  const { user } = useAuth();
  const { getTokenStatus, handleTokenExpiry } = useTokenExpiry();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const tokenStatus = getTokenStatus();

  useEffect(() => {
    if (!user || tokenStatus.isExpired) return;

    // Show warning if token expires within the specified minutes
    const warningThreshold = showWarningMinutes * 60 * 1000; // Convert to milliseconds
    const shouldShowWarning = tokenStatus.timeUntilExpiry <= warningThreshold && tokenStatus.timeUntilExpiry > 0;

    if (shouldShowWarning && !isModalVisible) {
      setIsModalVisible(true);
      setCountdown(Math.floor(tokenStatus.timeUntilExpiry / 1000)); // Convert to seconds
    }
  }, [user, tokenStatus, showWarningMinutes, isModalVisible]);

  // Countdown timer
  useEffect(() => {
    if (!isModalVisible || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Auto logout when countdown reaches 0
          handleTokenExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isModalVisible, countdown, handleTokenExpiry]);

  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = async () => {
    // For now, we'll just close the modal
    // In a real implementation, you might want to refresh the token
    setIsModalVisible(false);
  };

  const handleLogout = async () => {
    message.info('Session expired. Please login again.');
    await handleTokenExpiry();
    setIsModalVisible(false);
  };

  const getProgressPercent = (): number => {
    if (tokenStatus.isExpired) return 100;

    const totalTime = user?.userType === 'system' ? 8 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 8 hours for system, 24 hours for community
    const remainingTime = tokenStatus.timeUntilExpiry;
    return Math.max(0, Math.min(100, ((totalTime - remainingTime) / totalTime) * 100));
  };

  if (!user || tokenStatus.isExpired) {
    return null;
  }

  return (
    <>
      {/* Token Status Indicator (always visible when logged in) */}
      <div className="token-status-indicator">
        <ClockCircleOutlined />
        <span className="token-time">
          {tokenStatus.formattedTime}
        </span>
        {tokenStatus.isNearExpiry && (
          <span className="token-warning">⚠️</span>
        )}
      </div>

      {/* Expiry Warning Modal */}
      <Modal
        title={
          <div className="modal-title">
            <ExclamationCircleOutlined className="warning-icon" />
            Session Expiring Soon
          </div>
        }
        open={isModalVisible}
        onCancel={handleExtendSession}
        footer={[
          <Button key="extend" type="primary" onClick={handleExtendSession}>
            Continue Session
          </Button>,
          <Button key="logout" onClick={handleLogout}>
            Logout Now
          </Button>,
        ]}
        closable={false}
        maskClosable={false}
        className="token-expiry-modal"
      >
        <div className="token-expiry-content">
          <Alert
            message="Your session is about to expire"
            description={`Your session will expire in ${formatCountdown(countdown)}. Please save your work and login again to continue.`}
            type="warning"
            showIcon
            className="expiry-alert"
          />

          <div className="session-progress">
            <div className="progress-label">Session Progress</div>
            <Progress
              percent={getProgressPercent()}
              status={tokenStatus.isNearExpiry ? 'exception' : 'active'}
              strokeColor={tokenStatus.isNearExpiry ? '#ff4d4f' : '#1890ff'}
            />
          </div>

          <div className="session-details">
            <p><strong>User:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Type:</strong> {user.userType === 'system' ? 'System User' : 'Community User'}</p>
            <p><strong>Time Remaining:</strong> {tokenStatus.formattedTime}</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TokenExpiryWarning;
