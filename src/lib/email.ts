import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
  throw new Error('Gmail credentials not configured in environment variables');
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD // App password from Gmail
      }
    });
  }
  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using Gmail SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `Caffeine Clock <${process.env.GMAIL_USER}>`,
      ...options
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  appUrl: string
): Promise<boolean> {
  const verificationUrl = `${appUrl}/auth/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #b39f7f 0%, #7a6247 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 30px; background: #b39f7f; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>☕ Caffeine Clock</h1>
            <p>Email Verification</p>
          </div>
          <div class="content">
            <h2>Welcome to Caffeine Clock!</h2>
            <p>Thank you for registering. Please verify your email address to activate your account.</p>
            <p>This link expires in 24 hours.</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p>Or copy this link:</p>
            <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Caffeine Clock. All rights reserved.</p>
            <p>If you didn't register for this account, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '☕ Verify Your Email - Caffeine Clock',
    html,
    text: `Please verify your email by visiting: ${verificationUrl}`
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  appUrl: string
): Promise<boolean> {
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #b39f7f 0%, #7a6247 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 30px; background: #b39f7f; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>☕ Caffeine Clock</h1>
            <p>Password Reset</p>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Click the link below to proceed.</p>
            <p>This link expires in 1 hour.</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy this link:</p>
            <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Caffeine Clock. All rights reserved.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🔐 Reset Your Password - Caffeine Clock',
    html,
    text: `Please reset your password by visiting: ${resetUrl}`
  });
}
