ALTER TABLE payments
ADD COLUMN stripe_reference VARCHAR NOT NULL CHECK(stripe_reference <> ''),
ADD COLUMN total BIGINT NOT NULL CHECK(total > 0),
ADD COLUMN payment_status VARCHAR NOT NULL CHECK(payment_status <> '');
