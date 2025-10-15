import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatHistory, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, message, response, language } = body;

    // Validate required fields
    if (!userId || !message || !response || !language) {
      return NextResponse.json(
        {
          error: 'Required fields: userId, message, response, language',
          code: 'MISSING_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate userId is a valid integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        {
          error: 'Invalid userId format',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userIdInt))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Sanitize inputs
    const sanitizedMessage = message.trim();
    const sanitizedResponse = response.trim();
    const sanitizedLanguage = language.trim().toLowerCase();

    // Validate sanitized fields are not empty
    if (!sanitizedMessage || !sanitizedResponse || !sanitizedLanguage) {
      return NextResponse.json(
        {
          error: 'Fields cannot be empty after trimming',
          code: 'EMPTY_FIELDS',
        },
        { status: 400 }
      );
    }

    // Insert new chat history record
    const newChatHistory = await db
      .insert(chatHistory)
      .values({
        userId: userIdInt,
        message: sanitizedMessage,
        response: sanitizedResponse,
        language: sanitizedLanguage,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newChatHistory[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}