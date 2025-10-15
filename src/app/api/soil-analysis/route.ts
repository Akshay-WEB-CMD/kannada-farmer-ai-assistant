import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { soilAnalysis, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageUrl, soilType, recommendations, crops, analysisDate } = body;

    // Validate required fields
    if (!userId || !imageUrl || !soilType || !recommendations || !crops) {
      return NextResponse.json(
        { 
          error: 'Required fields: userId, imageUrl, soilType, recommendations, crops',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate crops is an array
    if (!Array.isArray(crops)) {
      return NextResponse.json(
        { 
          error: 'Crops must be an array',
          code: 'INVALID_CROPS'
        },
        { status: 400 }
      );
    }

    // Validate userId exists in users table
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Prepare data for insertion
    const currentTimestamp = new Date().toISOString();
    const insertData = {
      userId,
      imageUrl: imageUrl.trim(),
      soilType: soilType.trim(),
      recommendations: recommendations.trim(),
      crops,
      analysisDate: analysisDate || currentTimestamp,
      createdAt: currentTimestamp,
    };

    // Insert new soil analysis record
    const newAnalysis = await db.insert(soilAnalysis)
      .values(insertData)
      .returning();

    return NextResponse.json(newAnalysis[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}