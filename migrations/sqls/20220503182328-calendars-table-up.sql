CREATE TABLE calendars (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL CHECK (title <> ''),
  user_id INT REFERENCES users(id) NOT NULL
);
