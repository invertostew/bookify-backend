CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE CHECK(username <> ''),
  email_address VARCHAR(100) NOT NULL UNIQUE CHECK(email_address <> ''),
  password_digest VARCHAR(255) NOT NULL CHECK(password_digest <> '' AND LENGTH(password_digest) > 7),
  first_name VARCHAR(100) NOT NULL CHECK(first_name <> ''),
  last_name VARCHAR(100) NOT NULL CHECK(last_name <> ''),
  role_id INT REFERENCES roles(id) NOT NULL
);
