import { useState, useEffect } from 'react';

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse on mobile and small screens
      if (mobile) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getSidebarWidth = () => {
    if (isMobile) {
      return collapsed ? 'w-20' : 'w-80';
    }
    return collapsed ? 'w-20' : 'w-80';
  };

  const getMainContentMargin = () => {
    if (isMobile) {
      return 'ml-0';
    }
    return collapsed ? 'ml-20' : 'ml-80';
  };

  return {
    collapsed,
    setCollapsed,
    isMobile,
    getSidebarWidth,
    getMainContentMargin
  };
}