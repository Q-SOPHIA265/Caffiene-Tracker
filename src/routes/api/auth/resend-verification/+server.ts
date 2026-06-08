import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$db/client';
import { emailVerificationTokens, users } from '$db/schema';
import { sendVerificationEmail } from '$lib/email';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    if (user[0].emailVerified) {
      return json({ error: 'Email already verified' }, { status: 400 });
    }

    // Create new verification token
    const tokenId = createId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

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
        email,
        message: 'Verification email sent'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    return json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
};
