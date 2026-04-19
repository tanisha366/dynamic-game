// src/context/ToastContext.jsx
// Global toast system — Apr 24-25 brief
// showToast(message, type) — types: success, info, warning, badge, points, streak

import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);
let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts(p => p.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(p => p.filter(t => t.id !== id));
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }, 420);
  }, []);

  // showToast(message, type, options)
  // options: { points, streak, duration }
  const showToast = useCallback((message, type = "info", options = {}) => {
    const id = ++_id;
    const dur = options.duration || 3500;
    setToasts(p => [...p, { id, message, type, exiting: false, ...options }]);
    timers.current[id] = setTimeout(() => removeToast(id), dur);
    return id;
  }, [removeToast]);

  const dismissToast = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    removeToast(id);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

export default ToastContext;