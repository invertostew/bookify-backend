CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  booking TIMESTAMP NOT NULL,
  user_id INT REFERENCES users(id) NOT NULL,
  service_id INT REFERENCES services(id) NOT NULL
);
