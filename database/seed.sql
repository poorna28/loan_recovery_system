INSERT INTO users (name, email, password, role)
VALUES
  ('Admin User', 'admin@example.com', 'hashed_admin_password', 'admin');

INSERT INTO customers (name, email, phone, address)
VALUES
  ('John Doe', 'john@example.com', '1234567890', '123 Main Street');

INSERT INTO loans (customer_id, amount, interest_rate, tenure_months, start_date, status)
VALUES
  (1, 100000, 12.5, 24, '2024-01-15', 'approved');
