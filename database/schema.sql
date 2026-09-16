-- TravelGo Database Schema
-- Single Source of Truth
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS tourism_db;

USE tourism_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(50),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tour_packages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    duration_days INT NOT NULL,
    duration_nights INT NOT NULL,
    price_per_person DECIMAL(10,2) NOT NULL,
    max_travellers INT NOT NULL,
    category VARCHAR(50),
    main_image_url VARCHAR(500),
    included_services TEXT,
    excluded_services TEXT,
    itinerary TEXT,
    cancellation_policy TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_package_destination
        FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS package_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    package_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,

    CONSTRAINT fk_image_package
        FOREIGN KEY (package_id)
        REFERENCES tour_packages(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_reference VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    package_id BIGINT NOT NULL,
    travel_date DATE NOT NULL,
    travellers INT NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    special_requests TEXT,
    price_per_person DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED')
        NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_booking_package
        FOREIGN KEY (package_id)
        REFERENCES tour_packages(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL UNIQUE,
    razorpay_order_id VARCHAR(100) UNIQUE,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status ENUM('CREATED','SUCCESS','FAILED','REFUNDED')
        NOT NULL DEFAULT 'CREATED',
    payment_method VARCHAR(50),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    package_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    status ENUM('PENDING','APPROVED','HIDDEN')
        NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_review_package
        FOREIGN KEY (package_id)
        REFERENCES tour_packages(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    package_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_wishlist UNIQUE (user_id, package_id),

    CONSTRAINT fk_wishlist_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_wishlist_package
        FOREIGN KEY (package_id)
        REFERENCES tour_packages(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
