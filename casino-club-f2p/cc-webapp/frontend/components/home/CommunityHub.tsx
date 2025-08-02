import React from 'react';
import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CommunityHub = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch ongoing events from an API or a static source
        const fetchEvents = async () => {
            // Placeholder for fetching events
            const response = await fetch('/api/events'); // Adjust the API endpoint as necessary
            const data = await response.json();
            setEvents(data);
        };

        fetchEvents();
    }, []);

    return (
        <div className="community-hub">
            <h2 className="text-2xl font-bold mb-4">Community Hub</h2>
            <Carousel 
                autoPlay 
                infiniteLoop 
                showThumbs={false} 
                showIndicators={true} 
                interval={5000}
                className="event-carousel"
            >
                {events.map((event) => (
                    <div key={event.id} className="event-slide">
                        <img src={event.image} alt={event.title} className="event-image" />
                        <div className="event-details">
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-description">{event.description}</p>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default CommunityHub;