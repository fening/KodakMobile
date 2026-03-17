import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export interface Notification {
  id: string;
  message: string;
  link: string;
  isRead: boolean;
}

interface NotificationPopupProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({ notifications, onClose, onMarkAsRead }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      {notifications.length === 0 ? (
        <p className="px-4 py-2 text-gray-500">No new notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="border-b last:border-b-0">
              <Link
                to={notification.link}
                className={`block px-4 py-2 text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700 font-semibold'}`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                {notification.message}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
