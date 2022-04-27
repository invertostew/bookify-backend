CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL CHECK(title <> ''),
  description TEXT,
  duration INT NOT NULL CHECK(duration > 0),
  price BIGINT NOT NULL CHECK(price > 0)
);
