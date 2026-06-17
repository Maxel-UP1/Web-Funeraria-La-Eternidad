import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: string;      // user UUID
  email: string;
  role: Role;
}

export interface JwtPayloadWithRefresh extends JwtPayload {
  refreshToken?: string;
}
