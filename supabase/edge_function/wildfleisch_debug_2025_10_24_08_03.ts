import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('=== Wildfleisch Bestellung Debug Start ===');
    
    const requestData = await req.json();
    const { name, email, phone, address, bestellung, gesamtpreis, nachricht } = requestData;

    console.log('Request received:', { 
      name, 
      email, 
      bestellungItems: bestellung?.length,
      gesamtpreis 
    });

    // Validate required fields
    if (!name || !email || !bestellung || !gesamtpreis) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Fehlende Pflichtfelder' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('API Key status:', { hasKey: !!resendApiKey, keyLength: resendApiKey?.length });

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY nicht gefunden' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create simple email content
    const bestellungsText = bestellung.map((item: any) => 
      `${item.menge}x ${item.produkt} (${item.preis}€)`
    ).join(', ');

    const emailData = {
      from: 'onboarding@resend.dev',
      to: 'info@jagd-weetzen.de',
      subject: `Wildfleisch-Bestellung von ${name}`,
      html: `
        <h2>Neue Bestellung</h2>
        <p><strong>Kunde:</strong> ${name} (${email})</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
        ${address ? `<p><strong>Adresse:</strong> ${address}</p>` : ''}
        <p><strong>Bestellung:</strong> ${bestellungsText}</p>
        <p><strong>Gesamtpreis:</strong> ${gesamtpreis}€</p>
        ${nachricht ? `<p><strong>Nachricht:</strong> ${nachricht}</p>` : ''}
      `
    };

    console.log('Sending email to Resend API...');
    console.log('Email data:', { 
      from: emailData.from, 
      to: emailData.to, 
      subject: emailData.subject 
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    console.log('Resend response status:', response.status);
    console.log('Resend response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Resend response body:', responseText);

    if (!response.ok) {
      console.error('Resend API failed:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });

      return new Response(
        JSON.stringify({ 
          error: `Resend API Fehler: ${response.status}`,
          details: responseText,
          debug: {
            status: response.status,
            statusText: response.statusText,
            hasApiKey: !!resendApiKey,
            apiKeyPrefix: resendApiKey?.substring(0, 8) + '...'
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Resend response:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Unerwartete API-Antwort',
          details: responseText 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Email sent successfully:', result.id);
    console.log('=== Wildfleisch Bestellung Debug End ===');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Bestellung erfolgreich gesendet',
        message_id: result.id 
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
        error: 'Systemfehler',
        details: error.message,
        type: error.name
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});