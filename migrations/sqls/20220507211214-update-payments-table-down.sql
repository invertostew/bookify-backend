ALTER TABLE payments
DROP COLUMN stripe_reference,
DROP COLUMN total,
DROP COLUMN payment_status;
