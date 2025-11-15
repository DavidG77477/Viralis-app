## ✉️ Custom email templates for Supabase + Resend

This folder centralizes the HTML that powers the branded emails (confirmation, magic link, password reset) so you can version control them and push updates to Supabase in one command.

### Available templates

| Template | File | Supabase screen |
| --- | --- | --- |
| Signup confirmation | `templates/confirmation.html` | Auth → Email Templates → “Confirm signup” |
| Magic link / passwordless login | `templates/magic-link.html` | Auth → Email Templates → “Magic Link” |
| Password reset | `templates/password-reset.html` | Auth → Email Templates → “Reset password” |

All templates already include:

- Viralis green → aqua gradient background
- Embedded logo header
- CTA buttons with `{{ .ConfirmationURL }}` (or `{{ .ActionLink }}`) placeholders
- Support copy in FR/EN, dynamic email address insert via `{{ .Email }}` and `{{ .SiteURL }}` hints

### How to use them manually

1. Open the file you want (e.g. `emails/templates/confirmation.html`).
2. Replace the `https://example.com/logo-email.png` URL with your hosted logo if needed.
3. Copy the entire HTML (keep the `<table>` structure and inline styles).
4. Paste it inside the corresponding **Supabase → Authentication → Email Templates** editor.
5. Save. Supabase + Resend will now send the branded version from your domain.

### Sync via script (optional)

If you prefer automating the update, use the helper script powered by the Supabase Management API:

1. Create a [Supabase access token](https://supabase.com/dashboard/account/tokens) with “Full Access”.
2. Export the required env vars:

   ```bash
   export SUPABASE_ACCESS_TOKEN=sbp_your_token_here
   export SUPABASE_PROJECT_REF=your-project-ref   # e.g. abcdefghijklmno12345
   ```

3. Run:

   ```bash
   npm run sync:emails
   ```

The command will read the HTML files in `emails/templates`, set the subjects, and PATCH the corresponding fields (`mailer_templates_*`) on your Supabase project.

> ⚠️ **Never commit your personal access token**. Use a temporary shell export or a `.env.local` that is ignored by git.

### Customizing further

- The templates use standard [Supabase email variables](https://supabase.com/docs/guides/auth/auth-email-templates). Feel free to include any of `{{ .Token }}`, `{{ .SiteURL }}`, `{{ .Data.someField }}` etc.
- Because email clients strip external CSS, keep styles inline or inside the `<style>` block that targets supported clients.
- If you want more templates (invite, re-auth, change email), duplicate one of the files and adjust the copy/CTA, then extend the sync script with the new keys.

