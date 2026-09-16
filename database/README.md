# TravelGo Database Setup Guide

This directory contains the database schema and seed data for the **TravelGo — Online Tourism Management System**.

## Prerequisites
- MySQL Server 8.0+ installed and running.
- MySQL Command Line Client or MySQL Workbench.

---

## Quick Setup

### Option 1: Via MySQL Command Line

1. Open your terminal or PowerShell and log into MySQL:
   ```bash
   mysql -u <your_username> -p
   ```
2. Run the schema creation script:
   ```sql
   source /path/to/travelgo-tourism-management/database/schema.sql;
   ```
3. Run the initial seed script:
   ```sql
   source /path/to/travelgo-tourism-management/database/seed.sql;
   ```

Or run directly from PowerShell:
```powershell
Get-Content database\schema.sql | mysql -u <your_username> -p
Get-Content database\seed.sql | mysql -u <your_username> -p
```

---

## Seed Accounts

The seed script creates the following default accounts for development & testing:

| Role | Email | Password | Phone |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@travelgo.com` | `Admin@123` | +91 9876543210 |
| **USER** | `john@example.com` | `User@123` | +91 9876543210 |
| **USER** | `priya@example.com` | `User@123` | +91 9812345678 |
| **USER** | `rahul@example.com` | `User@123` | +91 9898989898 |

*Note: All passwords are stored with 10-round BCrypt encryption.*

---

## Entity Relationship Overview

```
User (1) ──────────< (N) Bookings (1) ────────── (1) Payment
 │  (1) ──────────< (N) Reviews
 └──(1) ──────────< (N) Wishlist

Destination (1) ───< (N) TourPackages (1) ───────< (N) PackageImages
                              │  (1) ───< (N) Bookings
                              │  (1) ───< (N) Reviews
                              └──(1) ───< (N) Wishlist
```
