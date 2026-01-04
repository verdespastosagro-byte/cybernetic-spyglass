import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    
    console.log('Kiwify webhook received:', JSON.stringify(payload, null, 2));

    // Kiwify webhook payload structure
    // Documentation: https://docs.kiwify.com.br/webhooks
    const {
      order_id,
      order_status,
      Customer,
      Product,
      Commissions
    } = payload;

    // Only process approved payments
    if (order_status !== 'paid' && order_status !== 'approved') {
      console.log('Order status not approved, skipping:', order_status);
      return new Response(
        JSON.stringify({ success: true, message: 'Status not applicable' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract customer phone - Kiwify sends it in different formats
    let phoneNumber = Customer?.mobile || Customer?.phone || '';
    
    // Clean up phone number - remove non-digits
    phoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Ensure it has country code
    if (phoneNumber.length === 11 && !phoneNumber.startsWith('55')) {
      phoneNumber = '55' + phoneNumber;
    }
    
    // Format as (XX) XXXXX-XXXX for storage
    if (phoneNumber.length >= 12) {
      const ddd = phoneNumber.slice(2, 4);
      const part1 = phoneNumber.slice(4, 9);
      const part2 = phoneNumber.slice(9, 13);
      phoneNumber = `(${ddd}) ${part1}-${part2}`;
    }

    console.log('Processed phone number:', phoneNumber);

    if (!phoneNumber) {
      console.error('No phone number found in webhook payload');
      return new Response(
        JSON.stringify({ success: false, error: 'No phone number in payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert payment record
    const { data, error } = await supabase
      .from('payments')
      .upsert({
        phone_number: phoneNumber,
        email: Customer?.email || null,
        customer_name: Customer?.full_name || Customer?.name || null,
        product_name: Product?.product_name || null,
        amount: Commissions?.product_base_price || null,
        status: 'approved',
        kiwify_order_id: order_id
      }, {
        onConflict: 'kiwify_order_id'
      });

    if (error) {
      console.error('Error inserting payment:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment recorded successfully for phone:', phoneNumber);

    return new Response(
      JSON.stringify({ success: true, message: 'Payment recorded' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error processing webhook:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
