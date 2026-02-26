# 💰 FinanceFlow - Personal Finance Tracker

A full-stack personal finance tracking application that helps you manage income, expenses, and financial goals with an intuitive dashboard, powerful analytics, and secure authentication.

## 🌐 Live Demo

- **Frontend:** https://finance-track-frontend-2p84.vercel.app

**Test Credentials:**
- Email: `meii@gmail.com`
- Password: `12345678`

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ User registration with username, email, password
- ✅ Secure login with JWT token generation
- ✅ Protected routes (frontend & backend)
- ✅ Password hashing with bcrypt
- ✅ Token expiration & refresh logic
- ✅ Logout functionality with session cleanup
- ✅ Profile management (update username)
- ✅ Delete account with confirmation & data cleanup

### 💵 Transaction Management (CRUD)
- ✅ Create transactions with amount, type, category, description, date
- ✅ Read: List all transactions with pagination
- ✅ Update: Edit existing transactions
- ✅ Delete: Remove transactions with confirmation modal
- ✅ Auto-calculate totals (income, expenses, net)

### 🔍 Advanced Filtering & Search
- ✅ Global search (description, category)
- ✅ Filter by type: Income / Expense
- ✅ Filter by category (dynamic from transactions)
- ✅ Filter by date range (start & end date)
- ✅ Sort by date (newest/oldest) or amount (high/low)
- ✅ Clear all filters with one click
- ✅ Active filters badge with count

### 📊 Dashboard & Analytics
- ✅ Summary cards: Total Transactions, Total Income, Total Expenses
- ✅ Interactive charts with Recharts:
  - Pie chart: Expenses by category
  - Bar chart: Income vs Expenses over time
  - Line chart: Net balance trend
- ✅ Real-time updates when transactions change
- ✅ Empty state handling with helpful messages

### 🎨 User Experience & UI
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Modern dark mode interface with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Toast notifications for success/error feedback
- ✅ Loading states with custom spinner component
- ✅ Confirmation modals for destructive actions
- ✅ Mobile navigation toggle with hamburger menu
- ✅ Form validation with real-time feedback
- ✅ Accessible color contrast & focus states

### ⚙️ Advanced Functionality
- ✅ Pagination with customizable page size (10/20/50/100)
- ✅ Date formatting with date-fns
- ✅ Error boundaries & graceful error handling
- ✅ API error parsing & user-friendly messages

### 🐳 DevOps & Deployment
- ✅ Dockerfile for backend (Node.js + Prisma)
- ✅ Dockerfile for frontend (Vite + Nginx)
- ✅ docker-compose.yml for local orchestration
- ✅ Nginx reverse proxy for SPA routing & API proxying
- ✅ Environment variable management (.env + .env.example)
- ✅ CORS configuration for cross-origin requests
- ✅ Health check endpoint for monitoring
- ✅ Prisma migrations for database schema management

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks & concurrent features |
| **Vite** | Fast build tool & dev server |
| **React Router v6** | Client-side routing with nested routes |
| **Tailwind CSS** | Utility-first styling with dark mode |
| **Recharts** | Declarative charts & data visualization |
| **Axios** | HTTP client with interceptors |
| **React Toastify** | Beautiful toast notifications |
| **Framer Motion** | Smooth animations & transitions |
| **date-fns** | Lightweight date formatting & manipulation |
| **React Icons** | Consistent icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 20** | JavaScript runtime |
| **Express** | Minimal web framework |
| **Prisma** | Type-safe ORM with migrations |
| **PostgreSQL** | Relational database |
| **JWT** | Stateless authentication tokens |
| **Bcrypt** | Secure password hashing |
| **CORS** | Cross-origin resource sharing |
| **Zod** | Schema validation for API requests |
| **Dotenv** | Environment variable management |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization for consistent environments |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy & static file serving |
| **Vercel** | Frontend hosting with CDN & auto-deploys |
| **Render** | Backend hosting + managed PostgreSQL |
| **GitHub** | Version control & collaboration |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 15 or higher (for local development)
- npm or yarn package manager
- Docker & Docker Compose (optional, for containerized setup)

### Option 1: Local Development (Without Docker)

1. **Clone the repository**
```bash
git clone https://github.com/melat-lema/Finance_Track.git
cd personal-finance-tracker
