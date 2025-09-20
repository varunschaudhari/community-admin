import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* Light theme variables */
    --color-primary: #667eea;
    --color-secondary: #764ba2;
    --color-accent: #f093fb;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-background: #f8fafc;
    --color-surface: #ffffff;
    --color-sidebar-bg: #ffffff;
    --color-sidebar-header: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --color-sidebar-text: #64748b;
    --color-sidebar-text-active: #667eea;
    --color-sidebar-border: #e2e8f0;
    --color-text-primary: #1e293b;
    --color-text-secondary: #64748b;
    --color-text-tertiary: #94a3b8;
    --color-text-inverse: #ffffff;
    --color-border: #e2e8f0;
    --color-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  [data-theme="dark"] {
    /* Dark theme variables */
    --color-primary: #3b82f6;
    --color-secondary: #8b5cf6;
    --color-accent: #06b6d4;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-background: #0a0a0a;
    --color-surface: #1a1a1a;
    --color-sidebar-bg: #1a1a1a;
    --color-sidebar-header: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    --color-sidebar-text: #e5e7eb;
    --color-sidebar-text-active: #3b82f6;
    --color-sidebar-border: #374151;
    --color-text-primary: #ffffff;
    --color-text-secondary: #d1d5db;
    --color-text-tertiary: #9ca3af;
    --color-text-inverse: #1a1a1a;
    --color-border: #374151;
    --color-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.6;
    transition: all 0.3s ease;
  }

  /* Ant Design theme overrides */
  .ant-layout {
    background: ${({ theme }) => theme.colors.background} !important;
  }

  .ant-layout-sider {
    background: ${({ theme }) => theme.colors.sidebar.background} !important;
    border-right: 1px solid ${({ theme }) => theme.colors.border} !important;
  }

  .ant-menu {
    background: ${({ theme }) => theme.colors.sidebar.background} !important;
    color: ${({ theme }) => theme.colors.sidebar.text} !important;
    border-right: none !important;
  }

  .ant-menu-item {
    color: ${({ theme }) => theme.colors.sidebar.text} !important;
    border-radius: 8px !important;
    margin: 4px 8px !important;
  }

  .ant-menu-item:hover {
    background-color: ${({ theme }) => theme.colors.background} !important;
    color: ${({ theme }) => theme.colors.sidebar.textActive} !important;
  }

  .ant-menu-item-selected {
    background-color: ${({ theme }) => theme.colors.background} !important;
    color: ${({ theme }) => theme.colors.sidebar.textActive} !important;
    font-weight: 600 !important;
  }

  .ant-menu-item-selected::after {
    border-right: 3px solid ${({ theme }) => theme.colors.primary} !important;
  }

  .ant-card {
    background: ${({ theme }) => theme.colors.surface} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
  }

  .ant-table {
    background: ${({ theme }) => theme.colors.surface} !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }

  .ant-table-thead > tr > th {
    background: ${({ theme }) => theme.colors.background} !important;
    color: ${({ theme }) => theme.colors.text.primary} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
    font-weight: 600 !important;
    padding: 16px !important;
  }

  .ant-table-tbody > tr > td {
    background: ${({ theme }) => theme.colors.surface} !important;
    color: ${({ theme }) => theme.colors.text.primary} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
    padding: 16px !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: ${({ theme }) => theme.colors.background} !important;
  }

  .ant-table-tbody > tr:nth-child(even) > td {
    background: ${({ theme }) => theme.colors.background} !important;
  }

  .ant-table-tbody > tr:nth-child(even):hover > td {
    background: ${({ theme }) => theme.colors.surface} !important;
  }

  .ant-modal-content {
    background: ${({ theme }) => theme.colors.surface} !important;
  }

  .ant-modal-header {
    background: ${({ theme }) => theme.colors.surface} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
  }

  .ant-modal-title {
    color: ${({ theme }) => theme.colors.text.primary} !important;
  }

  .ant-modal-body {
    background: ${({ theme }) => theme.colors.surface} !important;
    color: ${({ theme }) => theme.colors.text.primary} !important;
  }

  .ant-input {
    background: ${({ theme }) => theme.colors.surface} !important;
    color: ${({ theme }) => theme.colors.text.primary} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
    border-radius: 6px !important;
    padding: 8px 12px !important;
  }

  .ant-input:focus {
    border-color: ${({ theme }) => theme.colors.primary} !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
  }

  .ant-input::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary} !important;
  }

  .ant-select-selector {
    background: ${({ theme }) => theme.colors.surface} !important;
    color: ${({ theme }) => theme.colors.text.primary} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
    border-radius: 6px !important;
    padding: 4px 8px !important;
  }

  .ant-select-selector:focus {
    border-color: ${({ theme }) => theme.colors.primary} !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
  }

  .ant-select-dropdown {
    background: ${({ theme }) => theme.colors.surface} !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    border-radius: 8px !important;
    box-shadow: ${({ theme }) => theme.colors.shadow} !important;
  }

  .ant-select-item {
    color: ${({ theme }) => theme.colors.text.primary} !important;
    padding: 8px 12px !important;
  }

  .ant-select-item:hover {
    background: ${({ theme }) => theme.colors.background} !important;
  }

  .ant-select-item-option-selected {
    background: ${({ theme }) => theme.colors.primary} !important;
    color: ${({ theme }) => theme.colors.text.inverse} !important;
  }

  .ant-tabs-tab {
    color: ${({ theme }) => theme.colors.text.secondary} !important;
  }

  .ant-tabs-tab-active {
    color: ${({ theme }) => theme.colors.primary} !important;
  }

  .ant-tabs-content-holder {
    background: ${({ theme }) => theme.colors.surface} !important;
  }

  .ant-statistic-title {
    color: ${({ theme }) => theme.colors.text.secondary} !important;
  }

  .ant-statistic-content {
    color: ${({ theme }) => theme.colors.text.primary} !important;
  }

  .ant-tag {
    background: ${({ theme }) => theme.colors.background} !important;
    color: ${({ theme }) => theme.colors.text.primary} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
  }

  .ant-space {
    color: ${({ theme }) => theme.colors.text.primary} !important;
  }

  .ant-form-item-label > label {
    color: ${({ theme }) => theme.colors.text.primary} !important;
  }

  .ant-checkbox-wrapper {
    color: ${({ theme }) => theme.colors.text.primary} !important;
  }

  .ant-checkbox-inner {
    background: ${({ theme }) => theme.colors.surface} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background: ${({ theme }) => theme.colors.primary} !important;
    border-color: ${({ theme }) => theme.colors.primary} !important;
  }

  /* Button enhancements */
  .ant-btn {
    border-radius: 6px !important;
    font-weight: 500 !important;
    transition: all 0.2s ease !important;
  }

  .ant-btn-primary {
    background: ${({ theme }) => theme.colors.primary} !important;
    border-color: ${({ theme }) => theme.colors.primary} !important;
    color: ${({ theme }) => theme.colors.text.inverse} !important;
  }

  .ant-btn-primary:hover {
    background: ${({ theme }) => theme.colors.secondary} !important;
    border-color: ${({ theme }) => theme.colors.secondary} !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
  }

  .ant-btn-default {
    background: ${({ theme }) => theme.colors.surface} !important;
    border-color: ${({ theme }) => theme.colors.border} !important;
    color: ${({ theme }) => theme.colors.text.primary} !important;
  }

  .ant-btn-default:hover {
    background: ${({ theme }) => theme.colors.background} !important;
    border-color: ${({ theme }) => theme.colors.primary} !important;
    color: ${({ theme }) => theme.colors.primary} !important;
  }

  .ant-btn-danger {
    background: ${({ theme }) => theme.colors.error} !important;
    border-color: ${({ theme }) => theme.colors.error} !important;
    color: ${({ theme }) => theme.colors.text.inverse} !important;
  }

  .ant-btn-danger:hover {
    background: #dc2626 !important;
    border-color: #dc2626 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
  }

  /* Custom theme-aware classes */
  .theme-aware {
    background: var(--color-surface);
    color: var(--color-text-primary);
    border-color: var(--color-border);
  }

  .theme-aware-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    box-shadow: var(--color-shadow);
  }

  .theme-aware-text {
    color: var(--color-text-primary);
  }

  .theme-aware-text-secondary {
    color: var(--color-text-secondary);
  }

  .theme-aware-background {
    background: var(--color-background);
  }

  .theme-aware-surface {
    background: var(--color-surface);
  }

  /* Container with 12-column grid and 1140px max-width */
  .container {
    max-width: ${({ theme }) => theme.breakpoints.desktop};
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      padding: 0 ${({ theme }) => theme.spacing.sm};
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      padding: 0 ${({ theme }) => theme.spacing.xs};
    }
  }

  /* Grid System */
  .grid {
    display: grid;
    gap: ${({ theme }) => theme.spacing.md};
  }

  .grid-12 {
    grid-template-columns: repeat(12, 1fr);
  }

  .grid-6 {
    grid-template-columns: repeat(6, 1fr);
  }

  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-1 {
    grid-template-columns: 1fr;
  }

  /* Responsive Grid */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    .grid-12,
    .grid-6,
    .grid-4,
    .grid-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    .grid-12,
    .grid-6,
    .grid-4,
    .grid-3,
    .grid-2 {
      grid-template-columns: 1fr;
    }
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 44px;
  }

  .btn-primary {
    background: ${({ theme }) => theme.colors.gradient.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow: ${({ theme }) => theme.colors.shadow};
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  .btn-secondary {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }

  .btn-secondary:hover {
    background: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  /* Cards */
  .card {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.colors.shadow};
    border: 1px solid ${({ theme }) => theme.colors.border};
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    padding: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  .card-body {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  .card-footer {
    padding: ${({ theme }) => theme.spacing.lg};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.background};
  }

  /* Form Elements */
  .form-group {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  .form-label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  .form-input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: all 0.3s ease;
    min-height: 44px;
  }

  .form-input:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  /* Utilities */
  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .mb-0 { margin-bottom: 0; }
  .mb-1 { margin-bottom: ${({ theme }) => theme.spacing.xs}; }
  .mb-2 { margin-bottom: ${({ theme }) => theme.spacing.sm}; }
  .mb-3 { margin-bottom: ${({ theme }) => theme.spacing.md}; }
  .mb-4 { margin-bottom: ${({ theme }) => theme.spacing.lg}; }
  .mb-5 { margin-bottom: ${({ theme }) => theme.spacing.xl}; }

  .mt-0 { margin-top: 0; }
  .mt-1 { margin-top: ${({ theme }) => theme.spacing.xs}; }
  .mt-2 { margin-top: ${({ theme }) => theme.spacing.sm}; }
  .mt-3 { margin-top: ${({ theme }) => theme.spacing.md}; }
  .mt-4 { margin-top: ${({ theme }) => theme.spacing.lg}; }
  .mt-5 { margin-top: ${({ theme }) => theme.spacing.xl}; }

  .p-0 { padding: 0; }
  .p-1 { padding: ${({ theme }) => theme.spacing.xs}; }
  .p-2 { padding: ${({ theme }) => theme.spacing.sm}; }
  .p-3 { padding: ${({ theme }) => theme.spacing.md}; }
  .p-4 { padding: ${({ theme }) => theme.spacing.lg}; }
  .p-5 { padding: ${({ theme }) => theme.spacing.xl}; }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.tertiary};
  }

  /* Focus Styles */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Animation Classes */
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Responsive Images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
