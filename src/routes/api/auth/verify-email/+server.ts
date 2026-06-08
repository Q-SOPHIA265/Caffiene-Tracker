import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$db/client';
import { users, emailVerificationTokens } from '$db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return json({ error: 'Token is required' }, { status: 400 });
    }

    // Find verification token
    const verificationToken = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token))
      .limit(1);

    if (verificationToken.length === 0) {
      return json({ error: 'Invalid verification token' }, { status: 400 });
    }

    const tokenRecord = verificationToken[0];

    // Check if token is expired
    if (new Date() > tokenRecord.expiresAt) {
      return json({ error: 'Verification token expired' }, { status: 400 });
    }

    // Check if already verified
    if (tokenRecord.verified) {
      return json({ error: 'Email already verified' }, { status: 400 });
    }

    // Update user email verification status
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.email, tokenRecord.email));

    // Mark token as verified
    await db
      .update(emailVerificationTokens)
      .set({ verified: true })
      .where(eq(emailVerificationTokens.token, token));

    return json(
      {
        success: true,
        email: tokenRecord.email,
        message: 'Email verified successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
};
