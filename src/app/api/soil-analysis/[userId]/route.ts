import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { soilAnalysis, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);

    // Validate userId parameter
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId);

    // Check if user exists
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, parsedUserId))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Parse pagination parameters
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '10'),
      100
    );
    const offset = parseInt(searchParams.get('offset') || '0');

    // Query soil analysis records for the user
    const analysisRecords = await db
      .select()
      .from(soilAnalysis)
      .where(eq(soilAnalysis.userId, parsedUserId))
      .orderBy(desc(soilAnalysis.analysisDate))
      .limit(limit)
      .offset(offset);

    // Return the results (empty array if no records found)
    return NextResponse.json(analysisRecords, { status: 200 });
  } catch (error) {
    console.error('GET soil analysis error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}