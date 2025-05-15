# TechZone Store - MERN E-commerce Platform

## Features

* Full featured shopping cart
* Product reviews and ratings
* Top products carousel
* Product pagination
* Product search feature
* User profile with orders
* Admin product management
* Admin user management
* Admin Order details page
* Mark orders as delivered option
* Checkout process (shipping, payment method, etc)
* Database seeder (products & users)
* **Basic Security:** Helmet, Rate Limiting, Input Sanitization
* **Structured Logging:** Pino for backend logging
* **Code Quality:** ESLint & Prettier configured

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd proj
    ```

2.  **Backend Setup:**
    * Navigate to the backend directory: `cd backend`
    * Create a `.env` file in the `backend` root directory. Copy the contents of `.env.example` into it and fill in your actual values for:
        * `NODE_ENV` (development or production)
        * `PORT` (e.g., 5000)
        * `MONGO_URI` (Your MongoDB connection string)
        * `JWT_SECRET` (A long, random, secret string)
    * Install dependencies: `npm install`

3.  **Frontend Setup:**
    * Navigate to the frontend directory: `cd ../frontend`
    * Install dependencies: `npm install`
    * *(Optional)* Create a `.env` file in the `frontend` root if you want to override API URLs (see `src/constants.js`).

4.  **Run the Application (Development):**
    * From the **root `proj` directory**: `npm run dev`
    * This uses `concurrently` (defined in the root `package.json`) to start both the backend server (with `nodemon`) and the frontend React development server.

5.  **Seed Database (Optional):**
    * To import sample data (users, products):
        ```bash
        # From the root proj directory
        npm run data:import
        ```
    * To destroy all data:
        ```bash
        # From the root proj directory
        npm run data:destroy
        ```

## Available Scripts

### Root Directory (`proj`)

* `npm run dev`: Starts both backend and frontend servers concurrently for development.
* `npm run data:import`: Seeds the database with sample data (runs backend seeder).
* `npm run data:destroy`: Destroys all data in the database (runs backend seeder).

### Backend Directory (`proj/backend`)

* `npm start`: Starts the backend server (for production).
* `npm run server`: Starts the backend server using `nodemon` (for development).
* `npm run lint`: Lints backend code using ESLint.
* `npm run format`: Formats backend code using Prettier.

### Frontend Directory (`proj/frontend`)

* `npm start`: Starts the frontend React development server.
* `npm run build`: Builds the frontend application for production.
* `npm test`: Runs frontend tests.
* `npm run lint`: Lints frontend code using ESLint.
* `npm run format`: Formats frontend code using Prettier.

## Environment Variables (Backend `.env`)

* `NODE_ENV`: `development` or `production`
* `PORT`: Port for the backend server (e.g., 5000)
* `MONGO_URI`: Your MongoDB connection string
* `JWT_SECRET`: Secret key for signing JWTs (make this strong and keep it secret)
* `JWT_EXPIRES_IN`: Token expiration time (e.g., `30d`)

## Linting and Formatting

This project uses ESLint and Prettier to maintain code quality and consistency.

* Run `npm run lint` in `backend` or `frontend` to check for linting errors.
* Run `npm run format` in `backend` or `frontend` to automatically format code.
* Consider installing ESLint and Prettier extensions in your code editor for real-time feedback and auto-formatting on save.
* Husky and lint-staged are configured to automatically lint and format staged files before committing.

