import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Home, FileText, PlusCircle, LogOut } from 'lucide-react';
import { logout } from '../services/AuthService';

interface SidebarProps {
  isOpen: boolean;
  isDesktop: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; text: string; onClick: () => void }> = ({ to, icon, text, onClick }) => (
  <li>
    <Link
      to={to}
      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-700 hover:text-black"
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </Link>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, isDesktop, toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleItemClick = () => {
    if (!isDesktop) {
      closeSidebar();
    }
  };

  if (!isOpen && isDesktop) return null;

  return (
    <>
      <aside
        className={`bg-white text-gray-700 w-64 fixed transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-20 shadow-lg flex flex-col h-full max-h-screen`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl font-semibold text-gray-900">Menu</h2>
          <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-2 p-4">
            <SidebarItem to="/" icon={<Home size={20} />} text="Dashboard" onClick={handleItemClick} />
            <SidebarItem to="/records" icon={<FileText size={20} />} text="Records" onClick={handleItemClick} />
            <SidebarItem to="/records/new" icon={<PlusCircle size={20} />} text="New Record" onClick={handleItemClick} />
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            to="/login"
            onClick={(e) => {
              handleLogout(e);
              handleItemClick();
            }}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-700 hover:text-black"
            role="button"
            aria-label="Logout"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
      {isOpen && !isDesktop && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10" 
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;