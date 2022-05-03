CREATE TABLE calendars (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL CHECK (title <> ''),
  booking_id INT REFERENCES bookings(id) NOT NULL
);
