import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$db/client';
import { users, emailVerificationTokens } from '$db/schema';
import { hashPassword } from '$lib/password';
import { sendVerificationEmail } from '$lib/email';
import { registerSchema } from '$lib/validation';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { email, username, password, displayName } = validation.data;

    // Check if email already exists
    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return json({ error: 'Email already in use' }, { status: 400 });
    }

    // Check if username already exists
    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      return json({ error: 'Username already taken' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = createId();
    await db.insert(users).values({
      id: userId,
      email,
      username,
      displayName,
      passwordHash,
      emailVerified: false
    });

    // Create verification token
    const tokenId = createId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(emailVerificationTokens).values({
      id: tokenId,
      email,
      token: tokenId,
      expiresAt,
      verified: false
    });

    // Send verification email
    const appUrl = url.origin;
    const sent = await sendVerificationEmail(email, tokenId, appUrl);

    if (!sent) {
      return json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return json(
      { 
        success: true, 
        message: 'User created. Check email for verification.',
        email 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
};
