# PawMap - Frontend

For the Hungarian version, please see [README.md](./README.md).

Welcome to the frontend repository for the PawMap project! PawMap is a web application that helps you discover and share pet-friendly places.

**Live Demo:** [**pawmap.eu**](https://pawmap.eu)

---

### Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
- [Backend Repository](#backend-repository)

---

### Project Overview

The goal of PawMap is to collect and display pet-friendly places (such as restaurants, parks, shops, etc.) on an interactive map. Users can add new places to the map and browse existing ones.

_Replace this with a screenshot of the running application:_

### Key Features

- **Interactive Map:** Browse pet-friendly places on a map-based interface.
- **Add Places:** Registered users can add new pet-friendly locations to the map.
- **Search and Filter:** Search for places by name, category, or city.
- **User Account:** Register and log in to access personal features.
- **Responsive Design:** The application is designed to be user-friendly on both mobile and desktop devices.

### Technologies Used

This project is built on modern frontend technologies to provide a fast and user-friendly experience.

- **Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [shadcn/ui](https://ui.shadcn.com/)
- **Map:** Leaflet
- **API Communication:** Custom service-based API handling layer

### Installation and Setup

Follow these steps to run the project in a local environment:

1.  **Clone the repository:**

    ```
    git clone https://github.com/peter7ec/PawMap-frontend.git
    cd PawMap-frontend
    ```

2.  **Install dependencies:**

    ```
    npm install
    ```

3.  **Create the environment variables file:**
    Create a `.env` file in the project's root directory based on `.env.example`, and provide the backend API endpoint.

    ```
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

4.  **Start the development server:**
    ```
    npm run dev
    ```
    After this, the project will be available at `http://localhost:5173` (or whatever address Vite outputs to the terminal).

### Backend Repository

The backend for this frontend (built with Express.js, Prisma, PostgreSQL) is located in a separate repository.

[**PawMap Backend Repository**](https://github.com/peter7ec/PawMap-backend)
