import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './client';
import { users, sessions } from './schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    },
    name: 'auth_session'
  },
  getUserAttributes: (attributes) => ({
    id: attributes.id,
    email: attributes.email,
    username: attributes.username,
    displayName: attributes.displayName,
    profileImage: attributes.profileImage,
    age: attributes.age,
    bodyWeight: attributes.bodyWeight,
    emailVerified: attributes.emailVerified,
    role: attributes.role,
    createdAt: attributes.createdAt
  })
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      username: string;
      displayName: string;
      profileImage: string;
      age: number | null;
      bodyWeight: number;
      emailVerified: boolean;
      role: string;
      createdAt: Date;
    };
  }
}
