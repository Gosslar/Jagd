import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

// Helper function to determine from email
function getFromEmail() {
  const domain = Deno.env.get('RESEND_DOMAIN');
  if (domain) {
    return `send@${domain}`;
  }
  return 'onboarding@resend.dev'; // Default fallback
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Processing wildfleisch order request...');
    
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Ungültiges JSON-Format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { 
      name, 
      email, 
      phone, 
      address,
      bestellung,
      gesamtpreis,
      nachricht 
    } = requestData;

    console.log('Request data received:', { name, email, bestellungCount: bestellung?.length, gesamtpreis });

    // Validate required fields
    if (!name || !email || !bestellung || !gesamtpreis) {
      console.error('Missing required fields:', { name: !!name, email: !!email, bestellung: !!bestellung, gesamtpreis: !!gesamtpreis });
      return new Response(
        JSON.stringify({ error: 'Fehlende Pflichtfelder: Name, E-Mail, Bestellung und Gesamtpreis sind erforderlich' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate bestellung array
    if (!Array.isArray(bestellung) || bestellung.length === 0) {
      console.error('Invalid bestellung array:', bestellung);
      return new Response(
        JSON.stringify({ error: 'Bestellung muss ein Array mit mindestens einem Artikel sein' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check for Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'E-Mail-Service nicht konfiguriert - API-Schlüssel fehlt' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('API key found, preparing email...');

    // Create email content
    const bestellungsListe = bestellung.map((item: any) => {
      const itemTotal = (item.menge * parseFloat(item.preis)).toFixed(2);
      return `${item.menge}x ${item.produkt} à ${item.preis}€ = ${itemTotal}€`;
    }).join('\n');

    const fromEmail = getFromEmail();
    const emailSubject = `Neue Wildfleisch-Bestellung von ${name}`;
    const emailBody = `
      <h2>Neue Wildfleisch-Bestellung</h2>
      
      <h3>Kundendaten:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>E-Mail:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
      ${address ? `<p><strong>Adresse:</strong> ${address}</p>` : ''}
      
      <h3>Bestellung:</h3>
      <pre>${bestellungsListe}</pre>
      
      <p><strong>Gesamtpreis:</strong> ${gesamtpreis}€</p>
      
      ${nachricht ? `<h3>Nachricht:</h3><p>${nachricht}</p>` : ''}
      
      <hr>
      <p><em>Diese Bestellung wurde über die Website von Jagd Weetzen eingereicht.</em></p>
    `;

    const emailPayload = {
      from: fromEmail,
      to: 'info@jagd-weetzen.de',
      subject: emailSubject,
      html: emailBody,
      text: emailBody.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    console.log('Sending email with payload:', { 
      from: fromEmail, 
      to: 'info@jagd-weetzen.de', 
      subject: emailSubject 
    });

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload)
    });

    console.log('Resend API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      // Try to parse error response
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.message || errorJson.error || errorText;
      } catch (e) {
        // Keep original error text if not JSON
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'E-Mail konnte nicht gesendet werden',
          details: `Resend API Fehler (${response.status}): ${errorDetails}`,
          debug: {
            status: response.status,
            statusText: response.statusText,
            fromEmail: fromEmail,
            hasApiKey: !!resendApiKey
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await response.json();
    console.log('Email sent successfully:', result.id);

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
    console.error('Unexpected error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Unerwarteter Fehler beim Senden der Bestellung',
        details: error.message,
        type: error.name || 'UnknownError'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});