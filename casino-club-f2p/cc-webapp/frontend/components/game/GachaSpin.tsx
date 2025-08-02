import React, { useState } from 'react';
import { Button } from '../ui/Button';

const GachaSpin: React.FC = () => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleSpin = () => {
        setSpinning(true);
        setResult(null);

        // Simulate a spin result after a delay
        setTimeout(() => {
            const outcomes = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'];
            const randomResult = outcomes[Math.floor(Math.random() * outcomes.length)];
            setResult(randomResult);
            setSpinning(false);
        }, 2000);
    };

    return (
        <div className="gacha-spin-container">
            <h2 className="text-2xl font-bold mb-4">Gacha Spin</h2>
            <div className="spin-area">
                {spinning ? (
                    <div className="spinner">Spinning...</div>
                ) : (
                    <div className="result">{result ? `You got: ${result}` : 'Spin to win!'}</div>
                )}
            </div>
            <Button onClick={handleSpin} disabled={spinning} className="mt-4">
                {spinning ? 'Spinning...' : 'Spin Now!'}
            </Button>
        </div>
    );
};

export default GachaSpin;