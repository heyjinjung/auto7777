import React, { useState } from 'react';
import { Button } from '../ui/Button';

const SlotMachine: React.FC = () => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleSpin = () => {
        setSpinning(true);
        setResult(null);

        // Simulate the spinning process
        setTimeout(() => {
            const outcomes = ['🍒', '🍋', '🍊', '🍉', '⭐'];
            const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            setResult(randomOutcome);
            setSpinning(false);
        }, 2000); // Spin duration
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold mb-4">🎰 Slot Machine</h2>
            <div className="flex justify-center items-center mb-4">
                <div className={`slot-reel ${spinning ? 'spinning' : ''}`}>
                    {result ? <span className="text-4xl">{result}</span> : '🎰'}
                </div>
            </div>
            <Button onClick={handleSpin} disabled={spinning}>
                {spinning ? 'Spinning...' : 'Spin'}
            </Button>
            <style jsx>{`
                .slot-reel {
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    border: 2px solid #ff007f;
                    border-radius: 10px;
                    transition: transform 0.5s ease;
                }
                .spinning {
                    animation: spin 0.5s infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SlotMachine;