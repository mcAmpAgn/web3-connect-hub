// src/components/ui/Snackbar.tsx
import React, { useEffect } from 'react';

interface SnackbarProps {
  open: boolean;
  autoHideDuration?: number;
  onClose: () => void;
  children: React.ReactNode;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

export function Snackbar({ 
  open, 
  autoHideDuration = 6000, 
  onClose, 
  children,
  anchorOrigin = { vertical: 'top', horizontal: 'right' }
}: SnackbarProps) {
  
  useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  // Position classes based on anchorOrigin
  const getPositionClasses = () => {
    const { vertical, horizontal } = anchorOrigin;
    
    let classes = 'fixed z-50 max-w-sm ';
    
    // Vertical positioning
    if (vertical === 'top') {
      classes += 'top-4 ';
    } else {
      classes += 'bottom-4 ';
    }
    
    // Horizontal positioning
    if (horizontal === 'left') {
      classes += 'left-4';
    } else if (horizontal === 'center') {
      classes += 'left-1/2 transform -translate-x-1/2';
    } else {
      classes += 'right-4';
    }
    
    return classes;
  };

  return (
    <div className={getPositionClasses()}>
      <div 
        className="animate-in slide-in-from-right-full duration-300 ease-out"
        style={{
          animation: open ? 'slideIn 0.3s ease-out' : undefined
        }}
      >
        {children}
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Snackbar;