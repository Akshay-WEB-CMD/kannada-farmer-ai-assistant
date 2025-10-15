import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { feedback, users } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, email, message, rating } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required', code: 'MISSING_MESSAGE' },
        { status: 400 }
      );
    }

    if (rating === undefined || rating === null) {
      return NextResponse.json(
        { error: 'Rating is required', code: 'MISSING_RATING' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedMessage = message.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // Validate rating range
    const ratingValue = parseInt(rating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5', code: 'INVALID_RATING' },
        { status: 400 }
      );
    }

    // Validate userId if provided
    let validatedUserId = null;
    if (userId !== undefined && userId !== null) {
      const userIdValue = parseInt(userId);
      if (isNaN(userIdValue)) {
        return NextResponse.json(
          { error: 'Invalid user ID format', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }

      const userExists = await db
        .select()
        .from(users)
        .where(eq(users.id, userIdValue))
        .limit(1);

      if (userExists.length === 0) {
        return NextResponse.json(
          { error: 'User not found', code: 'USER_NOT_FOUND' },
          { status: 404 }
        );
      }

      validatedUserId = userIdValue;
    }

    // Create feedback record
    const newFeedback = await db
      .insert(feedback)
      .values({
        userId: validatedUserId,
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        rating: ratingValue,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newFeedback[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    let query = db.select().from(feedback);

    // Apply search filter if provided
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(feedback.name, searchTerm),
          like(feedback.email, searchTerm),
          like(feedback.message, searchTerm)
        )
      );
    }

    // Order by createdAt descending and apply pagination
    const results = await query
      .orderBy(desc(feedback.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}