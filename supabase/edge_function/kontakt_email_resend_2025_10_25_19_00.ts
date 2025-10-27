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
    console.log('=== Kontaktformular E-Mail Service ===');
    
    const requestData = await req.json();
    const { name, email, phone, subject, message } = requestData;

    // Validate required fields
    if (!name || !email || !subject || !message) {
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

    const emailSubject = `Kontaktanfrage: ${subject}`;
    const emailBody = `
<h2>Neue Kontaktanfrage von der Website</h2>

<h3>Kontaktdaten:</h3>
<p><strong>Name:</strong> ${name}<br>
<strong>E-Mail:</strong> ${email}<br>
${phone ? `<strong>Telefon:</strong> ${phone}<br>` : ''}</p>

<h3>Betreff:</h3>
<p>${subject}</p>

<h3>Nachricht:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>

<hr>
<p><small>Diese Nachricht wurde über das Kontaktformular der Website von Jagd Weetzen gesendet.<br>
Zeitpunkt: ${new Date().toLocaleString('de-DE')}</small></p>
    `;

    // Store contact request in database
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert contact request into database
    const { data: contactData, error: contactError } = await supabase
      .from('kontaktanfragen_2025_10_23_06_04')
      .insert({
        name: name,
        email: email,
        telefon: phone,
        betreff: subject,
        nachricht: message,
        status: 'neu',
        erstellt_am: new Date().toISOString()
      })
      .select()
      .single();

    if (contactError) {
      console.error('Database error:', contactError);
      return new Response(
        JSON.stringify({ 
          error: 'Fehler beim Speichern der Kontaktanfrage',
          details: contactError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Contact request saved to database:', contactData?.id);

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
        reply_to: email, // Antwort geht an den Absender
        subject: emailSubject,
        html: emailBody,
        text: emailBody.replace(/<[^>]*>/g, '') // Strip HTML for text version
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      
      // Even if email fails, contact request is saved
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Kontaktanfrage gespeichert (E-Mail-Problem)',
          contact_id: contactData?.id,
          warning: 'E-Mail konnte nicht versendet werden, aber Anfrage ist gespeichert'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('Email sent successfully:', result.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Kontaktanfrage erfolgreich gesendet',
        contact_id: contactData?.id,
        email_id: result.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Fehler beim Verarbeiten der Kontaktanfrage',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});