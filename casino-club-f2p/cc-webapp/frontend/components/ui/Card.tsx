import React from 'react';

interface CardProps {
    title: string;
    imageUrl: string;
    popularity: number;
}

const Card: React.FC<CardProps> = ({ title, imageUrl, popularity }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
            <img src={imageUrl} alt={title} className="w-full h-32 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">Popularity: {popularity}</p>
            </div>
        </div>
    );
};

export default Card;