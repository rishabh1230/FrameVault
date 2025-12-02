# FrameVault

## Project Overview

**FrameVault** is a full-stack e-commerce application designed for browsing, selecting, and purchasing films or media-related products (like posters, digital copies, or physical media). It features a modern, responsive user interface built with React and a robust backend API powered by Node.js and MongoDB.

### Key Features

* **User Authentication:** Secure registration, login, and profile management (using JWT for session management).
* **Google OAuth:** Seamless sign-up and sign-in using Google accounts.
* **Film Catalog:** Browse a comprehensive list of films, including detailed information fetched from the **TMDB (The Movie Database) API**.
* **Shopping Cart:** Persistent cart functionality to add, remove, and update items before checkout.
* **Order Management:** Users can view their order history and track the status of past purchases.
* **Responsive Design:** A clean, mobile-first design built with Tailwind CSS.

---

## 🛠️ Tech Stack

This project is divided into two main parts: a **Client** (Frontend) and a **Server** (Backend).

### Frontend (Client)

* **Framework:** [React](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Routing:** [React Router DOM](https://reactrouter.com/web/guides/quick-start)
* **State Management:** React Context API
* **API Client:** [Axios](https://axios-http.com/)
* **API Integration:** The Movie Database (TMDB) API

### Backend (Server)

* **Runtime:** [Node.js](https://nodejs.org/en/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** [MongoDB](https://www.mongodb.com/)
* **ORM:** [Mongoose](https://mongoosejs.com/)
* **Authentication:** JWT (Json Web Tokens), Passport.js (for Google OAuth)
* **File Uploads:** [Multer](https://github.com/expressjs/multer) and [Cloudinary](https://cloudinary.com/)
* **Security:** `bcrypt` for password hashing, `cookie-parser`, `cors`

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher)
* MongoDB Atlas or a local MongoDB instance
* A TMDB API Key
* A Cloudinary account for image hosting
* A Google OAuth client ID and secret for social login

### 1. Installation

Clone the repository and install dependencies for both the server and the client.

```bash
# Clone the repository
git clone <repository_url>
cd FrameVault


# Database
MONGODB_URI=<Your_MongoDB_Connection_String>
PORT=8000

# JWT & Cookie
ACCESS_TOKEN_SECRET=<Your_Secret_Access_Token_Key>
REFRESH_TOKEN_SECRET=<Your_Secret_Refresh_Token_Key>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=<Frontend_URL_e.g._http://localhost:5173>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<Your_Cloudinary_Cloud_Name>
CLOUDINARY_API_KEY=<Your_Cloudinary_API_Key>
CLOUDINARY_API_SECRET=<Your_Cloudinary_API_Secret>

# Google OAuth
GOOGLE_CLIENT_ID=<Your_Google_Client_ID>
GOOGLE_CLIENT_SECRET=<Your_Google_Client_Secret>
GOOGLE_CALLBACK_URL=<Your_Server_Callback_URL_e.g._http://localhost:8000/api/v1/users/auth/google/callback>
