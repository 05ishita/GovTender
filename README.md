# GovTender

GovTender is a MERN-based government tender and RFP marketplace that connects contractors with bid writers for proposal work.

## Core features
- JWT authentication with Contractor / Bid Writer / Admin roles
- Tender and RFP creation with PDF/DOC/DOCX uploads
- Tender discovery and detailed tender view
- Writer applications with proposal, rate and match score
- Contractor review, shortlisting and writer selection workflow
- Smart writer recommendations based on skills, experience and availability
- Writer profiles
- Direct messaging with notifications
- Reviews and ratings after selected collaborations
- Admin dashboard with user verification and marketplace stats
- Gemini-powered RFP analysis assistant

## Update an existing Windows project
If you already have `C:\Users\Ankita\Desktop\gov-tender-marketplace`, extract the delivered ZIP completely and run `APPLY-UPDATE.ps1` from the extracted folder in PowerShell. It creates a timestamped backup first and preserves your local `.env` files, `uploads`, and `node_modules`.

## Local setup

### Backend
```powershell
cd server
npm install
copy .env.example .env
npm run dev
```

Set these values in `server/.env`:
- `MONGO_URI`
- `JWT_SECRET` (use a long, unique secret)
- `GEMINI_API_KEY` (optional; AI features use fallback behavior when not configured)
- `CLIENT_URL=http://localhost:5173`

### Create the first admin account (optional)
1. Set `ADMIN_NAME`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` of at least 12 characters in `server/.env`.
2. Run `npm run create-admin` from the `server` directory.
3. Remove the three `ADMIN_*` values from `.env` after the account is created. Admin accounts cannot be created through public registration.

### Frontend
```powershell
cd client
npm install
copy .env.example .env
npm run dev
```

`client/.env` should contain:
```env
VITE_API_URL=http://localhost:5000/api
```

## Production notes
- Never commit `.env` files or uploaded documents.
- Use a strong production `JWT_SECRET`.
- For deployed uploads, replace local disk storage with persistent/object storage if the hosting platform does not provide persistent filesystems.
- Set `CLIENT_URL` and `VITE_API_URL` to the deployed frontend/backend URLs.

## Demo flow
1. Register a Contractor and a Bid Writer.
2. Contractor creates a tender and uploads a tender document.
3. Writer browses the tender and submits an application.
4. Contractor reviews, shortlists and selects the writer.
5. Both users can message each other.
6. Completed selected collaborations can be reviewed from Reviews.
7. AI Assistant can analyze RFP/tender text and suggest writer requirements.
