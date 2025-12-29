import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { nume, email, telefon, subiect, mesaj } = await request.json();

    // Validare
    if (!nume || !email || !subiect || !mesaj) {
      return NextResponse.json(
        { error: 'Toate câmpurile marcate cu * sunt obligatorii' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresa de email nu este validă' },
        { status: 400 }
      );
    }

    // Configurare transporter SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    // Mapare subiect pentru email
    const subiecteMap: { [key: string]: string } = {
      comanda: 'Întrebare despre comandă',
      curier: 'Devin curier partener',
      suport: 'Suport tehnic',
      reclamatie: 'Reclamație',
      facturare: 'Facturare',
      altele: 'Altele',
    };

    const subiectText = subiecteMap[subiect] || subiect;

    // Template email pentru admin
    const htmlToAdmin = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mesaj nou din Contact Form</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin-top: 0;">Detalii mesaj:</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <p style="margin: 5px 0;"><strong>Nume:</strong> ${nume}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #f97316;">${email}</a></p>
            ${telefon ? `<p style="margin: 5px 0;"><strong>Telefon:</strong> ${telefon}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Subiect:</strong> ${subiectText}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <p style="margin: 0 0 10px 0;"><strong>Mesaj:</strong></p>
            <p style="color: #334155; line-height: 1.6; margin: 0;">${mesaj.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        
        <div style="background: #0f172a; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">
            Curierul Perfect © ${new Date().getFullYear()} | <a href="https://curierulperfect.com" style="color: #f97316;">curierulperfect.com</a>
          </p>
        </div>
      </div>
    `;

    // Template email autoresponder pentru client
    const htmlToClient = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mulțumim pentru mesaj!</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
          <p style="color: #0f172a; font-size: 16px; line-height: 1.6;">
            Bună <strong>${nume}</strong>,
          </p>
          
          <p style="color: #334155; line-height: 1.6;">
            Am primit mesajul tău și îți mulțumim că ne-ai contactat! Echipa noastră îl va analiza și îți vom răspunde în maximum <strong>24-48 ore</strong>.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">Mesajul tău:</p>
            <p style="color: #334155; line-height: 1.6; margin: 0;">${mesaj.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="color: #334155; line-height: 1.6;">
            Dacă ai nevoie de ajutor urgent, ne poți contacta și pe WhatsApp la <a href="https://wa.me/447880312621" style="color: #22c55e; text-decoration: none;"><strong>+44 788 031 2621</strong></a>.
          </p>
          
          <p style="color: #334155; line-height: 1.6; margin-top: 20px;">
            Cu stimă,<br>
            <strong style="color: #f97316;">Echipa Curierul Perfect</strong>
          </p>
        </div>
        
        <div style="background: #0f172a; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 12px;">
            Curierul Perfect © ${new Date().getFullYear()}
          </p>
          <p style="margin: 0;">
            <a href="https://curierulperfect.com" style="color: #f97316; text-decoration: none; margin: 0 10px;">Website</a>
            <span style="color: #64748b;">|</span>
            <a href="mailto:contact@curierulperfect.com" style="color: #f97316; text-decoration: none; margin: 0 10px;">Email</a>
            <span style="color: #64748b;">|</span>
            <a href="https://wa.me/447880312621" style="color: #22c55e; text-decoration: none; margin: 0 10px;">WhatsApp</a>
          </p>
        </div>
      </div>
    `;

    // Trimite email către admin
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: process.env.SMTP_USER, // contact@curierulperfect.com
      subject: `[Contact Form] ${subiectText} - ${nume}`,
      html: htmlToAdmin,
      replyTo: email,
    });

    // Trimite email autoresponder către client
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Confirmăm primirea mesajului tău - Curierul Perfect`,
      html: htmlToClient,
    });

    return NextResponse.json({
      success: true,
      message: 'Mesajul a fost trimis cu succes!',
    });
  } catch (error) {
    console.error('Email send error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
    }
    return NextResponse.json(
      { error: `Eroare la trimiterea email-ului: ${errorMessage}` },
      { status: 500 }
    );
  }
}
