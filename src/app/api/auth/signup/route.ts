import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phoneNumber, location, language } = body;

    // Validate required fields
    if (!email || !password || !name || !phoneNumber || !location) {
      return NextResponse.json(
        {
          error: 'All fields are required: email, password, name, phoneNumber, location',
          code: 'MISSING_FIELDS',
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name.trim();
    const sanitizedPhoneNumber = phoneNumber.trim();
    const sanitizedLocation = location.trim();
    const sanitizedLanguage = language ? language.trim() : 'kannada';

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, sanitizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          error: 'User already exists',
          code: 'USER_EXISTS',
        },
        { status: 400 }
      );
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await db
      .insert(users)
      .values({
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizedName,
        phoneNumber: sanitizedPhoneNumber,
        location: sanitizedLocation,
        language: sanitizedLanguage,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Remove password from response for security
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json(userWithoutPassword, { status: 201 });
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