import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          error: 'Email and password are required',
          code: 'MISSING_CREDENTIALS',
        },
        { status: 400 }
      );
    }

    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase();

    // Find user by email
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, sanitizedEmail))
      .limit(1);

    if (userResults.length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    const user = userResults[0];

    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    // Authentication successful - return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 200 });
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