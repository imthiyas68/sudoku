import React from 'react';

export const AlertDialog = ({ variant, children }) => {
  return (
    <div className={`alert-dialog alert-dialog-${variant}`}>
      {children}
    </div>
  );
};

export const AlertDialogDescription = ({ children }) => {
  return (
    <p className="alert-dialog-description">
      {children}
    </p>
  );
};

export const AlertDialogContent = ({ children }) => {
  return (
    <div className="p-4">
      {children}
    </div>
  );
};