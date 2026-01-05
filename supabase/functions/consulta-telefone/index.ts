import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { telefone } = await req.json();
    
    if (!telefone) {
      return new Response(
        JSON.stringify({ error: 'Telefone é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Remove non-numeric characters
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    const apiToken = Deno.env.get('WORKCONSULTORIA_API_TOKEN');
    
    if (!apiToken) {
      console.error('WORKCONSULTORIA_API_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Token de API não configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Consultando telefone: ${numeroLimpo}`);

    // Try different API endpoint patterns
    const endpoints = [
      `https://app.workconsultoria.com/api/tel/${numeroLimpo}`,
      `https://app.workconsultoria.com/api/consulta/tel/${numeroLimpo}`,
      `https://app.workconsultoria.com/api/consulta?tel=${numeroLimpo}`,
      `https://app.workconsultoria.com/integration/api/tel/${numeroLimpo}`,
    ];

    let lastError = null;
    let successData = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Tentando endpoint: ${endpoint}`);
        
        // Try with Bearer token
        let response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(`Resposta ${endpoint} (Bearer): ${response.status}`);

        // If Bearer doesn't work, try with query param
        if (!response.ok) {
          const endpointWithToken = endpoint.includes('?') 
            ? `${endpoint}&token=${apiToken}`
            : `${endpoint}?token=${apiToken}`;
          
          response = await fetch(endpointWithToken, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          console.log(`Resposta ${endpointWithToken} (query param): ${response.status}`);
        }

        if (response.ok) {
          const data = await response.json();
          console.log(`Sucesso! Dados recebidos:`, JSON.stringify(data).substring(0, 500));
          successData = data;
          break;
        } else {
          const errorText = await response.text();
          console.log(`Erro ${response.status}: ${errorText.substring(0, 200)}`);
          lastError = `${response.status}: ${errorText}`;
        }
      } catch (fetchError: unknown) {
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Erro desconhecido';
        console.error(`Erro ao acessar ${endpoint}:`, errorMessage);
        lastError = errorMessage;
      }
    }

    if (successData) {
      return new Response(
        JSON.stringify({ success: true, data: successData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no endpoint worked, return error with details
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Não foi possível consultar a API',
        details: lastError,
        message: 'Verifique se o formato do endpoint da API está correto'
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro na função:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
