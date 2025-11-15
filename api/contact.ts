import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
    }

    const resend = new Resend(apiKey);

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Viralis Studio <contact@viralis-studio.app>';
    const contactEmail = process.env.CONTACT_EMAIL || fromEmail;

    // Échapper les caractères HTML pour éviter les injections
    const escapeHtml = (text: string) => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    // Envoyer l'email à ton adresse
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      subject: `📧 Nouveau message de contact - ${safeName}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nouveau message de contact</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #030a07; color: #f5f7fb;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #05161a, #0f2a2f); padding: 40px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
              <!-- Header avec logo -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(90deg, #00ff9d, #00b3ff); border-radius: 12px; margin-bottom: 16px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0d0f12; letter-spacing: 0.5px;">VIRALIS STUDIO</h1>
                </div>
                <h2 style="color: #00ff9d; margin: 16px 0 8px; font-size: 20px; font-weight: 600;">Nouveau message de contact</h2>
                <p style="color: rgba(247, 253, 249, 0.6); font-size: 14px; margin: 0;">Vous avez reçu un nouveau message depuis le formulaire de contact</p>
              </div>
              
              <!-- Informations de l'utilisateur -->
              <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid rgba(255, 255, 255, 0.05);">
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 179, 255, 0.2)); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 20px;">👤</span>
                    </div>
                    <div>
                      <p style="margin: 0; color: rgba(247, 253, 249, 0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Nom</p>
                      <p style="margin: 4px 0 0; color: #f5f7fb; font-size: 16px; font-weight: 600;">${safeName}</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 179, 255, 0.2)); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 20px;">✉️</span>
                    </div>
                    <div>
                      <p style="margin: 0; color: rgba(247, 253, 249, 0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                      <p style="margin: 4px 0 0;">
                        <a href="mailto:${safeEmail}" style="color: #00b3ff; text-decoration: none; font-size: 16px; font-weight: 600;">${safeEmail}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Message -->
              <div style="background: rgba(0, 255, 157, 0.05); border-radius: 12px; padding: 24px; border-left: 4px solid #00ff9d; margin-bottom: 24px;">
                <p style="margin: 0 0 12px; color: rgba(247, 253, 249, 0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                <div style="color: #f5f7fb; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
              </div>
              
              <!-- Bouton de réponse -->
              <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <a href="mailto:${safeEmail}?subject=Re: Votre message sur Viralis Studio" style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #00ff9d, #00b3ff); color: #0d0f12; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px; transition: opacity 0.2s;">Répondre par email</a>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                <p style="color: rgba(247, 253, 249, 0.4); font-size: 12px; margin: 0;">Message envoyé depuis le formulaire de contact de Viralis Studio</p>
                <p style="color: rgba(247, 253, 249, 0.3); font-size: 11px; margin: 8px 0 0;">© ${new Date().getFullYear()} Viralis Studio. Tous droits réservés.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

