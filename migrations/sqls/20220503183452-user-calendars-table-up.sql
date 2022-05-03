CREATE TABLE user_calendars (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) NOT NULL,
  calendar_id INT REFERENCES calendars(id) NOT NULL
);
