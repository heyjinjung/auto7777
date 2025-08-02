import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Navigation from '../../components/layout/Navigation';
import HeroSection from '../../components/home/HeroSection';
import BenefitsSection from '../../components/home/BenefitsSection';
import CommunityHub from '../../components/home/CommunityHub';

const SignupPage = () => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        // Handle signup logic here
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <HeroSection />
                <section className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Create Your Account</h2>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <button type="submit" className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition">
                            Sign Up
                        </button>
                    </form>
                </section>
                <BenefitsSection />
                <CommunityHub />
            </main>
            <Footer />
            <Navigation />
        </div>
    );
};

export default SignupPage;