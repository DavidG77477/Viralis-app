import type { VercelRequest } from '@vercel/node';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

