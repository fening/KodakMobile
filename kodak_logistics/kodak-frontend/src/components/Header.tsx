import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';
import { logout } from '../services/AuthService';
import { NotificationPopup } from './Notification';
import { useNotifications } from '../components/NotificationContext';

interface HeaderProps {
  toggleSidebar: () => void;
  username: string;
  pageTitle: string;
  showMenuButton: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, username, pageTitle, showMenuButton }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  // Use the NotificationContext
  const { notifications, unreadCount, markAsRead, refreshNotifications } = useNotifications();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      refreshNotifications();  // Refresh notifications when opening the popup
    }
  };

  const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logout();
    navigate('/login');
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showMenuButton && (
            <button onClick={toggleSidebar} className="mr-4">
              <Menu size={24} />
            </button>
          )}
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={toggleNotifications} className="relative">
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <NotificationPopup
                notifications={notifications}
                onClose={toggleNotifications}
                onMarkAsRead={handleMarkAsRead}
              />
            )}
          </div>
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center space-x-2">
              <User size={24} />
              <span className="hidden md:inline">{username}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User size={16} className="inline mr-2" />
                  Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings size={16} className="inline mr-2" />
                  Settings
                </Link>
                <hr className="my-1" />
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="button"
                  aria-label="Logout"
                >
                  <LogOut size={16} className="inline mr-2" />
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
