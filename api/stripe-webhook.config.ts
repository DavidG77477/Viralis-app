export const config = {
  api: {
    bodyParser: false, // Stripe webhook needs raw body
  },
  // For Vercel serverless functions, we need to ensure raw body is available
  runtime: 'nodejs',
};

