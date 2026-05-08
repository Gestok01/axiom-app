<div align="center">
  <h1 align="center">Axiom.</h1>
  <h3>Premium Full-Stack Project & Task Management</h3>
  <br />
</div>

## 🌐 Live Deployments
- **Frontend App:** [https://axiom-app-snowy.vercel.app](https://axiom-app-snowy.vercel.app)
- **Backend API:** [https://axiom-app-oqzb.onrender.com/api/health](https://axiom-app-oqzb.onrender.com/api/health)

*(Note: The backend is hosted on a free Render tier. It may take ~30 seconds to wake up on the first request).*

---

## 🚀 Overview
Axiom is a modern, full-stack web application built to streamline project and task management for teams. It features a highly responsive, custom-designed dark glassmorphism UI, coupled with a robust relational backend. From secure role-based access control to dynamic visual analytics, Axiom provides everything a team needs to track progress efficiently.

## ✨ Key Features

### Frontend Experience
- **Secure Authentication:** Stateless JWT-based authentication flow with protected application routes.
- **Kanban-style Task Board:** Visual interface for managing task lifecycles (To Do, In Progress, Done) seamlessly.
- **Project Workspaces:** Dedicated grid layouts for creating and managing overarching projects.
- **Analytics Dashboard:** Real-time data visualization utilizing `Chart.js` to track total and completed tasks across the workspace.
- **Premium UI/UX:** Custom dark-theme aesthetics featuring animated mesh gradients, frosted glass panels, and snappy micro-animations. Fully responsive across mobile and desktop interfaces.

### Backend Infrastructure
- **RESTful Architecture:** Clean and scalable Express.js API handling standard CRUD operations for users, projects, and tasks.
- **Role-Based Access Control (RBAC):** Granular permissions system ensuring only Admins and Managers can create or delete resources, while Members are restricted to status updates.
- **Relational Database Design:** Built on SQLite using Prisma ORM for type-safe database queries and strict relational mapping.
- **Robust Security & Validation:** Passwords are encrypted using `bcryptjs`. Global error handlers catch runtime exceptions, ensuring the server remains stable under bad payloads.

---

## 💻 Tech Stack
- **Frontend:** React 18, Vite, React Router DOM, Axios, Chart.js, Lucide Icons, Vanilla CSS.
- **Backend:** Node.js, Express.js, JSONWebToken (JWT), Bcrypt.js.
- **Database:** Prisma ORM, SQLite.

---

## 🛠️ Local Development Setup

If you want to run Axiom locally on your own machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gestok01/axiom-app.git
   cd axiom-app
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   node server.js
   ```

3. **Setup the Frontend:**
   Open a new terminal window.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the App:**
   Open `http://localhost:5173` in your browser.
