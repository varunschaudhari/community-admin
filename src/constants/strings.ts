// Navigation and Menu Items
export const NAVIGATION = {
  DASHBOARD: 'Dashboard',
  ANALYTICS: 'Analytics',
  MESSAGES: 'Messages',
  TEAM: 'Team',
  DOCUMENTS: 'Documents',
  SETTINGS: 'Settings',
} as const;

// Header and UI Elements
export const HEADER = {
  SEARCH_PLACEHOLDER: 'Search...',
  NOTIFICATIONS: 'Notifications',
  USER: 'User',
  LOGOUT: 'Logout',
  MENU_TOGGLE: 'Toggle Menu',
} as const;

// Brand and Company
export const BRAND = {
  NAME: 'Teli Community',
  SHORT_NAME: 'TC',
  LOGO_ALT: 'Bright Web Logo',
} as const;

// User Roles and Permissions
export const ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
  MODERATOR: 'Moderator',
  EDITOR: 'Editor',
} as const;

// Dashboard Sections
export const DASHBOARD = {
  OVERVIEW: 'Overview',
  STATISTICS: 'Statistics',
  RECENT_ACTIVITY: 'Recent Activity',
  QUICK_ACTIONS: 'Quick Actions',
  WELCOME_MESSAGE: 'Welcome back',
  DASHBOARD_SUBTITLE: `Here's what's happening with your ${BRAND.NAME} Dashboard today.`,
} as const;

// Analytics
export const ANALYTICS = {
  PAGE_VIEWS: 'Page Views',
  USERS: 'Users',
  ENGAGEMENT: 'Engagement',
  CONVERSIONS: 'Conversions',
  TRAFFIC_SOURCES: 'Traffic Sources',
  TOP_PAGES: 'Top Pages',
} as const;

// Messages
export const MESSAGES = {
  INBOX: 'Inbox',
  SENT: 'Sent',
  DRAFTS: 'Drafts',
  ARCHIVE: 'Archive',
  COMPOSE: 'Compose',
  REPLY: 'Reply',
  FORWARD: 'Forward',
  DELETE: 'Delete',
  MARK_AS_READ: 'Mark as Read',
  MARK_AS_UNREAD: 'Mark as Unread',
} as const;

// Team Management
export const TEAM = {
  MEMBERS: 'Members',
  INVITE: 'Invite',
  ROLES: 'Roles',
  PERMISSIONS: 'Permissions',
  ACTIVITY: 'Activity',
  PROFILE: 'Profile',
  EDIT_PROFILE: 'Edit Profile',
} as const;

// Documents
export const DOCUMENTS = {
  ALL_DOCUMENTS: 'All Documents',
  RECENT: 'Recent',
  FAVORITES: 'Favorites',
  SHARED: 'Shared',
  UPLOAD: 'Upload',
  CREATE: 'Create',
  RENAME: 'Rename',
  MOVE: 'Move',
  COPY: 'Copy',
  DOWNLOAD: 'Download',
  SHARE: 'Share',
} as const;

// Settings
export const SETTINGS = {
  GENERAL: 'General',
  PROFILE: 'Profile',
  SECURITY: 'Security',
  NOTIFICATIONS: 'Notifications',
  APPEARANCE: 'Appearance',
  LANGUAGE: 'Language',
  THEME: 'Theme',
  LIGHT_MODE: 'Light Mode',
  DARK_MODE: 'Dark Mode',
  SYSTEM: 'System',
} as const;

// Form Labels and Buttons
export const FORMS = {
  EMAIL: 'Email',
  PASSWORD: 'Password',
  CONFIRM_PASSWORD: 'Confirm Password',
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  USERNAME: 'Username',
  PHONE: 'Phone',
  ADDRESS: 'Address',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
  RESET: 'Reset',
  UPDATE: 'Update',
  CREATE: 'Create',
  EDIT: 'Edit',
  DELETE: 'Delete',
  CLOSE: 'Close',
  CONFIRM: 'Confirm',
  YES: 'Yes',
  NO: 'No',
} as const;

// Status and States
export const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
} as const;

// Error Messages
export const ERRORS = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS = {
  SAVED: 'Changes saved successfully',
  CREATED: 'Item created successfully',
  UPDATED: 'Item updated successfully',
  DELETED: 'Item deleted successfully',
  UPLOADED: 'File uploaded successfully',
  SENT: 'Message sent successfully',
  INVITED: 'User invited successfully',
} as const;

// Time and Date
export const TIME = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month',
  THIS_YEAR: 'This Year',
  LAST_WEEK: 'Last Week',
  LAST_MONTH: 'Last Month',
  LAST_YEAR: 'Last Year',
} as const;

// Common Actions
export const ACTIONS = {
  VIEW: 'View',
  EDIT: 'Edit',
  DELETE: 'Delete',
  DUPLICATE: 'Duplicate',
  EXPORT: 'Export',
  IMPORT: 'Import',
  FILTER: 'Filter',
  SORT: 'Sort',
  SEARCH: 'Search',
  REFRESH: 'Refresh',
  EXPAND: 'Expand',
  COLLAPSE: 'Collapse',
  SELECT_ALL: 'Select All',
  DESELECT_ALL: 'Deselect All',
} as const;

// Pagination
export const PAGINATION = {
  PREVIOUS: 'Previous',
  NEXT: 'Next',
  FIRST: 'First',
  LAST: 'Last',
  PAGE: 'Page',
  OF: 'of',
  SHOWING: 'Showing',
  TO: 'to',
  OF_TOTAL: 'of',
  ENTRIES: 'entries',
  PER_PAGE: 'per page',
} as const;

// File Types
export const FILE_TYPES = {
  IMAGE: 'Image',
  DOCUMENT: 'Document',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  ARCHIVE: 'Archive',
  SPREADSHEET: 'Spreadsheet',
  PRESENTATION: 'Presentation',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'Success',
  ERROR: 'Error',
  WARNING: 'Warning',
  INFO: 'Information',
} as const;

// Export all strings as a single object for easy access
export const STRINGS = {
  NAVIGATION,
  HEADER,
  BRAND,
  ROLES,
  DASHBOARD,
  ANALYTICS,
  MESSAGES,
  TEAM,
  DOCUMENTS,
  SETTINGS,
  FORMS,
  STATUS,
  ERRORS,
  SUCCESS,
  TIME,
  ACTIONS,
  PAGINATION,
  FILE_TYPES,
  NOTIFICATION_TYPES,
} as const;
