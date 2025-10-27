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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('=== Wildfleisch Bestellung E-Mail Service ===');
    
    const requestData = await req.json();
    const { name, email, phone, address, bestellung, gesamtpreis, nachricht } = requestData;

    // Validate required fields
    if (!name || !email || !bestellung || !gesamtpreis) {
      return new Response(
        JSON.stringify({ error: 'Fehlende Pflichtfelder' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert order into database
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

    console.log('Order saved to database:', orderData?.id);

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getFromEmail(),
        to: ['info@jagd-weetzen.de'], // Ihre E-Mail-Adresse
        subject: emailSubject,
        html: emailBody,
        text: emailBody.replace(/<[^>]*>/g, '') // Strip HTML for text version
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      
      // Even if email fails, order is saved
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Bestellung gespeichert (E-Mail-Problem)',
          order_id: orderData?.id,
          warning: 'E-Mail konnte nicht versendet werden, aber Bestellung ist gespeichert'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('Email sent successfully:', result.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Bestellung erfolgreich eingegangen und E-Mail versendet',
        order_id: orderData?.id,
        email_id: result.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Fehler beim Verarbeiten der Bestellung',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});