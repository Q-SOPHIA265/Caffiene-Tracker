import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$db/client';
import { users } from '$db/schema';
import { updateProfileSchema } from '$lib/validation';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    if (!locals.user) {
      return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { displayName, age, bodyWeight } = validation.data;

    // Build update object
    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (displayName) updateData.displayName = displayName;
    if (age) updateData.age = age;
    if (bodyWeight) updateData.bodyWeight = bodyWeight;

    // Update user
    await db.update(users).set(updateData).where(eq(users.id, locals.user.id));

    // Fetch updated user
    const updatedUser = await db.select().from(users).where(eq(users.id, locals.user.id)).limit(1);

    return json(updatedUser[0], { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
};
