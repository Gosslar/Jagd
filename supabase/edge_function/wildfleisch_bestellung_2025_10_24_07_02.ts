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
    const { 
      name, 
      email, 
      phone, 
      address,
      bestellung,
      gesamtpreis,
      nachricht 
    } = await req.json();

    // Validate required fields
    if (!name || !email || !bestellung || !gesamtpreis) {
      return new Response(
        JSON.stringify({ error: 'Fehlende Pflichtfelder' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'E-Mail-Service nicht konfiguriert' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create email content
    const bestellungsListe = bestellung.map((item: any) => 
      `${item.menge}x ${item.produkt} à ${item.preis}€ = ${(item.menge * parseFloat(item.preis)).toFixed(2)}€`
    ).join('\n');

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
      <p><em>Diese Bestellung wurde über die Website des Jagdreviers Waldfrieden eingereicht.</em></p>
    `;

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getFromEmail(),
        to: 'info@jagd-weetzen.de',
        subject: emailSubject,
        html: emailBody,
        text: emailBody.replace(/<[^>]*>/g, '') // Strip HTML for text version
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      throw new Error(`Resend API error: ${response.status} ${response.statusText}`);
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
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Fehler beim Senden der Bestellung',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});