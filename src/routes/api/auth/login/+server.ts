import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$db/client';
import { users } from '$db/schema';
import { verifyPassword } from '$lib/password';
import { loginSchema } from '$lib/validation';
import { eq, or } from 'drizzle-orm';
import { lucia } from '$lib/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const { identifier, password } = validation.data;

    // Find user by email or username
    const user = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, identifier),
          eq(users.username, identifier)
        )
      )
      .limit(1);

    if (user.length === 0) {
      return json(
        { error: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user[0].emailVerified) {
      return json(
        { error: 'Please verify your email before logging in' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user[0].passwordHash);
    if (!isPasswordValid) {
      return json(
        { error: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    // Create session
    const session = await lucia.createSession(user[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    return json(
      {
        success: true,
        user: user[0],
        message: 'Login successful'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
};
