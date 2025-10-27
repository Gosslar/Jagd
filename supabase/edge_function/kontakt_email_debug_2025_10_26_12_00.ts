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
    console.log('=== Kontakt E-Mail Service Debug ===');
    
    const requestData = await req.json();
    console.log('Request data:', JSON.stringify(requestData, null, 2));
    
    const { name, email, phone, subject, message } = requestData;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Validation failed - missing fields');
      return new Response(
        JSON.stringify({ 
          error: 'Fehlende Pflichtfelder',
          missing: {
            name: !name,
            email: !email,
            subject: !subject,
            message: !message
          }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get and validate Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log('Resend API Key exists:', !!resendApiKey);
    console.log('Resend API Key length:', resendApiKey?.length || 0);
    
    if (!resendApiKey) {
      console.log('ERROR: RESEND_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ 
          error: 'E-Mail-Service nicht konfiguriert',
          details: 'RESEND_API_KEY fehlt in Supabase Secrets'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare email content
    const fromEmail = getFromEmail();
    const emailSubject = `Kontaktanfrage: ${subject}`;
    const emailBody = `
      <h2>Neue Kontaktanfrage von der Jagdrevier Website</h2>
      
      <h3>Kontaktdaten:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>E-Mail:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</p>
      
      <h3>Betreff:</h3>
      <p>${subject}</p>
      
      <h3>Nachricht:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><small>Diese E-Mail wurde über das Kontaktformular der Jagdrevier Weetzen Website gesendet.</small></p>
    `;

    console.log('Email details:');
    console.log('From:', fromEmail);
    console.log('To: jagd@soliso.de');
    console.log('Subject:', emailSubject);

    // Prepare Resend API request
    const resendPayload = {
      from: fromEmail,
      to: ['jagd@soliso.de'],
      subject: emailSubject,
      html: emailBody,
      text: emailBody.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    console.log('Resend payload:', JSON.stringify(resendPayload, null, 2));

    // Send email via Resend API
    console.log('Sending email via Resend API...');
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resendPayload)
    });

    console.log('Resend API response status:', resendResponse.status);
    console.log('Resend API response headers:', Object.fromEntries(resendResponse.headers.entries()));

    const resendResult = await resendResponse.text();
    console.log('Resend API response body:', resendResult);

    if (!resendResponse.ok) {
      console.log('ERROR: Resend API returned non-2xx status');
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(resendResult);
      } catch {
        errorDetails = { message: resendResult };
      }

      return new Response(
        JSON.stringify({ 
          error: 'E-Mail-Versand fehlgeschlagen',
          details: `Resend API Fehler (${resendResponse.status}): ${errorDetails.message || resendResult}`,
          resend_status: resendResponse.status,
          resend_response: errorDetails
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(resendResult);
    } catch {
      parsedResult = { raw: resendResult };
    }

    console.log('SUCCESS: Email sent successfully');
    console.log('Resend result:', parsedResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'E-Mail erfolgreich gesendet',
        email_id: parsedResult.id,
        from: fromEmail,
        to: 'jagd@soliso.de'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('FATAL ERROR in contact email function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Unerwarteter Fehler',
        details: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});