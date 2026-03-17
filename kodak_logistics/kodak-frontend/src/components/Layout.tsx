import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  username: string;
  pageTitle: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, username, pageTitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      if (!newIsDesktop) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isOpen={isSidebarOpen} 
        isDesktop={isDesktop} 
        toggleSidebar={toggleSidebar} 
        closeSidebar={closeSidebar}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen && isDesktop ? 'ml-64' : 'ml-0'}`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          username={username} 
          pageTitle={pageTitle}
          showMenuButton={!isSidebarOpen || !isDesktop}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;