ALTER TABLE services
ADD COLUMN calendar_id INT REFERENCES calendars(id) NOT NULL;
