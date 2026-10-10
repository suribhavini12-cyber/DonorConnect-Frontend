# DonorConnect — Frontend

DonorConnect is a blood donor discovery and coordination web platform designed to connect blood requesters with potential blood donors quickly and safely. This repository contains the modern, responsive React frontend application.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Running Locally](#running-locally)
- [Configuring the Backend API URL](#configuring-the-backend-api-url)
- [Project Folder Structure](#project-folder-structure)
- [Available Scripts](#available-scripts)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License & Disclaimer](#license--disclaimer)

---

## Overview

In urgent medical scenarios, finding compatible blood donors quickly is vital. **DonorConnect** simplifies this process by providing a centralized hub where:
- Requesters can post blood requests, monitor their status, and review potential donor matches.
- Donors can browse open requests in their area, express interest, and manage their availability.
- Administrators can moderate requests, manage users, and review platform reports.
- Users can access an AI-powered blood donation information chatbot and smart request assistance.

> **Important Safety Note**: DonorConnect is a donor coordination platform. Donor matching indicates potential coordination fit only. It does not determine clinical compatibility or medical eligibility. Actual medical evaluations and donation procedures are conducted exclusively by certified hospitals, blood banks, and healthcare professionals.

---

## Key Features

### 1. Role-Based Portals & Authentication
- **Secure Authentication**: User registration and login with JWT (JSON Web Tokens).
- **Role-Based Access Control**: Tailored dashboards and routes for **Donors**, **Requesters**, and **Admins**.
- **Protected Routes**: Automatic redirection and session persistence using React Context.

### 2. Blood Request Management (Requesters)
- **Create Blood Requests**: Specify blood group, blood component (Whole Blood, Platelets, Plasma, Red Blood Cells), units required, hospital location, urgency level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and required-by date.
- **Request Tracking**: Monitor request lifecycle states (`PENDING_REVIEW`, `OPEN`, `PARTIALLY_RESPONDED`, `FULFILLED`, `CANCELLED`, `CLOSED`).
- **Event Timeline**: View historical status updates and timeline events for full transparency.
- **Status Updates**: Mark requests as fulfilled or cancel open requests when resolved.

### 3. Potential Donor Matching & Coordination
- **Potential Matches**: Discover registered donors matching the blood group and location criteria.
- **Donor Responses**: Requesters can review interested donors and update coordination status (`CONTACTED`, `CONFIRMED_BY_REQUESTER`).

### 4. Donor Dashboard & Response Management (Donors)
- **Donor Profile**: Set blood group, hospital/city location, contact information, and participation availability (`ACTIVE` or `PAUSED`).
- **Available Requests**: Browse and filter active blood requests needing assistance.
- **Express Interest**: Submit responses to open requests to volunteer for donation.
- **Response Tracking**: View and manage submitted responses (`INTERESTED`, `CONTACTED`, `CONFIRMED_BY_REQUESTER`, `WITHDRAWN`).

### 5. Gemini AI & RAG Integration
- **AI Request Summary**: Generate concise, structured summaries of complex blood requests.
- **AI Duplicate Detection**: Advisory duplicate check to help requesters and admins avoid redundant requests.
- **RAG Donation Chatbot**: Grounded conversational assistant answering blood donation FAQs based on approved educational documents.

### 6. Administration & Moderation (Admins)
- **Admin Dashboard**: Real-time platform metrics (total users, active donors/requesters, request counts, open reports).
- **User Management**: Inspect user accounts and toggle active/inactive account status.
- **Request Moderation**: Review pending requests and update statuses.
- **Report Moderation**: Investigate and resolve user-submitted incident reports.

---

## Technologies Used

- **[React 19](https://react.dev/)**: Modern UI library utilizing functional components and hooks.
- **[Vite 8](https://vite.dev/)**: Next-generation frontend build tool and local development server with Fast Refresh.
- **[React Router DOM 7](https://reactrouter.com/)**: Declarative, client-side routing with role-protected route guards.
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client featuring automatic JWT token interceptors.
- **Vanilla CSS3**: Custom design system featuring responsive layouts, CSS variables, glassmorphism, and status badges.
- **[Oxlint](https://oxc.rs/)**: High-performance JavaScript/JSX linter for code quality.
- **[Docker](https://www.docker.com/) & [Nginx](https://nginx.org/)**: Multi-stage production container build served with Nginx.

---

## Prerequisites

Before running the frontend locally, ensure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)**: Version `18.0.0` or higher (Node.js 20+ LTS recommended).
- **[npm](https://www.npmjs.com/)**: Version `9.0.0` or higher (comes bundled with Node.js).
- **DonorConnect Backend API**: The Spring Boot backend server should be running (default: `http://localhost:8080`).

You can verify your Node.js and npm versions by running:
```bash
node -v
npm -v
```

---

## Installation and Setup

1. **Clone the repository** (or navigate to the frontend directory):
   ```bash
   git clone https://github.com/suribhavini12-cyber/DonorConnect-Frontend.git
   cd DonorConnect-Frontend
   ```
   *(If you are in the monorepo root, navigate to the `frontend` folder):*
   ```bash
   cd frontend
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

---

## Running Locally

To start the Vite local development server:

```bash
npm run dev
```

Once started, the development server will be available at:
```
http://localhost:5173
```

Open this URL in your web browser. Any changes made to the source files will update instantly via Hot Module Replacement (HMR).

---

## Configuring the Backend API URL

The frontend communicates with the backend via Axios (`src/api/axios.js`). It reads the backend base URL using Vite's environment variable: `VITE_API_BASE_URL`.

### Default Configuration
If no environment variable is provided, the application defaults to:
```
http://localhost:8080
```

### Custom Configuration
To customize the backend URL (for example, if your backend runs on a different port or host):

1. Create a `.env` file in the `frontend` directory:
   ```bash
   # On Windows (PowerShell)
   New-Item -ItemType File -Name .env

   # On macOS/Linux
   touch .env
   ```
2. Add your custom backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
   *(For remote or production environments, set `VITE_API_BASE_URL=https://your-backend-api.com`)*

3. Restart the development server (`npm run dev`) for the environment variable changes to take effect.

> **Note**: Real `.env` files are excluded by `.gitignore` to prevent leaking environment-specific configuration or credentials.

---

## Project Folder Structure

```
frontend/
├── public/                     # Static assets served as-is
│   ├── favicon.svg             # Application favicon
│   └── icons.svg               # SVG icon sprites
├── src/
│   ├── api/
│   │   └── axios.js            # Axios client with JWT request interceptor
│   ├── assets/                 # Images and SVG brand assets (hero.png, etc.)
│   ├── components/             # Reusable UI components
│   │   ├── ProtectedRoute.jsx  # Role-based route guard component
│   │   ├── Register.jsx        # User registration form & CSS
│   │   ├── ReportModal.jsx     # User incident reporting modal & CSS
│   │   ├── ResponseStatusBadge.jsx # Badge for donor response status
│   │   └── StatusBadge.jsx     # Badge for request lifecycle status
│   ├── context/
│   │   └── AuthContext.jsx     # Global authentication state and JWT handling
│   ├── pages/                  # Top-level view pages
│   │   ├── Main.jsx            # Landing page for non-logged-in visitors
│   │   ├── Login.jsx           # User sign-in page
│   │   ├── Home.jsx            # Role-specific user dashboard
│   │   ├── DonorProfile.jsx    # Donor profile and participation management
│   │   ├── CreateRequest.jsx   # Blood request creation form
│   │   ├── MyRequests.jsx      # Requester's submitted requests list
│   │   ├── RequestDetails.jsx  # Request detail, event timeline, AI features
│   │   ├── PotentialMatches.jsx# Potential donor matching view
│   │   ├── AvailableRequests.jsx# Browse open requests (Donor view)
│   │   ├── DonorRequestDetails.jsx # Request view with "Express Interest"
│   │   ├── MyResponses.jsx     # Donor's submitted responses list
│   │   ├── Chatbot.jsx         # RAG AI donation guidance chatbot
│   │   ├── AdminDashboard.jsx  # Admin overview & system statistics
│   │   ├── AdminUsers.jsx      # Admin user management & activation
│   │   ├── AdminRequests.jsx   # Admin request moderation
│   │   └── AdminReports.jsx    # Admin report investigation
│   ├── App.jsx                 # Main application component & route configuration
│   ├── App.css                 # Application-wide layout styles
│   ├── index.css               # Global base CSS styles
│   └── main.jsx                # Application entry point
├── .dockerignore               # Docker ignore rules
├── .gitignore                  # Git ignore rules for node_modules, .env, dist
├── .oxlintrc.json              # Oxlint linter configuration
├── Dockerfile                  # Multi-stage production container build
├── index.html                  # HTML entry template
├── nginx.conf                  # Nginx configuration for Docker container
├── package.json                # Project dependencies and npm scripts
├── package-lock.json           # Locked dependency versions
├── vite.config.js              # Vite bundler configuration
└── README.md                   # Project documentation
```

---

## Available Scripts

In the `frontend` directory, you can run the following npm scripts:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server on `http://localhost:5173`. |
| `npm run build` | Compiles and bundles optimized production assets into the `dist/` directory. |
| `npm run preview` | Locally serves and previews the production build from `dist/`. |
| `npm run lint` | Runs **Oxlint** to inspect the codebase for errors and code quality issues. |

---

## Docker Deployment

To build and run the frontend using Docker:

1. **Build the Docker container image**:
   ```bash
   docker build -t donorconnect-frontend .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 80:80 --name donorconnect-frontend donorconnect-frontend
   ```

3. Open your browser and navigate to `http://localhost`. Nginx will serve the compiled static React build.

---

## Contributing

Contributions, feedback, and bug reports are welcome! To contribute:

1. **Fork** the repository on GitHub.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the project's coding style and architecture.
4. **Run the linter** to ensure code cleanliness:
   ```bash
   npm run lint
   ```
5. **Commit your changes**:
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a **Pull Request** with a clear explanation of your changes.

---

## License & Disclaimer

This project is created as part of the **DonorConnect** capstone initiative.

- **Coordination Platform Only**: The application facilitates communication and potential matching between voluntary donors and requesters.
- **Not Medical Advice**: The platform does not diagnose, verify individual medical compatibility, or replace professional medical consultations. Always consult healthcare professionals and certified blood banks for donation procedures.
