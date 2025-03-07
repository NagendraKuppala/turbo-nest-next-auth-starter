export type AuthResponseType = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName?: string | null;
  role: string;
  avatar?: string | null;
  emailVerified: boolean;
  accessToken: string;
  refreshToken: string;
};
