-- TravelGo Seed Data
-- Comprehensive realistic seed data for Indian Tourism Management System

USE tourism_db;

-- 1. USERS (Passwords hashed with BCrypt)
-- admin@travelgo.com -> Admin@123 ($2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.)
-- john@example.com -> User@123 ($2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.)
-- priya@example.com -> User@123 ($2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.)
-- rahul@example.com -> User@123 ($2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.)
INSERT INTO users (id, full_name, email, password, phone, role, status) VALUES
(1, 'TravelGo Admin', 'admin@travelgo.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', '+91 9876543210', 'ADMIN', 'ACTIVE'),
(2, 'John Doe', 'john@example.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', '+91 9876543210', 'USER', 'ACTIVE'),
(3, 'Priya Sharma', 'priya@example.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', '+91 9812345678', 'USER', 'ACTIVE'),
(4, 'Rahul Verma', 'rahul@example.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', '+91 9898989898', 'USER', 'ACTIVE')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. DESTINATIONS
INSERT INTO destinations (id, name, state, country, description, image_url, category, latitude, longitude, status) VALUES
(1, 'Kerala', 'Kerala', 'India', 'God''s Own Country famous for serene backwaters, palm-fringed lagoons, tranquil houseboats, lush spice plantations, and Ayurvedic wellness retreats.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', 'Backwaters & Nature', 9.4980667, 76.3388484, 'ACTIVE'),
(2, 'Goa', 'Goa', 'India', 'India''s sunshine state famous for sun-kissed golden beaches, vibrant nightlife, Portuguese colonial architecture, scenic forts, and fresh coastal seafood.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', 'Beaches & Nightlife', 15.2993265, 74.1239960, 'ACTIVE'),
(3, 'Kashmir', 'Jammu & Kashmir', 'India', 'Paradise on Earth renowned for the snow-clad Pir Panjal ranges, colorful Shikaras gliding across Dal Lake, Mughal Gardens, and alpine meadows in Gulmarg & Pahalgam.', 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80', 'Heaven on Earth', 34.0836560, 74.7973710, 'ACTIVE'),
(4, 'Manali', 'Himachal Pradesh', 'India', 'High-altitude Himalayan resort town nestled along the Beas River, offering thrilling adventure sports, Rohtang Pass glaciers, Solang Valley ropeways, and cedar pine forests.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', 'Mountains & Adventure', 32.2396325, 77.1887145, 'ACTIVE'),
(5, 'Rajasthan', 'Rajasthan', 'India', 'The land of Maharajas adorned with opulent palaces, majestic desert forts like Amer and Mehrangarh, camel desert safaris in Thar, and vibrant cultural folk traditions.', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80', 'Royal Heritage & Culture', 26.9124336, 75.7872709, 'ACTIVE'),
(6, 'Andaman', 'Andaman and Nicobar', 'India', 'Archipelago in the Bay of Bengal known for its turquoise waters, Radhanagar white sand beaches, coral reef scuba diving, and historic Cellular Jail memorials.', 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80', 'Tropical Islands', 11.7400867, 92.6586401, 'ACTIVE'),
(7, 'Hyderabad', 'Telangana', 'India', 'The historic City of Pearls blending centuries of Nizami grandeur, Golconda Fort, Charminar, aromatic Hyderabadi Biryani, and modern technological dynamism.', 'https://images.unsplash.com/photo-1605469237567-a39930679526?auto=format&fit=crop&w=1200&q=80', 'City & Heritage', 17.3850440, 78.4866710, 'ACTIVE'),
(8, 'Tamil Nadu', 'Tamil Nadu', 'India', 'Cradle of Dravidian art and architecture featuring grand towering temple gopurams of Madurai, Shore Temple of Mahabalipuram, Nilgiri mountain railway, and serene tea hills.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', 'Heritage & Hill Stations', 13.0826802, 80.2707184, 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. TOUR PACKAGES
INSERT INTO tour_packages (id, destination_id, name, description, duration_days, duration_nights, price_per_person, max_travellers, category, main_image_url, included_services, excluded_services, itinerary, cancellation_policy, rating, status) VALUES
(1, 1, 'Kerala Backwaters Escape', 'Unwind in tranquil waterways on a luxury Alleppey houseboat, explore aromatic Munnar tea gardens, and witness traditional Kathakali performances.', 4, 3, 24999.00, 12, 'Family', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', 'Houseboat stay with all meals, AC Deluxe hotel in Munnar, Private AC transfers, Munnar Tea Museum visit, Kathakali show tickets', 'Airfare/Train fare, Personal expenses and shopping, Optional Ayurvedic spa sessions, Travel insurance', 'Day 1: Arrival at Kochi, transfer to Munnar scenic hills\nDay 2: Full day Munnar tea estate & Mattupetty dam exploration\nDay 3: Transfer to Alleppey, check-in to luxury traditional houseboat cruise\nDay 4: Morning cruise, check-out, transfer back to Kochi airport', 'Full refund if cancelled 7 days prior to departure. 50% refund between 3 to 7 days. Non-refundable within 72 hours of travel.', 4.8, 'ACTIVE'),

(2, 2, 'Goa Beach Getaway', 'Experience the best of North and South Goa beaches, cruise along Mandovi river, and indulge in beachfront sunset dining and water activities.', 3, 2, 18999.00, 8, 'Honeymoon', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', '4-Star Beachside Resort accommodation, Daily breakfast buffet, Mandovi Sunset River Cruise, Private North & South Goa sightseeing transfers', 'Flight tickets, Watersports charges, Alcoholic beverages, Monument entry tickets', 'Day 1: Arrival at Goa, transfer to beach resort, evening at Baga beach\nDay 2: Fort Aguada, Old Goa churches, and evening Mandovi luxury sunset cruise\nDay 3: South Goa scenic tour, Colva beach, departure transfer to airport', 'Free cancellation up to 5 days before check-in. 50% cancellation fee between 2-5 days.', 4.7, 'ACTIVE'),

(3, 3, 'Kashmir Paradise', 'Experience the breathtaking beauty of Kashmir with snow-capped mountains, pristine lakes, and lush valleys. A perfect blend of adventure and relaxation.', 6, 5, 34999.00, 10, 'Adventure', 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80', '5 Nights accommodation (4N Hotel + 1N Luxury Dal Lake Houseboat), Daily Breakfast & Dinner, 1-Hour complimentary Shikara ride on Dal Lake, All sightseeing transfers by private luxury cab, Driver allowances and toll taxes', 'Airfare/Train tickets, Gondola cable car tickets in Gulmarg, Pony/Horse rides in Pahalgam, Lunches and personal expenses', 'Day 1: Arrival at Srinagar Airport, transfer to Deluxe Houseboat on Dal Lake, evening Shikara ride\nDay 2: Srinagar to Gulmarg day excursion, experience Apharwat peak snow & Gondola ride\nDay 3: Srinagar to Pahalgam Valley of Shepherds via saffron fields & Avantipur ruins\nDay 4: Pahalgam leisure & Betab Valley / Aru Valley exploration\nDay 5: Pahalgam to Srinagar, visit Nishat Bagh, Shalimar Bagh & Shankaracharya Temple\nDay 6: Check-out and transfer to Srinagar Airport with unforgettable memories', 'Cancel up to 10 days before travel for a 90% refund. 50% refund up to 4 days prior. Non-refundable within 4 days.', 4.9, 'ACTIVE'),

(4, 5, 'Rajasthan Royal Tour', 'Immerse yourself in royal Rajputana heritage across the Pink City Jaipur, the City of Lakes Udaipur, and historic desert fortresses.', 5, 4, 28999.00, 15, 'Culture', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80', 'Heritage hotel stays with royal welcome, Daily breakfast & traditional Rajasthani dinner, Elephant/Jeep ride at Amer Fort, Lake Pichola boat ride in Udaipur, Chokhi Dhani cultural evening pass', 'Flight/Train tickets, Monument camera fees, Lunch and tips, Personal shopping', 'Day 1: Arrival in Jaipur, transfer to hotel, evening visit to Chokhi Dhani\nDay 2: Amer Fort, Hawa Mahal, City Palace, and Jantar Mantar\nDay 3: Jaipur to Udaipur via Chittorgarh Fort\nDay 4: City Palace Udaipur, Saheliyon Ki Bari, and sunset boat ride on Lake Pichola\nDay 5: Morning leisure in Udaipur, transfer to airport/railway station', 'Full refund up to 7 days before trip start date. 30% retention fee if cancelled 3-6 days before travel.', 4.8, 'ACTIVE'),

(5, 4, 'Manali Adventure', 'Get your adrenaline pumping in the high mountains of Himachal. Experience Solang valley paragliding, Rohtang snowy pass, and serene Old Manali vibes.', 5, 4, 26999.00, 12, 'Adventure', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', '4-Star mountain view resort stay, Breakfast and dinner buffet, Solang Valley adventure tour, Rohtang Pass green permit vehicle, Bonfire with light music', 'Paragliding & zip-line tickets, Warm clothing rentals, Personal porter and tips, Lunch meals', 'Day 1: Arrival in Manali, check-in to resort, stroll around Mall Road & Hadimba Temple\nDay 2: Solang Valley adventure activities and ropeway ride\nDay 3: Rohtang Pass / Atal Tunnel snowy heights excursion\nDay 4: Old Manali cafes, Vashisht hot water springs & Jogini waterfall trek\nDay 5: Morning breakfast, checkout and departure transfer', 'Standard 7-day cancellation window applies with 100% refund minus payment gateway fee.', 4.6, 'ACTIVE'),

(6, 6, 'Andaman Island Odyssey', 'Explore Havelock island beaches, turquoise coral lagoons, Radhanagar sunset, scuba diving, and the light & sound show at Cellular Jail.', 6, 5, 39999.00, 10, 'Adventure', 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80', 'Beachfront resort stays in Port Blair & Havelock, Daily breakfast, Makruzz luxury catamaran ferry transfers, Snorkeling equipment session at Elephant Beach, Cellular Jail tickets & guide', 'Scuba diving certification/fun dive, Sea walk fees, Lunches and dinners, Flights to Port Blair', 'Day 1: Arrival in Port Blair, Cellular Jail visit & evening Light and Sound show\nDay 2: Ferry to Havelock Island, relax at world-famous Radhanagar Beach (Asia''s 7th best beach)\nDay 3: Elephant Beach water sports and snorkeling in coral gardens\nDay 4: Ferry to Neil Island, Natural Rock formation and Bharatpur beach\nDay 5: Return to Port Blair, shopping at Sagarika Emporium, Chidiyatapu sunset\nDay 6: Airport drop with tropical memories', 'Cancellation eligible up to 14 days prior with 85% refund. 50% refund within 7-13 days.', 4.9, 'ACTIVE'),

(7, 7, 'Hyderabad Heritage Trail', 'Discover royal Nizami architecture at Golconda Fort, the iconic Charminar, Salar Jung Museum treasures, and savor authentic World-famous Hyderabadi Dum Biryani.', 3, 2, 14999.00, 16, 'Heritage', 'https://images.unsplash.com/photo-1605469237567-a39930679526?auto=format&fit=crop&w=1200&q=80', 'Central 4-Star luxury hotel stay, Breakfast included, AC private vehicle for all 3 days, Guided tour of Golconda Fort with Sound & Light show, Charminar & Laad Bazaar guided walk', 'Lunches & dinners, Monument entrance fees, Personal shopping (Pearls, Bangles)', 'Day 1: Arrival, check-in, visit Birla Mandir and Hussain Sagar Lake Buddha statue boat ride\nDay 2: Golconda Fort, Qutb Shahi Tombs, Charminar, Mecca Masjid, and evening shopping\nDay 3: Salar Jung Museum, Chowmahalla Palace, check-out and airport drop', 'Free cancellation up to 48 hours before scheduled arrival date.', 4.5, 'ACTIVE'),

(8, 8, 'Tamil Nadu Temple & Nilgiri Tour', 'Witness ancient Dravidian architecture at Meenakshi Amman Temple, Mahabalipuram shore monoliths, and the cool eucalyptus air of Ooty hills.', 6, 5, 29999.00, 14, 'Pilgrimage', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', 'Star hotel stays in Chennai, Madurai and Ooty, Daily breakfast, Nilgiri Toy Train tickets, Shore Temple and Pancha Rathas entry, Private AC vehicle throughout', 'Airfare/Train to Chennai, Camera fees, Special pooja charges, Lunches and dinners', 'Day 1: Chennai to Mahabalipuram, UNESCO monuments tour\nDay 2: Travel to Madurai, visit the breathtaking Meenakshi Amman temple\nDay 3: Travel to Ooty queen of hill stations via scenic Ghat roads\nDay 4: Botanical Gardens, Ooty Lake, and Doddabetta Peak\nDay 5: Coonoor sightseeing, Nilgiri tea factory and Sim''s Park\nDay 6: Check-out and drop at Coimbatore Airport', 'Free cancellation up to 5 days prior to journey commencement.', 4.7, 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. PACKAGE GALLERY IMAGES
INSERT INTO package_images (package_id, image_url, display_order) VALUES
(3, 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80', 1),
(3, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80', 2),
(3, 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=800&q=80', 3),
(3, 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80', 4),
(1, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', 1),
(1, 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80', 2),
(2, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', 1),
(2, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 2),
(4, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', 1),
(4, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', 2),
(5, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', 1),
(6, 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80', 1);

-- 5. REALISTIC BOOKINGS
-- Matching UI Reference: TGK-2025-0315-7829 (Kashmir Paradise, 15 Mar 2025, 2 travellers, 73,497 total)
INSERT INTO bookings (id, booking_reference, user_id, package_id, travel_date, travellers, contact_name, contact_email, contact_phone, special_requests, price_per_person, subtotal, tax_amount, total_amount, status) VALUES
(1, 'TGK-2025-0315-7829', 2, 3, '2025-03-15', 2, 'John Doe', 'john@example.com', '9876543210', 'Lake-facing houseboat preference', 34999.00, 69998.00, 3499.00, 73497.00, 'CONFIRMED'),
(2, 'TGK-2025-0420-9182', 3, 2, '2025-04-20', 4, 'Priya Sharma', 'priya@example.com', '9812345678', 'Vegetarian food on the cruise', 18999.00, 75996.00, 3799.80, 79795.80, 'PENDING'),
(3, 'TGK-2025-0510-4412', 4, 4, '2025-05-10', 2, 'Rahul Verma', 'rahul@example.com', '9898989898', 'Early morning pick-up request', 28999.00, 57998.00, 2899.90, 60897.90, 'CONFIRMED')
ON DUPLICATE KEY UPDATE booking_reference=VALUES(booking_reference);

-- 6. PAYMENTS
INSERT INTO payments (id, booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, status, payment_method, paid_at) VALUES
(1, 1, 'order_P9182371k2h198', 'pay_P9182381273912', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 73497.00, 'INR', 'SUCCESS', 'UPI', '2025-03-01 14:32:10'),
(3, 3, 'order_P9182371k2h441', 'pay_P9182381273944', 'a2b1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852a112', 60897.90, 'INR', 'SUCCESS', 'Netbanking', '2025-03-05 11:20:00')
ON DUPLICATE KEY UPDATE razorpay_order_id=VALUES(razorpay_order_id);

-- 7. REVIEWS (Rating 1-5, status APPROVED)
INSERT INTO reviews (id, user_id, package_id, rating, comment, status) VALUES
(1, 2, 3, 5, 'Breathtaking experience! The Dal lake shikara ride and Gulmarg snow were unforgettable. The guide was exceptionally knowledgeable.', 'APPROVED'),
(2, 3, 2, 5, 'Loved the sunset cruise and our resort right next to Baga beach. The itinerary was very relaxing.', 'APPROVED'),
(3, 4, 1, 5, 'The Alleppey houseboat experience was top-notch with authentic Kerala karimeen and coconut water. Highly recommended!', 'APPROVED'),
(4, 2, 4, 4, 'Jaipur and Udaipur are magnificent. Amer fort and Lake Pichola were highlights of the trip.', 'APPROVED'),
(5, 3, 5, 5, 'Rohtang Pass views were beyond magical! Solang valley paragliding was thrilling.', 'APPROVED')
ON DUPLICATE KEY UPDATE comment=VALUES(comment);

-- 8. WISHLIST
INSERT INTO wishlist (id, user_id, package_id) VALUES
(1, 2, 1),
(2, 2, 2),
(3, 2, 5)
ON DUPLICATE KEY UPDATE package_id=VALUES(package_id);
