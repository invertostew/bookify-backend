ALTER TABLE bookings
ADD COLUMN payment_id INT REFERENCES payments(id) NOT NULL;
