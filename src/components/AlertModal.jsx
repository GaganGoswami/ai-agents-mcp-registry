import React, { useEffect } from 'react';

/**
 * AlertModal: in-app notification for status changes or anomalies
 * @param {Object} props
 * @param {string} props.message
 * @param {Function} props.onClose
 * @param {number} props.timeout
 */
const AlertModal = ({ message, onClose, timeout = 4000 }) => {
  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(onClose, timeout);
      return () => clearTimeout(timer);
    }
  }, [onClose, timeout]);

  return (
    <div style={{
      position: 'fixed',
      top: 32,
      right: 32,
      background: 'var(--color-error)',
      color: 'var(--color-white)',
      padding: '16px 32px',
      borderRadius: 12,
      boxShadow: 'var(--shadow-md)',
      zIndex: 9999,
      fontWeight: 600,
      fontSize: 16
    }}>
      {message}
      <button
        style={{ marginLeft: 24, background: 'none', color: 'var(--color-white)', border: 'none', fontWeight: 500, cursor: 'pointer', fontSize: 15 }}
        onClick={onClose}
        aria-label="Close alert"
      >✕</button>
    </div>
  );
};

export default AlertModal;
