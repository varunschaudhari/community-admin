export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    sidebar: {
      background: string;
      header: string;
      text: string;
      textActive: string;
      border: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    border: string;
    shadow: string;
    gradient: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#f8fafc',
    surface: '#ffffff',
    sidebar: {
      background: '#ffffff',
      header: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#64748b',
      textActive: '#667eea',
      border: '#e2e8f0',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      tertiary: '#94a3b8',
      inverse: '#ffffff',
    },
    border: '#e2e8f0',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      xxl: '32px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1140px',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    sidebar: {
      background: '#1a1a1a',
      header: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      text: '#e5e7eb',
      textActive: '#3b82f6',
      border: '#374151',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
      inverse: '#1a1a1a',
    },
    border: '#374151',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    gradient: {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      accent: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      xxl: '32px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1140px',
  },
};
