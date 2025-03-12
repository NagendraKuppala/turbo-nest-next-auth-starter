export type AuthJwtPayload = {
  sub: string; // User ID
};

// For newsletter unsubscribe tokens
export interface NewsletterUnsubscribePayload {
  email: string;
  purpose: 'newsletter-unsubscribe';
}
