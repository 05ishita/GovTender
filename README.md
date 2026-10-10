# GovTender — Government Tender & RFP Marketplace

A full-stack web application that connects contractors with professional bid and proposal writers. GovTender helps users discover tenders, manage applications, collaborate with writers, and analyze RFP requirements using AI.

**Live Website:** https://govtender-three.vercel.app/  
**Backend API:** https://govtender-backend.onrender.com  
**GitHub Repository:** https://github.com/05ishita/GovTender

## Overview

GovTender is designed to simplify the government tender and Request for Proposal (RFP) process. It provides a centralized platform where contractors can publish tender opportunities and writers can discover relevant projects, submit applications, and collaborate with contractors.

The platform also includes an AI-assisted RFP analysis workflow to help identify project requirements, required skills, deadlines, potential risks, and suitable writers.

## Key Features

- **Authentication and Role-Based Access:** Separate access for contractors, writers, and administrators.
- **Tender Management:** Create, browse, view, and manage tender opportunities.
- **Application Management:** Submit applications and manage application statuses, including shortlisting and selection.
- **Writer Profiles:** Display writer skills, experience, and profile information.
- **AI-Powered RFP Analysis:** Analyze RFP content and extract useful project insights using Gemini AI.
- **Messaging:** Support communication between platform users.
- **Notifications:** Keep users informed about relevant application and status updates.
- **Reviews and Ratings:** Support feedback and reviews within the marketplace.
- **Dashboards:** Provide role-specific views for managing platform activities.
- **Responsive Interface:** Built with a modern React-based frontend.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT-based authentication
- Multer for file uploads
- Gemini API for AI-assisted RFP analysis

## Application Architecture

```text
GovTender/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── scripts/
│   ├── uploads/
│   ├── index.js
│   └── package.json
│
└── README.md
```

*Note: The exact folder structure may vary slightly depending on the current implementation.*

## Getting Started

### Prerequisites

Install the following before running the project locally:

- Node.js and npm
- MongoDB Atlas account or a compatible MongoDB instance
- Gemini API key for AI analysis features

### 1. Clone the Repository

```bash
git clone https://github.com/05ishita/GovTender.git
cd GovTender
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the environment variables required by the backend.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Use the exact Gemini API variable name expected by the source code. Never commit real credentials or secret values to GitHub.

Start the backend:

```bash
npm start
```

The backend should start on the configured port, typically `5000` locally.

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd client
npm install
```

Configure the frontend API base URL using the variable expected by the frontend source code. If the code uses `VITE_API_URL`, create `client/.env` with:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, typically:

```text
http://localhost:5173
```

### 4. Build the Frontend

From the `client` directory, run:

```bash
npm run build
```

Vite generates the production build in the `dist` directory.

## Deployment

The project is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Production URLs:

- Frontend: https://govtender-three.vercel.app/
- Backend: https://govtender-backend.onrender.com

Configure the production frontend API URL to point to the deployed backend. Set database credentials, JWT secrets, and AI API keys through the hosting provider's environment-variable settings.

## Security Notes

- Keep `.env` files and credentials private.
- Never expose JWT secrets or AI API keys in frontend code.
- Use server-side authorization for protected operations.
- Do not allow public registration to assign administrator privileges.
- Validate user input and uploaded files before processing them.

## Future Enhancements

- Advanced tender search and filtering
- Improved writer recommendation and matching
- Enhanced analytics and reporting
- Additional automated tests and monitoring
- Further improvements to accessibility and performance

## Author

**Ishita Singh**

- GitHub: [@05ishita](https://github.com/05ishita)

---

Built as a full-stack marketplace project focused on tender discovery, bid-writing collaboration, and AI-assisted RFP analysis.
