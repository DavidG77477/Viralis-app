

export interface TokenPackage {
  id: number;
  tokens: number;
  price: number;
  name: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  tokenBonus?: number;
  highlight?: boolean;
}

export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';

export interface Testimonial {
  language: string;
  name: string;
  handle: string;
  role: string;
  country: string;
  rating: number;
  review: string;
  avatar_url: string;
  platform: 'reddit' | 'pinterest' | 'facebook' | 'x' | 'instagram' | 'youtube';
}