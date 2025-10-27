import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

// Helper function to determine from email
function getFromEmail() {
  const domain = Deno.env.get('RESEND_DOMAIN');
  console.log('RESEND_DOMAIN:', domain ? 'SET' : 'NOT SET');
  if (domain) {
    return `send@${domain}`;
  }
  return 'onboarding@resend.dev'; // Default fallback
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('=== E-Mail Debug Service Start ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    
    const requestData = await req.json();
    console.log('Request data received:', Object.keys(requestData));
    
    const { name, email, phone, address, bestellung, gesamtpreis, nachricht } = requestData;

    // Validate required fields
    if (!name || !email || !bestellung || !gesamtpreis) {
      console.log('Validation failed - missing fields');
      return new Response(
        JSON.stringify({ error: 'Fehlende Pflichtfelder' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Validation passed');

    // Get Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('RESEND_API_KEY:', resendApiKey ? `SET (${resendApiKey.substring(0, 10)}...)` : 'NOT SET');
    
    if (!resendApiKey) {
      console.log('ERROR: RESEND_API_KEY not found');
      return new Response(
        JSON.stringify({ 
          error: 'E-Mail-Service nicht konfiguriert',
          details: 'RESEND_API_KEY fehlt in Supabase Secrets'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order list for email
    const bestellungsListe = bestellung.map((item: any) => 
      `${item.menge}x ${item.produkt} à ${item.preis.toFixed(2)}€ = ${(item.menge * item.preis).toFixed(2)}€`
    ).join('\n');

    const emailSubject = `Neue Wildfleisch-Bestellung von ${name}`;
    const fromEmail = getFromEmail();
    const toEmail = 'info@jagd-weetzen.de';
    
    console.log('Email details:');
    console.log('From:', fromEmail);
    console.log('To:', toEmail);
    console.log('Subject:', emailSubject);

    const emailBody = `
<h2>Neue Wildfleisch-Bestellung</h2>

<h3>Kundendaten:</h3>
<p><strong>Name:</strong> ${name}<br>
<strong>E-Mail:</strong> ${email}<br>
${phone ? `<strong>Telefon:</strong> ${phone}<br>` : ''}
${address ? `<strong>Adresse:</strong> ${address}<br>` : ''}</p>

<h3>Bestellung:</h3>
<pre>${bestellungsListe}</pre>

<h3>Gesamtpreis: ${gesamtpreis}€</h3>

${nachricht ? `<h3>Nachricht:</h3><p>${nachricht}</p>` : ''}

<hr>
<p><small>Diese Bestellung wurde über die Website von Jagd Weetzen eingereicht.<br>
Zeitpunkt: ${new Date().toLocaleString('de-DE')}</small></p>
    `;

    // Store order in database first
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET');
    console.log('Service Key:', supabaseServiceKey ? 'SET' : 'NOT SET');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert order into database
    console.log('Inserting order into database...');
    const { data: orderData, error: orderError } = await supabase
      .from('wildfleisch_bestellungen_2025_10_24_08_03')
      .insert({
        kunde_name: name,
        kunde_email: email,
        kunde_telefon: phone,
        kunde_adresse: address,
        bestellung_json: bestellung,
        gesamtpreis: parseFloat(gesamtpreis),
        nachricht: nachricht,
        status: 'neu',
        erstellt_am: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      return new Response(
        JSON.stringify({ 
          error: 'Fehler beim Speichern der Bestellung',
          details: orderError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order saved to database with ID:', orderData?.id);

    // Prepare Resend API call
    const emailPayload = {
      from: fromEmail,
      to: [toEmail],
      subject: emailSubject,
      html: emailBody,
      text: emailBody.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    console.log('Sending email via Resend API...');
    console.log('Payload:', JSON.stringify(emailPayload, null, 2));

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
    console.log('Resend API response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Resend API response body:', responseText);

    if (!response.ok) {
      console.error('Resend API error:', response.status, responseText);
      
      // Even if email fails, order is saved
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Bestellung gespeichert (E-Mail-Problem)',
          order_id: orderData?.id,
          warning: 'E-Mail konnte nicht versendet werden, aber Bestellung ist gespeichert',
          debug: {
            status: response.status,
            response: responseText,
            from: fromEmail,
            to: toEmail,
            api_key_prefix: resendApiKey.substring(0, 10)
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = { raw_response: responseText };
    }
    
    console.log('Email sent successfully:', result);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Bestellung erfolgreich eingegangen und E-Mail versendet',
        order_id: orderData?.id,
        email_id: result.id,
        debug: {
          from: fromEmail,
          to: toEmail,
          resend_response: result
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Fehler beim Verarbeiten der Bestellung',
        details: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});