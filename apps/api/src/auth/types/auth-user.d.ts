import { Role } from '@prisma/client';

export type AuthUserType = {
  id: string;
  email: string;
  username?: string | null;
  firstName: string;
  lastName?: string | null;
  role: Role;
  avatar?: string | null;
  emailVerified: boolean;
  newsletterOptIn: boolean;
  termsAccepted: boolean;
  needsTermsAcceptance?: boolean;
};

export interface AuthUserResponse {
  id: string;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  avatar?: string | null;
  emailVerified: boolean;
  newsletterOptIn: boolean;
  accessToken?: string;
  refreshToken?: string;
}
