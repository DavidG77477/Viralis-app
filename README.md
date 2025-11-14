<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15dQ_fzPfsLUyGCHnYARvTi1ApeLMbWpM

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env.local` file at the project root and add:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
VITE_KIE_API_KEY=optional-kie-api-key
VITE_OPENAI_API_KEY=optional-openai-api-key
```

3. Enable Google OAuth in your Supabase project (Authentication → Providers → Google) and configure your Google OAuth credentials with the callback `https://<your-project-ref>.supabase.co/auth/v1/callback`.
4. Run the app:
   `npm run dev`
