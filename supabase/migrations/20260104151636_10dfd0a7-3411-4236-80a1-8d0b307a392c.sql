-- Create table for confirmed payments
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  email TEXT,
  customer_name TEXT,
  product_name TEXT,
  amount DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'approved',
  kiwify_order_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast phone lookup
CREATE INDEX idx_payments_phone ON public.payments(phone_number);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow public read access for checking payment status (by phone number)
CREATE POLICY "Anyone can check payment status by phone"
ON public.payments
FOR SELECT
USING (true);

-- Allow insert from service role only (edge functions)
CREATE POLICY "Service role can insert payments"
ON public.payments
FOR INSERT
WITH CHECK (true);