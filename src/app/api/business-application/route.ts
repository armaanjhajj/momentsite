import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, location, description, message } = body;

    // Validate required fields
    if (!businessName || !location || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Gmail credentials are configured
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    
    if (!gmailUser || !gmailAppPassword) {
      console.error('Gmail credentials not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Configure nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Recipient email (defaults to support@havemoments.com)
    const recipientEmail = process.env.BUSINESS_EMAIL_RECIPIENT || 'support@havemoments.com';

    // Send email
    await transporter.sendMail({
      from: `"Moments Business Applications" <${gmailUser}>`,
      to: recipientEmail,
      subject: `New Business Verification Application: ${businessName}`,
      html: `
        <h2>New Business Verification Application</h2>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
        ${message ? `<p><strong>Additional Message:</strong></p><p>${message}</p>` : ''}
        <hr />
        <p><em>Submitted via Moments Business Application Form</em></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing business application:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}

