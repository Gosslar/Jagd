import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('=== RESEND API TEST START ===');
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('API Key check:', {
      exists: !!resendApiKey,
      length: resendApiKey?.length || 0,
      prefix: resendApiKey?.substring(0, 10) || 'none'
    });

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'RESEND_API_KEY nicht in Umgebungsvariablen gefunden',
          available_vars: Object.keys(Deno.env.toObject()).filter(key => key.includes('RESEND'))
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Test 1: Einfachste E-Mail mit onboarding@resend.dev
    console.log('Test 1: Sending simple test email...');
    
    const testEmail = {
      from: 'onboarding@resend.dev',
      to: 'test@example.com', // Dummy-Adresse für Test
      subject: 'Resend API Test',
      html: '<p>Dies ist ein Test der Resend API</p>'
    };

    console.log('Sending to Resend API:', testEmail);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmail)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      console.error('API call failed');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Resend API Test fehlgeschlagen',
          status: response.status,
          statusText: response.statusText,
          response: responseData,
          debug: {
            hasApiKey: !!resendApiKey,
            apiKeyLength: resendApiKey?.length,
            apiKeyStart: resendApiKey?.substring(0, 8) + '...',
            url: 'https://api.resend.com/emails'
          }
        }),
        { 
          status: 200, // Return 200 so we can see the error details
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('=== RESEND API TEST SUCCESS ===');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Resend API funktioniert korrekt',
        response: responseData,
        debug: {
          hasApiKey: true,
          apiKeyLength: resendApiKey?.length,
          status: response.status
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unerwarteter Fehler beim Testen der Resend API',
        details: error.message,
        stack: error.stack
      }),
      { 
        status: 200, // Return 200 so we can see the error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});