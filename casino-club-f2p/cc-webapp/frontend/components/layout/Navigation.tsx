import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around p-4 shadow-lg">
            <Link href="/" className="flex flex-col items-center">
                <span className="material-icons">home</span>
                <span className="text-xs">Home</span>
            </Link>
            <Link href="/games" className="flex flex-col items-center">
                <span className="material-icons">gamepad</span>
                <span className="text-xs">Games</span>
            </Link>
            <Link href="/shop" className="flex flex-col items-center">
                <span className="material-icons">shopping_cart</span>
                <span className="text-xs">Shop</span>
            </Link>
            <Link href="/chat" className="flex flex-col items-center">
                <span className="material-icons">chat</span>
                <span className="text-xs">Chat</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center">
                <span className="material-icons">person</span>
                <span className="text-xs">Profile</span>
            </Link>
        </nav>
    );
};

export default Navigation;