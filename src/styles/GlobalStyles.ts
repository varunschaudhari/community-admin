import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
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
