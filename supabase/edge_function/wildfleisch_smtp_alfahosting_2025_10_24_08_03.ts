import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

// SMTP Configuration for Alfahosting
const SMTP_CONFIG = {
  hostname: 'smtp.alfahosting.de',
  port: 587, // STARTTLS Port
  // Alternative: Port 465 für SSL
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('=== Alfahosting SMTP Mail Start ===');
    
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
      return new Response(
        JSON.stringify({ error: 'Fehlende Pflichtfelder' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get SMTP credentials from environment
    const smtpUser = Deno.env.get('SMTP_USER'); // z.B. info@jagd-weetzen.de
    const smtpPass = Deno.env.get('SMTP_PASS'); // Ihr E-Mail-Passwort
    
    console.log('SMTP Config:', {
      hasUser: !!smtpUser,
      hasPass: !!smtpPass,
      user: smtpUser ? smtpUser.substring(0, 5) + '...' : 'none'
    });

    if (!smtpUser || !smtpPass) {
      return new Response(
        JSON.stringify({ 
          error: 'SMTP-Konfiguration fehlt',
          details: 'SMTP_USER und SMTP_PASS müssen in Supabase Secrets gesetzt werden'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create email content
    const bestellungsText = bestellung.map((item: any) => 
      `${item.menge}x ${item.produkt} à ${item.preis}€ = ${(item.menge * parseFloat(item.preis)).toFixed(2)}€`
    ).join('\n');

    const emailSubject = `Neue Wildfleisch-Bestellung von ${name}`;
    const emailBody = `Neue Wildfleisch-Bestellung

Kundendaten:
Name: ${name}
E-Mail: ${email}
${phone ? `Telefon: ${phone}` : ''}
${address ? `Adresse: ${address}` : ''}

Bestellung:
${bestellungsText}

Gesamtpreis: ${gesamtpreis}€

${nachricht ? `Nachricht: ${nachricht}` : ''}

---
Diese Bestellung wurde über die Website von Jagd Weetzen eingereicht.`;

    // Create email message in RFC 2822 format
    const emailMessage = [
      `From: ${smtpUser}`,
      `To: ${smtpUser}`, // Send to yourself
      `Subject: ${emailSubject}`,
      `Date: ${new Date().toUTCString()}`,
      `Content-Type: text/plain; charset=utf-8`,
      '',
      emailBody
    ].join('\r\n');

    console.log('Connecting to SMTP server...');

    // Use nodemailer-like approach with fetch to a mail service
    // Since Deno doesn't have native SMTP, we'll use a simple HTTP-to-SMTP bridge
    
    // Alternative: Use a simple mail API that works with your SMTP
    const mailData = {
      smtp_server: SMTP_CONFIG.hostname,
      smtp_port: SMTP_CONFIG.port,
      smtp_user: smtpUser,
      smtp_pass: smtpPass,
      from: smtpUser,
      to: smtpUser,
      subject: emailSubject,
      body: emailBody,
      content_type: 'text/plain'
    };

    console.log('Mail data prepared:', {
      smtp_server: mailData.smtp_server,
      smtp_port: mailData.smtp_port,
      from: mailData.from,
      to: mailData.to,
      subject: mailData.subject
    });

    // Since Deno Edge Functions don't support direct SMTP, 
    // we'll use a workaround with a mail service API
    // For now, let's create a simple solution using fetch to a mail gateway

    // Alternative approach: Use your hosting provider's mail API if available
    // Or use a simple mail-sending service that accepts SMTP credentials

    // For Alfahosting, we can try using their webmail API or create a simple PHP script
    // that handles the SMTP connection on your server

    // Temporary solution: Log the email and return success
    // You can later implement the actual SMTP connection
    
    console.log('Email would be sent:', {
      from: smtpUser,
      to: smtpUser,
      subject: emailSubject,
      body: emailBody.substring(0, 100) + '...'
    });

    // For now, we'll simulate success and log the email
    // In production, you would implement actual SMTP sending here
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Bestellung erfolgreich verarbeitet (SMTP-Simulation)',
        debug: {
          smtp_server: SMTP_CONFIG.hostname,
          smtp_port: SMTP_CONFIG.port,
          from: smtpUser,
          to: smtpUser,
          subject: emailSubject
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('SMTP Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'SMTP-Fehler',
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