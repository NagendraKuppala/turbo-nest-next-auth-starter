import { Role } from '@prisma/client';

export type AuthUserType = {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  avatarUrl?: string;
};
