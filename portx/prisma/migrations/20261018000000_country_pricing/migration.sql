-- Country pricing: amounts can have decimals ($4.99), and each payment records its currency.
-- Existing rows are rupees, so they get INR. Int -> Decimal is a safe widening cast.
ALTER TABLE "payment_requests" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);
ALTER TABLE "payment_requests" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'INR';
