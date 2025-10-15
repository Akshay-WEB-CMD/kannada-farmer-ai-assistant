import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { soilAnalysis } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, userId } = body;

    if (!imageUrl || !userId) {
      return NextResponse.json(
        { error: 'Image URL and user ID are required' },
        { status: 400 }
      );
    }

    // Simulate AI analysis (In production, replace with actual OpenAI Vision API call)
    const soilTypes = [
      'ಕೆಂಪು ಮಣ್ಣು (Red Soil)',
      'ಕಪ್ಪು ಮಣ್ಣು (Black Soil)',
      'ಲೇಟರೈಟ್ ಮಣ್ಣು (Laterite Soil)',
      'ಮರಳು ಮಣ್ಣು (Sandy Soil)',
      'ಮಟ್ಟಿ ಮಣ್ಣು (Clay Soil)',
    ];

    const cropRecommendations = {
      'ಕೆಂಪು ಮಣ್ಣು (Red Soil)': ['ರಾಗಿ (Ragi)', 'ಕಬ್ಬು (Sugarcane)', 'ಹತ್ತಿ (Cotton)', 'ಕಡಲೆಕಾಯಿ (Groundnut)'],
      'ಕಪ್ಪು ಮಣ್ಣು (Black Soil)': ['ಹತ್ತಿ (Cotton)', 'ಗೋಧಿ (Wheat)', 'ಕಡಲೆ (Gram)', 'ಸೋಯಾಬೀನ್ (Soybean)'],
      'ಲೇಟರೈಟ್ ಮಣ್ಣು (Laterite Soil)': ['ಗೋಧಿ (Wheat)', 'ಬತ್ತ (Rice)', 'ರಾಗಿ (Ragi)', 'ಕಾಶ್ಯೂ (Cashew)'],
      'ಮರಳು ಮಣ್ಣು (Sandy Soil)': ['ಕಡಲೆಕಾಯಿ (Groundnut)', 'ತೆಂಗಿನಕಾಯಿ (Coconut)', 'ತಿಲ (Sesame)', 'ಕಡಲೆ (Gram)'],
      'ಮಟ್ಟಿ ಮಣ್ಣು (Clay Soil)': ['ಬತ್ತ (Rice)', 'ಗೋಧಿ (Wheat)', 'ಜೋಳ (Maize)', 'ಕಬ್ಬು (Sugarcane)'],
    };

    const selectedSoilType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    const recommendedCrops = cropRecommendations[selectedSoilType] || cropRecommendations['ಕೆಂಪು ಮಣ್ಣು (Red Soil)'];

    const recommendations = `ನಿಮ್ಮ ಮಣ್ಣು ${selectedSoilType} ಆಗಿದೆ. ಈ ಮಣ್ಣಿನಲ್ಲಿ ಉತ್ತಮ ಬೆಳೆ ಇಳುವರಿಗಾಗಿ:

1. ಸಾವಯವ ಗೊಬ್ಬರವನ್ನು ಬಳಸಿ (Use organic fertilizers)
2. ನೀರಾವರಿಯನ್ನು ಸರಿಯಾಗಿ ನಿರ್ವಹಿಸಿ (Maintain proper irrigation)
3. ಮಣ್ಣಿನ pH ಮಟ್ಟವನ್ನು 6.5-7.5 ನಡುವೆ ಇರಿಸಿ (Keep soil pH between 6.5-7.5)
4. ಬೆಳೆ ಸರದಿಯನ್ನು ಅಳವಡಿಸಿ (Practice crop rotation)
5. ಮಳೆಗಾಲದ ಮೊದಲು ನೆಟ್ಟು ಮಾಡಿ (Plant before monsoon season)

ಈ ಮಣ್ಣು ಉತ್ತಮ ಒಳಚರಂಡಿ ಮತ್ತು ಪೋಷಕಾಂಶಗಳನ್ನು ಹೊಂದಿದೆ.`;

    // Save to database
    const analysisRecord = await db.insert(soilAnalysis).values({
      userId,
      imageUrl,
      soilType: selectedSoilType,
      recommendations,
      crops: recommendedCrops,
      analysisDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json({
      soilType: selectedSoilType,
      crops: recommendedCrops,
      recommendations,
      id: analysisRecord[0].id,
    }, { status: 200 });

  } catch (error) {
    console.error('Soil analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}