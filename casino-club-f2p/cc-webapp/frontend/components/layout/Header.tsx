import React from 'react';
import Image from 'next/image';
import { useAuth } from '../../hooks/useAuth';
import NotificationIcon from '../../public/images/notification-icon.svg';
import SettingsIcon from '../../public/images/settings-icon.svg';

const Header: React.FC = () => {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center">
                <Image src="/images/logo.svg" alt="Casino Club Logo" width={50} height={50} />
                <h1 className="ml-2 text-xl font-bold">Casino Club</h1>
            </div>
            <div className="flex items-center">
                <button className="relative p-2">
                    <Image src={NotificationIcon} alt="Notifications" width={24} height={24} />
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">3</span>
                </button>
                <button className="p-2">
                    <Image src={SettingsIcon} alt="Settings" width={24} height={24} />
                </button>
                <div className="flex items-center ml-4">
                    <Image src={user?.avatar || '/images/default-avatar.png'} alt="User Avatar" width={32} height={32} className="rounded-full" />
                    <div className="ml-2">
                        <p className="text-sm">{user?.nickname}</p>
                        <p className="text-xs">Tokens: {user?.tokens}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;