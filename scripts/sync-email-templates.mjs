import { readFile } from 'node:fs/promises';

const REQUIRED_ENV = ['SUPABASE_ACCESS_TOKEN', 'SUPABASE_PROJECT_REF'];

REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing ${key}. Please export it before running this script.`);
    process.exit(1);
  }
});

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

const root = new URL('../', import.meta.url);

const loadTemplate = async (relativePath) => {
  const fileUrl = new URL(relativePath, root);
  return readFile(fileUrl, 'utf8');
};

try {
  console.log('📨 Loading HTML templates…');
  const [confirmation, magicLink, passwordReset] = await Promise.all([
    loadTemplate('emails/templates/confirmation.html'),
    loadTemplate('emails/templates/magic-link.html'),
    loadTemplate('emails/templates/password-reset.html'),
  ]);

  const payload = {
    mailer_subjects_confirmation: 'Bienvenue dans Viralis Studio',
    mailer_templates_confirmation_content: confirmation,
    mailer_subjects_magic_link: 'Votre accès sécurisé à Viralis Studio',
    mailer_templates_magic_link_content: magicLink,
    mailer_subjects_recovery: 'Réinitialisez votre mot de passe Viralis Studio',
    mailer_templates_recovery_content: passwordReset,
  };

  console.log('🚀 Uploading templates to Supabase project:', PROJECT_REF);
  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase API returned ${response.status}: ${details}`);
  }

  console.log('✅ Email templates updated successfully.');
} catch (error) {
  console.error('❌ Failed to sync email templates.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

