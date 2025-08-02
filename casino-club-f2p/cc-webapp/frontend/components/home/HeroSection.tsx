import React from 'react';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
    return (
        <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to Casino-Club F2P!</h1>
            <p className="text-lg mb-8">Join the ultimate gaming experience and start your adventure now!</p>
            <Button label="Start Playing" onClick={() => console.log('Game Started')} />
        </section>
    );
};

export default HeroSection;