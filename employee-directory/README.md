# Employee Directory

## Overview
The Employee Directory is a web application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to manage employee records and departments efficiently. Users can register, log in, and perform CRUD operations on employees and departments.

## Features
- User authentication (registration, login, and profile retrieval)
- CRUD operations for employees and departments
- Pagination and search functionality for employee listings
- Role-based access control for different user roles (admin, user)
- Responsive design for mobile and desktop users

## Technologies Used
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JSON Web Tokens (JWT) for authentication
  - dotenv for environment variable management

- **Frontend:**
  - React (with Vite)
  - Axios for API requests
  - React Router for navigation
  - Tailwind CSS (or plain CSS) for styling

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB account (for database hosting)

### Backend Setup
1. Navigate to the `server` directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template and fill in your MongoDB URI and JWT secret:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template and set the API URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the React application:
   ```
   npm run dev
   ```

## Deployment

The deployment files are ready for Render and Vercel:

- `render.yaml` configures the backend service from `server/`.
- `client/vercel.json` enables client-side routing on Vercel.

### 1. MongoDB Atlas

1. Create a MongoDB Atlas account and create a free **M0** cluster.
2. Create a database user under **Database Access**. Store the username and password securely.
3. Under **Network Access**, add `0.0.0.0/0` so Render can connect. Restrict this later if you use a fixed egress IP or private networking.
4. Choose **Connect > Drivers**, copy the Node.js connection string, and replace its placeholders. Use `employee-directory` as the database name.

Example format:

```text
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/employee-directory?retryWrites=true&w=majority
```

### 2. Render backend

1. Push this repository to GitHub and create a **Web Service** on Render.
2. Select the repository. Render will read `render.yaml`, or configure these values manually:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
3. Add these environment variables in Render:
   - `MONGO_URI`: the Atlas connection string
   - `JWT_SECRET`: a long random secret, different from local development
   - `CLIENT_URL`: the final Vercel URL, such as `https://employee-directory.vercel.app`
   - `PORT`: leave unset so Render can provide its port, or set it only if required by the service
4. Deploy and copy the backend URL, for example `https://employee-directory-api.onrender.com`.

### 3. Vercel frontend

1. Import the same repository into Vercel.
2. Set the project root directory to `client`.
3. Use:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add the environment variable `VITE_API_URL` with the deployed Render URL, without a trailing slash.
5. Deploy the frontend, then update Render's `CLIENT_URL` with the exact Vercel origin if it changed.

### Post-deployment checklist

- Confirm Atlas allows the Render connection and the database user has the required permissions.
- Confirm `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` are set on Render and contain no surrounding quotes or accidental spaces.
- Confirm `VITE_API_URL` is set on Vercel before building; Vite variables are compiled into the frontend at build time.
- Open the deployed frontend and verify register, login, `/api/auth/me`, employee CRUD, department CRUD, search, status, and stats.
- Check browser network errors for CORS. The frontend origin must exactly match `CLIENT_URL`, including protocol and without a trailing slash.
- Confirm `https://<render-service>.onrender.com/api/auth/me` returns `401` without a token rather than a CORS error.
- Confirm JWT expiry and invalid-token behavior still redirects users to `/login`.
- Never commit `.env` files, Atlas credentials, or JWT secrets.

## Usage
- Access the application in your browser at `http://localhost:3000`.
- Use the login and registration forms to create an account and log in.
- Once logged in, you can manage employees and departments through the dashboard.

## License
This project is licensed under the MIT License.