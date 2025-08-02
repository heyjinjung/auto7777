import React from 'react';
import Card from '../ui/Card';

const benefitsData = [
    {
        title: 'Exclusive Rewards',
        description: 'Unlock special rewards and bonuses by participating in events.',
        icon: '/images/reward-icon.png',
    },
    {
        title: 'Daily Challenges',
        description: 'Complete daily challenges to earn extra tokens and prizes.',
        icon: '/images/challenge-icon.png',
    },
    {
        title: 'Community Events',
        description: 'Join community events for a chance to win big and connect with others.',
        icon: '/images/community-icon.png',
    },
    {
        title: '24/7 Support',
        description: 'Get assistance anytime with our dedicated support team.',
        icon: '/images/support-icon.png',
    },
];

const BenefitsSection = () => {
    return (
        <section className="benefits-section py-10">
            <h2 className="text-2xl font-bold text-center mb-6">Why Join Casino-Club?</h2>
            <div className="flex overflow-x-auto space-x-4 px-4">
                {benefitsData.map((benefit, index) => (
                    <Card key={index} title={benefit.title} description={benefit.description} icon={benefit.icon} />
                ))}
            </div>
        </section>
    );
};

export default BenefitsSection;