import { authService } from './AuthService';
import { systemAuthService } from './SystemAuthService';

export interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio?: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
  };
  appearance: {
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
  };
}

class SettingsService {
  private readonly SETTINGS_KEY = 'userSettings';
  private readonly API_BASE_URL = 'http://localhost:5000/api';

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Get system authentication headers
   */
  private getSystemAuthHeaders(): HeadersInit {
    const token = systemAuthService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        authService.clearAuth();
        systemAuthService.logout();
        throw new Error('Session expired. Please login again.');
      }

      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  /**
   * Get default settings
   */
  getDefaultSettings(): UserSettings {
    return {
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
      },
      notifications: {
        email: true,
        push: false,
        sms: true,
        marketing: false,
      },
      security: {
        twoFactor: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
      },
      appearance: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
      },
    };
  }

  /**
   * Get settings from localStorage
   */
  getSettings(): UserSettings {
    try {
      const settings = localStorage.getItem(this.SETTINGS_KEY);
      if (settings) {
        return { ...this.getDefaultSettings(), ...JSON.parse(settings) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return this.getDefaultSettings();
  }

  /**
   * Save settings to localStorage
   */
  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      console.log('✅ Settings saved to localStorage');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Update user profile (for both community and system users)
   */
  async updateProfile(profileData: Partial<UserSettings['profile']>): Promise<{ success: boolean; data: any }> {
    try {
      // Check if user is system user
      const user = authService.getUser();
      const isSystemUser = user?.userType === 'system';

      let response: Response;
      
      if (isSystemUser) {
        // Update system user profile
        response = await fetch(`${this.API_BASE_URL}/system/auth/profile`, {
          method: 'PUT',
          headers: this.getSystemAuthHeaders(),
          body: JSON.stringify(profileData),
        });
      } else {
        // Update community user profile
        response = await fetch(`${this.API_BASE_URL}/auth/profile`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(profileData),
        });
      }

      const result = await this.handleResponse<{ success: boolean; data: any }>(response);

      if (result.success) {
        // Update local storage with new user data
        if (isSystemUser) {
          systemAuthService.getCurrentUser(); // Refresh system user data
        } else {
          authService.setUser(result.data);
        }
      }

      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password (for both community and system users)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = authService.getUser();
      const isSystemUser = user?.userType === 'system';

      if (isSystemUser) {
        return await systemAuthService.changePassword(currentPassword, newPassword);
      } else {
        return await authService.changePassword(currentPassword, newPassword);
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(notificationSettings: UserSettings['notifications']): Promise<{ success: boolean; message: string }> {
    try {
      // For now, just save to localStorage
      // In a real app, you would send this to the backend
      const currentSettings = this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        notifications: notificationSettings,
      };
      this.saveSettings(updatedSettings);

      return { success: true, message: 'Notification settings updated successfully' };
    } catch (error) {
      console.error('Update notification settings error:', error);
      throw error;
    }
  }

  /**
   * Update security settings
   */
  async updateSecuritySettings(securitySettings: UserSettings['security']): Promise<{ success: boolean; message: string }> {
    try {
      // For now, just save to localStorage
      // In a real app, you would send this to the backend
      const currentSettings = this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        security: securitySettings,
      };
      this.saveSettings(updatedSettings);

      return { success: true, message: 'Security settings updated successfully' };
    } catch (error) {
      console.error('Update security settings error:', error);
      throw error;
    }
  }

  /**
   * Update appearance settings
   */
  async updateAppearanceSettings(appearanceSettings: UserSettings['appearance']): Promise<{ success: boolean; message: string }> {
    try {
      // Save to localStorage
      const currentSettings = this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        appearance: appearanceSettings,
      };
      this.saveSettings(updatedSettings);

      // Apply theme change immediately
      if (appearanceSettings.theme) {
        document.documentElement.setAttribute('data-theme', appearanceSettings.theme);
      }

      return { success: true, message: 'Appearance settings updated successfully' };
    } catch (error) {
      console.error('Update appearance settings error:', error);
      throw error;
    }
  }

  /**
   * Export settings
   */
  exportSettings(): string {
    const settings = this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  /**
   * Import settings
   */
  importSettings(settingsJson: string): { success: boolean; message: string } {
    try {
      const settings = JSON.parse(settingsJson);
      this.saveSettings(settings);
      return { success: true, message: 'Settings imported successfully' };
    } catch (error) {
      console.error('Import settings error:', error);
      return { success: false, message: 'Invalid settings format' };
    }
  }

  /**
   * Reset settings to default
   */
  resetSettings(): void {
    const defaultSettings = this.getDefaultSettings();
    this.saveSettings(defaultSettings);
    console.log('✅ Settings reset to default');
  }

  /**
   * Get user preferences for display
   */
  getUserPreferences(): {
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
    notifications: UserSettings['notifications'];
  } {
    const settings = this.getSettings();
    return {
      theme: settings.appearance.theme,
      language: settings.appearance.language,
      timezone: settings.appearance.timezone,
      notifications: settings.notifications,
    };
  }
}

// Create singleton instance
export const settingsService = new SettingsService();
