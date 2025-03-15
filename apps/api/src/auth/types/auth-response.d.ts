export type AuthResponseType = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName?: string | null;
  role: string;
  avatar?: string | null;
  emailVerified: boolean;
  needsTermsAcceptance?: boolean;
  newsletterOptIn?: boolean;
  message?: string;
  accessToken: string;
  refreshToken: string;
};

export type MessageResponseType = {
  message: string;
  success?: boolean;
};
