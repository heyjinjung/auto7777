import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Navigation from '../components/layout/Navigation';
import HeroSection from '../components/home/HeroSection';
import BenefitsSection from '../components/home/BenefitsSection';
import CommunityHub from '../components/home/CommunityHub';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {children}
                <HeroSection />
                <BenefitsSection />
                <CommunityHub />
            </main>
            <Footer />
            <Navigation />
        </div>
    );
};

export default Layout;