INSERT INTO users (name, email, password)
VALUES ('albert', 'albert@g', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('bret', 'bret@', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('cian', 'cain@', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES ('Cozy Beach House', 'Beautiful beach house with stunning ocean views.', 'https://example.com/thumbnails/beach_house.jpg', 'https://example.com/covers/beach_house_cover.jpg', 150, 2, 2, 3, 'United States', '123 Beachfront Avenue', 'Miami', 'Florida', '33101', TRUE), ('Mountain Cabin Retreat', 'Rustic cabin nestled in the mountains, perfect for a getaway.', 'https://example.com/thumbnails/mountain_cabin.jpg', 'https://example.com/covers/mountain_cabin_cover.jpg', 100, 1, 1, 2, 'Canada', '456 Mountain View Road', 'Banff', 'Alberta', 'T1L 1J3', TRUE), ('City Center Loft', 'Modern loft apartment in the heart of downtown.', 'https://example.com/thumbnails/city_loft.jpg', 'https://example.com/covers/city_loft_cover.jpg', 200, 0, 1, 1, 'United Kingdom', '789 Urban Street', 'London', 'England', 'WC2N 5DU', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (rating, message)
VALUES (3, 'MESSAGE'), (4, 'mESsage'), (2, 'message');