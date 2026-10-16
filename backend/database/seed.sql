-- Seed Data for Store Rating Platform (PostgreSQL)
-- All passwords are 'Admin@1234', 'Owner@1234', or 'User@1234' (hashed with bcrypt)

-- 1. Insert Users (Names strictly between 20 and 60 chars)
INSERT INTO users (name, email, password, address, role) VALUES
('System Administrator Master User', 'admin@example.com', '$2a$10$wT4c1O850w.W/Z29vLqFv.0FqB/z1nfg9gWc7Hk5486R1Q6F5i7k.', '742 Evergreen Terrace, Sector 5, Springfield', 'admin'),
('Store Owner Alexander Hamilton', 'owner@example.com', '$2a$10$2l1Z3m7F8bV6O2sDkP3ZDe/cK4p5l4A4eE.y1.bFfT6G5N3L1v8G.', '10 Downing Street, Commercial Hub, London', 'store_owner'),
('First Registered Normal Customer', 'user1@example.com', '$2a$10$B5V2h4R6sP8L9mK1j3T7de.5gG8hH2kK9lM0nN1pQ3rS5tU7vW9x.', '221B Baker Street, Marylebone, London', 'user'),
('Second Registered Regular Client', 'user2@example.com', '$2a$10$B5V2h4R6sP8L9mK1j3T7de.5gG8hH2kK9lM0nN1pQ3rS5tU7vW9x.', '404 Elm Street, Downtown District, Metropolis', 'user')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Stores
INSERT INTO stores (name, email, address, owner_id) VALUES
('Downtown Tech Gadgets & Accessories', 'contact@downtowntech.com', '123 Innovation Boulevard, Suite 400, Metro City', 2),
('Artisan Coffee Roasters & Bakery', 'hello@artisancoffee.com', '456 Heritage Lane, Old Town Square, Metro City', NULL),
('Green Leaf Organic Grocery Mart', 'support@greenleafmart.com', '789 Evergreen Terrace, Greenfield District, Metro City', NULL),
('Summit Sports & Outdoor Equipments', 'sales@summitsports.com', '101 Mountain View Road, Alpine Ridge, Metro City', NULL)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Ratings
INSERT INTO ratings (rating, user_id, store_id) VALUES
(5, 3, 1),
(4, 4, 1),
(4, 3, 2),
(5, 4, 2),
(3, 3, 3)
ON CONFLICT (user_id, store_id) DO NOTHING;
