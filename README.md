# TravelGo — Complete Full-Stack Online Tourism Management System

![TravelGo Banner](https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1600&q=80)

> **Explore • Book • Travel • Repeat**  
> A complete, professional, production-ready full-stack portfolio application engineered with **Spring Boot 3**, **React 18**, **Tailwind CSS**, **MySQL 8+**, **Cloudinary**, and **Razorpay**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture & System Flow](#architecture--system-flow)
5. [Database Design & Single Source of Truth](#database-design--single-source-of-truth)
6. [ER Diagram](#er-diagram)
7. [Folder Structure](#folder-structure)
8. [API Documentation Overview](#api-documentation-overview)
9. [Environment Variables](#environment-variables)
10. [MySQL Database Setup](#mysql-database-setup)
11. [Backend Setup (Spring Boot)](#backend-setup-spring-boot)
12. [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
13. [Cloudinary Setup (Image Storage)](#cloudinary-setup-image-storage)
14. [Razorpay Setup (Payment Gateway)](#razorpay-setup-payment-gateway)
15. [Google Maps Setup (Optional)](#google-maps-setup-optional)
16. [Production Deployment Architecture](#production-deployment-architecture)
17. [Testing the Application](#testing-the-application)
18. [Postman API Collection](#postman-api-collection)
19. [Common Errors & Troubleshooting](#common-errors--troubleshooting)
20. [Default Demo Accounts](#default-demo-accounts)

---

## 1. Project Overview

**TravelGo** is a comprehensive holiday and tourism management portal engineered for travellers and tour operators across India. It provides customers with an interactive discovery portal, dynamic multi-attribute tour package filtering, authenticated booking flows with rigorous server-side calculations, and secure online payments via Razorpay.

For travel administrators, it features a full-featured admin management dashboard providing live CRUD management over destinations and packages, order status updates, transaction verification, customer management, and review moderation.

---

## 2. Key Features

### For Travellers & Public Users:
- **Hero & Search Engine**: Search packages by destination keyword, travel date, and passenger count.
- **Dynamic Catalog Filters**: Live filtering by destination, price range slider, duration pills, star rating, and travel themes (Adventure, Honeymoon, Family, Heritage).
- **Rich Package Details**: Interactive photo gallery, duration specs, max capacity, inclusions/exclusions, day-by-day itinerary, and cancellation policies.
- **Authenticated Bookings**: Step-by-step booking form with guest details, custom travel requests, and automated server-side price calculation (rate × passengers + 5% GST).
- **Secure Razorpay Checkout**: Integrated checkout supporting UPI, Credit/Debit cards, Netbanking, and automated HMAC-SHA256 signature verification.
- **Booking Confirmation**: Instant confirmation view with a unique alphanumeric reference code (e.g. `TGK-2025-0315-7829`), status badges, and copy-to-clipboard action.
- **Customer Dashboard**: Overview of total bookings, upcoming departures, completed trips, and saved wishlist items.
- **Wishlist & Customer Reviews**: Persistent database wishlist and review submission with star ratings and feedback.

### For Administrators:
- **Metrics & Analytics**: Live dashboard showing Total Users, Active Packages, Total Bookings, and Total Revenue, alongside monthly booking and revenue charts.
- **Package Management**: Add, edit, deactivate, or delete holiday packages with multi-image gallery support. Changes appear immediately on the customer portal.
- **Destination Management**: Create and manage Indian tourist destinations with categories, state mappings, and geo-coordinates.
- **Booking Management**: Monitor all incoming customer bookings, track payment statuses, and transition order states (PENDING, CONFIRMED, COMPLETED, CANCELLED).
- **Payment Audit Log**: Complete transaction log tracking Razorpay Order IDs, Payment IDs, amounts, methods, and verification timestamps.
- **Review Moderation**: Approve or hide customer reviews before they appear publicly on the storefront.
- **User Management**: Monitor registered accounts and toggle active/inactive access.

---

## 3. Technology Stack

### Frontend:
- **Framework**: React.js (v18.2) + Vite 5
- **Styling**: Tailwind CSS v3.4 + PostCSS + Autoprefixer
- **Routing**: React Router DOM v6
- **State & Auth**: React Context API (`AuthContext`)
- **HTTP Client**: Native `fetch()` API (Zero Axios dependency)
- **Icons**: Lucide React
- **Payments**: Razorpay Checkout JS SDK

### Backend:
- **Framework**: Java 17 + Spring Boot 3.2.5
- **Web Layer**: Spring MVC (RESTful API architecture)
- **Persistence**: Spring Data JPA + Hibernate ORM
- **Security**: Spring Security 6 + Stateless JWT + BCrypt Password Encoding
- **Validation**: Jakarta Bean Validation API
- **Build Tool**: Apache Maven
- **Third-Party Integrations**: Razorpay Java SDK, Cloudinary SDK

### Database:
- **Engine**: MySQL 8.0+ / MySQL 9.x
- **Database Name**: `tourism_db`

---

## 4. Architecture & System Flow

```
[ Customer / Admin Browser ]
             │
             │ HTTPS / Native fetch() + JWT Bearer Token
             ▼
   [ Spring Boot 3 REST API ]
   ├── JwtAuthenticationFilter (Security Context)
   ├── Controllers (REST Endpoints)
   ├── Services (Business Validation & Server Pricing)
   ├── Repositories (Spring Data JPA)
   └── MySQL Database (tourism_db)
             │
             ├── Razorpay (Order Creation & HMAC-SHA256 Verification)
             └── Cloudinary (Image Cloud Uploads)
```

---

## 5. Database Design & Single Source of Truth

The database strictly preserves all schema constraints without conflicting table or column names:

1. `users` — Authentication credentials, phone, roles (`USER`, `ADMIN`), status (`ACTIVE`, `INACTIVE`).
2. `destinations` — Tourist destinations, geo-coordinates, description, image, and category.
3. `tour_packages` — Holiday packages linked to destinations with pricing, capacity, inclusions, exclusions, and itinerary.
4. `package_images` — Multiple gallery image URLs ordered by `display_order`.
5. `bookings` — Unique booking references (`booking_reference`), server-computed subtotal, GST tax, and statuses.
6. `payments` — Razorpay order/payment IDs, signatures, amount, currency, and verification status.
7. `reviews` — Ratings (1-5) and comments with moderation states (`PENDING`, `APPROVED`, `HIDDEN`).
8. `wishlist` — User-package pairs with unique constraint `(user_id, package_id)`.

---

## 6. ER Diagram

```
User (1) ──────────< (N) Bookings (1) ────────── (1) Payment
 │  (1) ──────────< (N) Reviews
 └──(1) ──────────< (N) Wishlist

Destination (1) ───< (N) TourPackages (1) ───────< (N) PackageImages
                              │  (1) ───< (N) Bookings
                              │  (1) ───< (N) Reviews
                              └──(1) ───< (N) Wishlist
```

---

## 7. Folder Structure

```
travelgo-tourism-management/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/          # Admin pages (Dashboard, ManagePackages, Users, Bookings...)
│   │   ├── components/     # Reusable components (Navbar, Footer, Hero, PackageCard...)
│   │   ├── context/        # AuthContext state and persistence
│   │   ├── hooks/          # Custom hooks (useAuth)
│   │   ├── layouts/        # UserLayout & AdminLayout
│   │   ├── pages/          # Public & User views (Home, Packages, Details, Booking...)
│   │   ├── routes/         # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/       # Native fetch API client & feature services
│   │   ├── utils/          # Formatters & constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/travelgo/
│   │   │   │   ├── config/      # Web & static resource configuration
│   │   │   │   ├── controller/  # REST controllers
│   │   │   │   ├── dto/         # Request and Response payloads
│   │   │   │   ├── entity/      # JPA Hibernate entities
│   │   │   │   ├── exception/   # Global exception handling
│   │   │   │   ├── repository/  # Spring Data JPA repositories
│   │   │   │   ├── security/    # JWT utilities and Spring Security config
│   │   │   │   ├── service/     # Business logic & payment services
│   │   │   │   └── TravelGoApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   ├── .env.example
│   └── pom.xml
│
├── database/
│   ├── schema.sql           # Schema definition (Single Source of Truth)
│   ├── seed.sql             # Realistic seed data for 8 destinations & packages
│   └── README.md
│
├── docs/
│   ├── api-documentation.md
│   └── project-flow.md
│
├── postman/
│   └── TravelGo-API-Collection.json
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 8. API Documentation Overview

Refer to [`docs/api-documentation.md`](file:///c:/Users/nutha/OneDrive/Documents/travelgo-tourism-management/docs/api-documentation.md) for full request/response schemas.

### Primary Endpoints:
- `POST /api/auth/register` — User registration.
- `POST /api/auth/login` — Issues JWT Bearer token.
- `GET  /api/auth/me` — Current authenticated user profile.
- `GET  /api/destinations` — List all destinations.
- `GET  /api/packages` — Filter packages (`destinationId`, `category`, `minPrice`, `maxPrice`, `duration`, `search`).
- `GET  /api/packages/{id}` — Package details with gallery images.
- `POST /api/bookings` — Create a tour booking with server-side price calculations.
- `GET  /api/bookings/my` — Get current customer's trips.
- `POST /api/payments/create-order` — Generates Razorpay Order.
- `POST /api/payments/verify` — Verifies HMAC-SHA256 signature and confirms booking.
- `GET  /api/wishlist` & `POST /api/wishlist/{packageId}` — Saved packages.
- `GET  /api/admin/dashboard` — Admin KPIs, revenue, and trends.

---

## 9. Environment Variables

### Backend (`backend/.env` or system environment):
```env
DB_URL=jdbc:mysql://localhost:3306/tourism_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password

JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION_MS=86400000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 10. MySQL Database Setup

1. Launch your local MySQL server (MySQL 8.0+ or MySQL 9.x).
2. Open terminal/PowerShell and log into MySQL:
   ```bash
   mysql -u root -p
   ```
3. Execute the schema script:
   ```sql
   source /path/to/travelgo-tourism-management/database/schema.sql;
   ```
4. Execute the seed script:
   ```sql
   source /path/to/travelgo-tourism-management/database/seed.sql;
   ```

---

## 11. Backend Setup (Spring Boot)

1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Build and compile the project using Maven:
   ```bash
   mvn clean compile
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
The backend will launch at `http://localhost:8080`.

---

## 12. Frontend Setup (React + Vite)

1. Navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
The frontend will launch at `http://localhost:5173`.

---

## 13. Cloudinary Setup (Image Storage)

1. Create a free account at [Cloudinary](https://cloudinary.com).
2. Retrieve your **Cloud Name**, **API Key**, and **API Secret** from the Cloudinary dashboard.
3. Configure them in `backend/.env` or system environment variables:
   ```env
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```
*Note: If Cloudinary keys are not provided during development, the backend automatically falls back to local static file upload under `uploads/`.*

---

## 14. Razorpay Setup (Payment Gateway)

1. Sign up for a [Razorpay Test Account](https://razorpay.com).
2. In the Razorpay Dashboard, generate **Test API Keys** (`Key Id` and `Key Secret`).
3. Place `Key Id` in `frontend/.env` (`VITE_RAZORPAY_KEY_ID`).
4. Place `Key Id` and `Key Secret` in `backend/.env`.
*Note: If Razorpay keys are omitted during initial offline testing, the system provides a simulated payment mode so that end-to-end booking verification remains fully testable.*

---

## 15. Google Maps Setup (Optional)

If Google Maps display is desired for destination coordinates:
1. Obtain a Maps JavaScript API key from the Google Cloud Console.
2. Set `VITE_GOOGLE_MAPS_API_KEY` in `frontend/.env`.
3. If not configured, destination coordinates (`latitude`, `longitude`) are displayed with custom location markers without breaking the booking flow.

---

## 16. Production Deployment Architecture

```
                 INTERNET
                    │
                    ▼
          [ React Frontend ]
        (Vercel / Netlify / Cloudflare)
                    │
                    │ HTTPS
                    ▼
       [ Spring Boot 3 Backend ]
      (Render / Railway / AWS EC2)
                    │
                    │ JDBC (Encrypted SSL)
                    ▼
          [ Cloud Managed MySQL ]
     (AWS RDS / Google Cloud SQL / Aiven)
```

- Production backend must **never** connect to `localhost:3306`.
- Provide cloud JDBC connection strings via environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
- Initialize cloud databases using `database/schema.sql` and `database/seed.sql`.

---

## 17. Testing the Application

### Automated Builds:
- **Backend**: `cd backend && mvn test`
- **Frontend**: `cd frontend && npm run build`

### Manual End-to-End Verification:
1. Start MySQL, Spring Boot backend, and React frontend.
2. Open `http://localhost:5173`.
3. Filter packages by "Adventure" or "Kashmir".
4. Click on **Kashmir Paradise** to view the image gallery, itinerary, and inclusions.
5. Click **Book Now**, enter travel date and guest details.
6. Observe the server-calculated subtotal and 5% GST tax.
7. Click **Proceed to Payment**, complete the Razorpay checkout.
8. Receive your verified Booking Confirmation reference code.
9. Visit the **User Dashboard** to see the trip listed under "My Upcoming Trips".
10. Log in as `admin@travelgo.com` and open `/admin` to verify live revenue and booking metrics.

---

## 18. Postman API Collection

Import the pre-configured Postman collection located at:
```
postman/TravelGo-API-Collection.json
```
Includes pre-configured requests for registration, authentication, filter queries, booking creation, payment verification, and admin CRUD.

---

## 19. Common Errors & Troubleshooting

| Error | Cause | Solution |
| :--- | :--- | :--- |
| `CommunicationsException: Communications link failure` | MySQL service is not running on port 3306 | Start MySQL service via Windows Services or run `net start MySQL80` |
| `Access denied for user 'root'@'localhost'` | Incorrect MySQL credentials | Verify your MySQL password in `backend/src/main/resources/application.properties` or set `DB_PASSWORD` env variable |
| `Invalid signature during payment verification` | Mismatch in Razorpay Secret | Verify that `RAZORPAY_KEY_SECRET` in backend matches the key pair used in frontend |
| `CORS error on fetch()` | Port conflict or wrong API URL | Ensure frontend calls `http://localhost:8080/api` and backend CORS allows `http://localhost:5173` |

---

## 20. Default Demo Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@travelgo.com` | `Admin@123` | Full Admin Dashboard & Storefront CRUD |
| **User** | `john@example.com` | `User@123` | Customer Booking, Wishlist, Reviews |
| **User** | `priya@example.com` | `User@123` | Customer Booking, Wishlist, Reviews |

---

## License

This project is licensed under the [MIT License](LICENSE).
