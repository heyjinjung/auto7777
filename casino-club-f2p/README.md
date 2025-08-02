# Casino-Club F2P

Welcome to the Casino-Club F2P project! This repository contains the code for a free-to-play casino-themed web application designed to maximize user engagement and monetization through various interactive features.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Casino-Club F2P is a web application that combines engaging mini-games, a freemium economy, and personalized user experiences within a futuristic neon cyberpunk aesthetic. The application is built with a focus on security, performance, and scalability.

## Technologies Used

- **Frontend**: Next.js, React.js, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, PostgreSQL, Redis, Kafka
- **Testing**: Pytest (Backend), React Testing Library / Jest (Frontend)
- **Containerization**: Docker, Docker Compose

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd casino-club-f2p
   ```

2. Set up the environment variables:
   - Copy `.env.development` to `.env` and update the values as needed.

3. Build and start the application using Docker:
   ```
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)

## Folder Structure

```
casino-club-f2p/
├── docker-compose.yml
├── docker-compose.override.dev.yml
├── docker-compose.prod.yml
├── .env.development
├── .env.production
├── docker-manage.ps1
├── cc-webapp/
│   ├── backend/
│   └── frontend/
│       ├── app/
│       ├── components/
│       ├── lib/
│       ├── hooks/
│       └── public/
├── nginx/
├── data/
└── README.md
```

## Development

For daily development, use the provided PowerShell script to manage Docker containers:

- Start the development environment:
  ```
  .\docker-manage.ps1 start --tools
  ```

- Access the backend shell:
  ```
  .\docker-manage.ps1 shell backend
  ```

- Access the frontend shell:
  ```
  .\docker-manage.ps1 shell frontend
  ```

## Testing

To run tests for the backend and frontend, use the following commands:

- Backend tests:
  ```
  .\docker-manage.ps1 test backend
  ```

- Frontend tests:
  ```
  .\docker-manage.ps1 test frontend
  ```

## Deployment

For production deployment, use the following command:

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d
```

## Contributing

Contributions are welcome! Please follow the standard Git workflow for submitting pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.