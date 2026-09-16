# TravelGo — Project Architecture & Execution Flow

This document details the system architecture, entity relationships, and core workflow lifecycles for the **TravelGo** platform.

---

## 1. System Architecture

```mermaid
graph TD
    Client["React Frontend (Vite + Tailwind CSS)"]
    Gateway["REST API (HTTP / JSON / JWT)"]
    Security["Spring Security 6 (Stateless JWT Filter)"]
    Controller["Spring Boot REST Controllers"]
    Service["Service Layer (Business Logic & Verification)"]
    Repo["Spring Data JPA Repositories"]
    DB[(MySQL Database tourism_db)]
    Razorpay["Razorpay Payment Gateway"]
    Cloudinary["Cloudinary Cloud Storage"]

    Client -->|API Requests| Gateway
    Gateway --> Security
    Security --> Controller
    Controller --> Service
    Service --> Repo
    Repo --> DB
    Service -->|Order Creation & Verification| Razorpay
    Service -->|Image Upload| Cloudinary
```

---

## 2. Entity-Relationship Diagram

```mermaid
erDiagram
    users ||--o{ bookings : places
    users ||--o{ reviews : writes
    users ||--o{ wishlist : saves
    destinations ||--o{ tour_packages : contains
    tour_packages ||--o{ package_images : has
    tour_packages ||--o{ bookings : booked_in
    tour_packages ||--o{ reviews : reviewed_in
    tour_packages ||--o{ wishlist : wished_in
    bookings ||--|| payments : settles

    users {
        bigint id PK
        string full_name
        string email UK
        string password
        string phone
        string role
        string status
    }

    destinations {
        bigint id PK
        string name
        string state
        string country
        text description
        string image_url
        string category
    }

    tour_packages {
        bigint id PK
        bigint destination_id FK
        string name
        int duration_days
        int duration_nights
        decimal price_per_person
        int max_travellers
        decimal rating
        string status
    }

    bookings {
        bigint id PK
        string booking_reference UK
        bigint user_id FK
        bigint package_id FK
        date travel_date
        int travellers
        decimal subtotal
        decimal tax_amount
        decimal total_amount
        string status
    }

    payments {
        bigint id PK
        bigint booking_id FK
        string razorpay_order_id UK
        string razorpay_payment_id UK
        decimal amount
        string status
    }
```

---

## 3. Booking & Razorpay Payment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as User / Guest
    participant UI as React Frontend
    participant API as Spring Boot API
    participant DB as MySQL DB
    participant Gateway as Razorpay

    Customer->>UI: Selects Package & Enters Booking Details
    UI->>API: POST /api/bookings
    Note over API: Strict server-side pricing:<br/>subtotal = rate * travellers<br/>tax = 5% GST<br/>total = subtotal + tax
    API->>DB: Save Booking with status 'PENDING'
    API-->>UI: Return Booking Reference & ID
    UI->>API: POST /api/payments/create-order
    API->>Gateway: Create Order (amount in paise)
    Gateway-->>API: Order ID (order_xxx)
    API-->>UI: Order ID & Public Razorpay Key
    UI->>Customer: Opens Razorpay Checkout Modal
    Customer->>Gateway: Completes UPI / Netbanking / Card Payment
    Gateway-->>UI: Payment ID & Signature
    UI->>API: POST /api/payments/verify
    Note over API: Verifies HMAC-SHA256 signature
    API->>DB: Update Payment 'SUCCESS'<br/>Update Booking 'CONFIRMED'
    API-->>UI: Return Confirmation
    UI->>Customer: Renders Booking Confirmation with Reference
```
