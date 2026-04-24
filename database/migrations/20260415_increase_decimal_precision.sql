-- =============================================================
-- Migration: Increase monthly_payment and remaining_balance precision
-- Purpose: Fix "Out of range value" errors for large loan amounts
-- Created: 2026-04-15
-- =============================================================

-- Alter the loan_customer table to increase decimal precision
ALTER TABLE loan_customer
MODIFY COLUMN monthly_payment DECIMAL(12,2),
MODIFY COLUMN remaining_balance DECIMAL(12,2);

-- Verification query to check column definitions
-- SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME = 'loan_customer' 
-- AND COLUMN_NAME IN ('monthly_payment', 'remaining_balance', 'loan_amount');
