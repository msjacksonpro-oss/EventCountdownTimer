# ⏳ ChronoPulse - Event Countdown Timer & Planner
> **Project 14: Event Countdown Timer**  
> A full-stack web application built with **Django REST Framework (DRF)**, **SimpleJWT**, and **React (Vite)**.

![ChronoPulse Banner](https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Overview

**ChronoPulse** allows users to schedule, categorize, and track milestones with **high-precision, real-time live ticking countdowns** (Days, Hours, Minutes, Seconds). The app includes smart features such as dynamic category badges, customizable color themes, timeline progress indicators, real-time search, sorting, and celebratory confetti upon milestone arrival.

---

## 🚀 Key Features

* ⏱️ **Real-Time Live Countdown Engine**: Calculates days, hours, minutes, and seconds remaining, updating smoothly every single second with visual tick animations.
* 🌟 **Milestone Spotlight Banner**: Automatically features the nearest upcoming event with a massive visual countdown and timeline percentage bar.
* 🏷️ **Categorization & Color Tagging**:
  * 🎂 Birthday (Blue)
  * ✈️ Vacation / Trip (Emerald Green)
  * 📚 Final Exam (Red)
  * 💼 Team Meeting (Amber)
  * 🚀 Product Launch (Purple)
  * 🌴 Holiday (Cyan)
  * ❤️ Anniversary (Pink)
  * 🎯 Other / Custom (Indigo)
* 🎨 **Interactive Live Preview Modal**: Preview your countdown card in real-time as you type, select colors, and pick categories.
* ⚡ **Quick Time Presets**: Rapidly schedule events (`+1 Hour`, `Tomorrow`, `In 3 Days`, `In 1 Week`, `In 1 Month`).
* 🔍 **Instant Search & Multi-Sort**: Search by title/notes and sort by *Nearest Event First*, *Farthest First*, *Newest Created*, or *Alphabetical*.
* 🗂️ **Grid & List Views**: Switch between responsive grid cards and compact list view.
* 🔐 **Secure JWT Authentication**: Secure user registration, login, token refresh, and session persistence.
* 🚀 **1-Click Instant Demo Login**: Built-in evaluation mode that instantly signs in a test account seeded with sample countdown events.
* 🎉 **Confetti Celebrations**: Automatic fireworks and confetti effects when milestones complete.

---

## 🏗️ Technology Stack

### Backend
* **Python 3.14+**
* **Django 6.0+**
* **Django REST Framework (DRF)**
* **Django REST Framework SimpleJWT** (JWT Authentication)
* **django-cors-headers** (CORS support)
* **SQLite Database**

### Frontend
* **React 19 + Vite**
* **React Router Dom 7**
* **Axios** (with JWT Interceptors & Auto Refresh)
* **Lucide React** (Modern Icons)
* **Canvas-Confetti** (Particle Celebrations)
* **Vanilla CSS Glassmorphism Design System**

---

## 📁 Project Architecture

```
EventCountdownTimer/
├── backend/
│   ├── backend/
│   │   ├── settings.py         # Django settings, JWT configuration & CORS
│   │   ├── urls.py             # Main routing
│   │   └── wsgi.py
│   ├── event_api/
│   │   ├── admin.py            # Django Admin registration
│   │   ├── models.py           # Event model with category, color, target_date
│   │   ├── serializers.py      # Event, User & Register serializers
│   │   ├── urls.py             # App routing (/api/events/, /api/auth/...)
│   │   └── views.py            # EventViewSet, DemoLoginView, SeedDemoEventsView
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header with live clock & quick action buttons
│   │   │   ├── SpotlightEvent.jsx    # Hero card spotlighting nearest event
│   │   │   ├── StatsOverview.jsx     # Metrics (Active, Completed, Total)
│   │   │   ├── FilterBar.jsx         # Search, category pills, sort dropdown, status tabs
│   │   │   ├── EventCard.jsx         # Live countdown card with dynamic colors
│   │   │   ├── EventFormModal.jsx    # Add/Edit event modal with live preview
│   │   │   ├── DeleteModal.jsx       # Confirmation dialog
│   │   │   └── ConfettiCelebration.jsx # Confetti effects
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # User state & JWT token management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Main countdown dashboard
│   │   │   ├── Login.jsx             # JWT Login & 1-Click Demo Login
│   │   │   └── Register.jsx          # User registration page
│   │   ├── services/
│   │   │   └── api.js                # Axios instance with SimpleJWT interceptors
│   │   ├── utils/
│   │   │   └── timeUtils.js          # Countdown math & formatting helpers
│   │   ├── App.jsx                   # React Router routes & auth guards
│   │   ├── index.css                 # Glassmorphism cyber design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🛠️ Setup & Running Locally

### 1. Backend Setup (Django)

```bash
# Navigate to backend
cd backend

# Install Python requirements
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start the Django server
python manage.py runserver 127.0.0.1:8000
```
> The Django REST API will be accessible at: `http://127.0.0.1:8000/api/`

---

### 2. Frontend Setup (React + Vite)

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
> The React web app will be accessible at: `http://localhost:5173/`

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/` | Register a new user | No |
| `POST` | `/api/auth/login/` | Obtain JWT access & refresh tokens | No |
| `POST` | `/api/auth/refresh/` | Refresh expired access token | No |
| `GET` | `/api/auth/me/` | Get current authenticated user profile | Yes |
| `POST` | `/api/auth/demo/` | 1-Click Instant Demo login | No |
| `GET` | `/api/events/` | List all events (supports `?category=`, `?search=`, `?sort=`) | Yes |
| `POST` | `/api/events/` | Create a new event | Yes |
| `GET` | `/api/events/:id/` | Retrieve a specific event | Yes |
| `PUT` | `/api/events/:id/` | Update an existing event | Yes |
| `DELETE` | `/api/events/:id/` | Delete an event | Yes |
| `POST` | `/api/events/seed/` | Populate sample demo events | Yes |

---

## 👤 Default Accounts

* **Demo User**: `demo_user` / `demo1234` *(or use the 1-Click Demo button)*
* **Admin Superuser**: `admin` / `admin123` *(Django Admin at `http://127.0.0.1:8000/admin/`)*
