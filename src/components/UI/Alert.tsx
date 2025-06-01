// src/components/ui/Alert.tsx - Replace MUI Alert
import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  severity?: 'success' | 'info' | 'warning' | 'error';
  onClose?: () => void;
}

export function Alert({ children, severity = 'info', onClose }: AlertProps) {
  const severityStyles = {
    success: 'bg-green-600 border-green-500 text-green-50',
    info: 'bg-blue-600 border-blue-500 text-blue-50',
    warning: 'bg-yellow-600 border-yellow-500 text-yellow-50',
    error: 'bg-red-600 border-red-500 text-red-50'
  };

  const icons = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
    error: '✕'
  };

  return (
    <div className={`flex items-center p-4 border-l-4 rounded-r-lg ${severityStyles[severity]}`}>
      <span className="text-lg mr-3">{icons[severity]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-xl hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
}

// src/components/ui/Snackbar.tsx - Replace MUI Snackbar
interface SnackbarProps {
  open: boolean;
  autoHideDuration?: number;
  onClose: () => void;
  children: React.ReactNode;
}

export function Snackbar({ open, autoHideDuration = 6000, onClose, children }: SnackbarProps) {
  React.useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {children}
    </div>
  );
}