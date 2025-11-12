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

// Plantilla para el correo de recuperación de contraseña
const passwordResetEmailTemplate = (token: string) => ({
  subject: 'Recupera tu contraseña - Kimal',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; margin-bottom: 20px;">Recupera tu contraseña</h1>
      <p style="color: #666; margin-bottom: 30px;">
        Recibimos una solicitud para cambiar tu contraseña. Haz clic en el siguiente enlace para restablecerla:
      </p>
      <a href="${process.env.FRONTEND_URL}/password-reset/${token}" 
         style="background-color: #2d8cf0; color: white; padding: 12px 25px; 
                text-decoration: none; border-radius: 5px; display: inline-block; 
                margin: 20px 0;">
        Restablecer contraseña
      </a>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        Si no solicitaste este cambio, puedes ignorar este correo.
      </p>
    </div>
  `
});

export const sendPasswordResetEmail = async (to: string, token: string): Promise<boolean> => {
  try {
    const template = passwordResetEmailTemplate(token);
    await transporter.sendMail({
      from: `"Kimal App" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

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

export const sendInitialPasswordEmail = async (to: string, password: string): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"Kimal App" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Tu cuenta ha sido creada - Kimal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; margin-bottom: 20px;">Bienvenido a Kimal</h1>
          <p style="color: #666; margin-bottom: 30px;">
            Tu cuenta ha sido creada por el administrador.<br>
            <b>Tu contraseña inicial es:</b> <span style="color: #4CAF50;">${password}</span>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Te recomendamos cambiar tu contraseña después de iniciar sesión.
          </p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending initial password email:', error);
    return false;
  }
}