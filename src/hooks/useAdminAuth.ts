import { useState, useEffect } from 'react';
import { isAdminLoggedIn, adminLogin, adminLogout } from '../services/scheduleService';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminLoggedIn());

  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<{ isLoggedIn: boolean }>;
      setIsAdmin(Boolean(custom.detail?.isLoggedIn));
    };

    window.addEventListener('admin-auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('admin-auth-changed', handleAuthChange);
    };
  }, []);

  return {
    isAdmin,
    login: adminLogin,
    logout: adminLogout,
  };
}
