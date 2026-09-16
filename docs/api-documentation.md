# TravelGo — REST API Documentation

Base URL: `http://localhost:8080/api`

All authenticated endpoints require an `Authorization` header formatted as:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication APIs

### Register New User
- **Method**: `POST`
- **Path**: `/auth/register`
- **Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "User@123",
  "phone": "+91 9876543210"
}
```
- **Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 2,
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

### User Login
- **Method**: `POST`
- **Path**: `/auth/login`
- **Request Body**:
```json
{
  "email": "admin@travelgo.com",
  "password": "Admin@123"
}
```
- **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "fullName": "TravelGo Admin",
  "email": "admin@travelgo.com",
  "role": "ADMIN"
}
```

### Get Current Profile
- **Method**: `GET`
- **Path**: `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: User profile DTO without sensitive fields.

---

## 2. Destinations APIs

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/destinations?activeOnly=true` | Public | List all destinations |
| `GET` | `/destinations/{id}` | Public | Get single destination details |
| `POST` | `/destinations` | Admin | Create a new destination |
| `PUT` | `/destinations/{id}` | Admin | Update destination |
| `DELETE` | `/destinations/{id}` | Admin | Delete / Deactivate destination |

---

## 3. Tour Packages APIs

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/packages` | Public | Filter packages by destination, price, category, duration |
| `GET` | `/packages/{id}` | Public | Get package details with image gallery |
| `GET` | `/packages/admin/all` | Admin | Get all packages (including inactive) |
| `POST` | `/packages` | Admin | Create new package |
| `PUT` | `/packages/{id}` | Admin | Update package |
| `DELETE` | `/packages/{id}` | Admin | Delete / Soft-deactivate package |

**Query Filters for `/packages`**:
- `destinationId`: `Long`
- `category`: `String` (e.g. `Adventure`, `Family`, `Honeymoon`)
- `minPrice`: `BigDecimal`
- `maxPrice`: `BigDecimal`
- `duration`: `Integer`
- `search`: `String` (matches package name, destination name, or state)

---

## 4. Bookings APIs

### Create Booking
- **Method**: `POST`
- **Path**: `/bookings`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "packageId": 3,
  "travelDate": "2025-04-15",
  "travellers": 2,
  "contactName": "John Doe",
  "contactEmail": "john@example.com",
  "contactPhone": "+91 9876543210",
  "specialRequests": "Lake-view houseboat preference"
}
```
*Note: Price is computed exclusively on the server from the database package rate and 5% GST.*

### My Bookings
- **Method**: `GET`
- **Path**: `/bookings/my`
- **Access**: Authenticated

### Cancel Booking
- **Method**: `PUT`
- **Path**: `/bookings/{id}/cancel`
- **Access**: Authenticated

---

## 5. Payments APIs (Razorpay)

### Create Razorpay Order
- **Method**: `POST`
- **Path**: `/payments/create-order`
- **Request Body**:
```json
{
  "bookingId": 1
}
```
- **Response**: Order ID, amount in INR, currency, public key.

### Verify Signature & Confirm Booking
- **Method**: `POST`
- **Path**: `/payments/verify`
- **Request Body**:
```json
{
  "bookingId": 1,
  "razorpayOrderId": "order_P9182371k2h198",
  "razorpayPaymentId": "pay_P9182381273912",
  "razorpaySignature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "paymentMethod": "UPI"
}
```

---

## 6. Wishlist APIs

- `GET /wishlist`: Retrieve saved tour packages.
- `POST /wishlist/{packageId}`: Save package to wishlist.
- `DELETE /wishlist/{packageId}`: Remove package from wishlist.

---

## 7. Reviews APIs

- `GET /reviews/package/{packageId}`: Get approved customer reviews.
- `POST /reviews`: Submit a rating (1-5) and feedback comment.
- `PUT /reviews/{id}/status`: Admin moderation (APPROVED, HIDDEN, PENDING).
- `DELETE /reviews/{id}`: Admin deletion.

---

## 8. Admin Management APIs

- `GET /admin/dashboard`: Metrics cards (Users, Packages, Bookings, Revenue, Trends).
- `GET /admin/users`: Registered user listing.
- `PUT /admin/users/{id}/status`: Activate or deactivate account.
- `GET /admin/bookings`: All customer booking reservations.
- `PUT /admin/bookings/{id}/status`: Update status (PENDING, CONFIRMED, COMPLETED, CANCELLED).
- `GET /admin/payments`: Verified transaction audit log.
- `POST /upload/image`: Image upload to Cloudinary with fallback.
