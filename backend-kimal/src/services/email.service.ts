import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

// Configurar el transportador de nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Plantilla para el correo de verificación
const verificationEmailTemplate = (token: string) => ({
  subject: 'Verifica tu cuenta - Kimal',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; margin-bottom: 20px;">Bienvenido a Kimal</h1>
      <p style="color: #666; margin-bottom: 30px;">
        Gracias por registrarte. Para completar tu registro, por favor verifica tu cuenta:
      </p>
      <a href="${process.env.FRONTEND_URL}/verify/${token}" 
         style="background-color: #4CAF50; color: white; padding: 12px 25px; 
                text-decoration: none; border-radius: 5px; display: inline-block; 
                margin: 20px 0;">
        Verificar mi cuenta
      </a>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        Si no creaste esta cuenta, puedes ignorar este correo.
      </p>
    </div>
  `
});

export const sendVerificationEmail = async (to: string, token: string): Promise<boolean> => {
  try {
    const template = verificationEmailTemplate(token);
    
    await transporter.sendMail({
      from: `"Kimal App" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    });

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};