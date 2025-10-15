import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatHistory } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, language } = body;

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and user ID are required' },
        { status: 400 }
      );
    }

    // Simulate AI responses in Kannada (In production, use OpenAI API or similar)
    const responses: { [key: string]: string } = {
      'ಟೊಮೇಟೊ': `🍅 ಟೊಮೇಟೊ ಬೆಳೆ ಮಾಹಿತಿ:

ಮಣ್ಣು: ಚೆನ್ನಾಗಿ ಒಳಚರಂಡಿಯಾದ ಮಣ್ಣು, pH 6.0-7.0
ಹವಾಮಾನ: 20-25°C ತಾಪಮಾನ
ನೀರು: ನಿಯಮಿತ ನೀರಾವರಿ ಅಗತ್ಯ

ಬೆಳೆ ಸಲಹೆಗಳು:
- ಬೀಜಗಳನ್ನು ನರ್ಸರಿಯಲ್ಲಿ ಮೊಳಕೆ ಹಾಕಿ
- 30-45 ದಿನಗಳ ನಂತರ ನೆಟ್ಟು ಮಾಡಿ
- ಸಾವಯವ ಗೊಬ್ಬರ ಬಳಸಿ
- ರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ ಗಮನಿಸಿ

ಇಳುವರಿ: 60-70 ದಿನಗಳಲ್ಲಿ ಸಿದ್ಧ`,

      'ಆಲೂಗಡ್ಡೆ': `🥔 ಆಲೂಗಡ್ಡೆ ಬೆಳೆ ಮಾಹಿತಿ:

ಮಣ್ಣು: ಮರಳು ಮಟ್ಟಿ ಮಣ್ಣು, pH 5.5-6.5
ಹವಾಮಾನ: 15-20°C ತಾಪಮಾನ
ನೀರು: ಮಧ್ಯಮ ನೀರಾವರಿ

ಬೆಳೆ ಸಲಹೆಗಳು:
- ಸಣ್ಣ ಗೆಡ್ಡೆಗಳನ್ನು ನೆಟ್ಟು ಮಾಡಿ
- ಸಾಲಿನಿಂದ ಸಾಲಿಗೆ 60 ಸೆಂ.ಮೀ ಅಂತರ
- ಸಾವಯವ ಗೊಬ್ಬರ ಮತ್ತು NPK ಗೊಬ್ಬರ ಬಳಸಿ
- ಕಳೆ ನಿಯಂತ್ರಣ ಮಾಡಿ

ಇಳುವರಿ: 90-120 ದಿನಗಳಲ್ಲಿ ಸಿದ್ಧ`,

      'ಬತ್ತ': `🌾 ಬತ್ತ ಬೆಳೆ ಮಾಹಿತಿ:

ಮಣ್ಣು: ಮಟ್ಟಿ ಮಣ್ಣು, pH 5.5-7.0
ಹವಾಮಾನ: 25-35°C ತಾಪಮಾನ, ಮಳೆಗಾಲ
ನೀರು: ಹೆಚ್ಚು ನೀರಾವರಿ ಅಗತ್ಯ

ಬೆಳೆ ಸಲಹೆಗಳು:
- ಭದ್ರತಾ ಬೀಜ ಬಳಸಿ
- ನರ್ಸರಿಯಲ್ಲಿ ಮೊಳಕೆ ಹಾಕಿ
- 25-30 ದಿನಗಳಲ್ಲಿ ನೆಟ್ಟು ಮಾಡಿ
- ಸಾವಯವ ಗೊಬ್ಬರ ಬಳಸಿ
- ಕಳೆ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ

ಇಳುವರಿ: 120-150 ದಿನಗಳಲ್ಲಿ ಸಿದ್ಧ`,

      'ಮಣ್ಣಿನ pH': `🌱 ಮಣ್ಣಿನ pH ಬಗ್ಗೆ:

pH ಎಂದರೇನು?
ಮಣ್ಣಿನ ಆಮ್ಲೀಯತೆ ಅಥವಾ ಕ್ಷಾರೀಯತೆಯ ಮಾಪನ.

pH ಮಟ್ಟಗಳು:
- pH < 7: ಆಮ್ಲೀಯ ಮಣ್ಣು
- pH = 7: ತಟಸ್ಥ ಮಣ್ಣು
- pH > 7: ಕ್ಷಾರೀಯ ಮಣ್ಣು

ಹೆಚ್ಚಿನ ಬೆಳೆಗಳಿಗೆ ಸೂಕ್ತ pH: 6.0-7.5

pH ಸರಿಪಡಿಸುವುದು:
- ಆಮ್ಲೀಯತೆಗೆ: ಸುಣ್ಣ ಸೇರಿಸಿ
- ಕ್ಷಾರೀಯತೆಗೆ: ಸಾವಯವ ಗೊಬ್ಬರ ಸೇರಿಸಿ`,

      'ಸಾವಯವ ಗೊಬ್ಬರ': `🌿 ಸಾವಯವ ಗೊಬ್ಬರ ಬಗ್ಗೆ:

ಪ್ರಕಾರಗಳು:
1. ಹಸುವಿನ ಗೊಬ್ಬರ 🐄
2. ಕೋಳಿ ಸಗಣಿ 🐔
3. ವರ್ಮಿಕಂಪೋಸ್ಟ್ 🪱
4. ಹಸಿರು ಗೊಬ್ಬರ 🌱
5. ಕಂಪೋಸ್ಟ್ ♻️

ಪ್ರಯೋಜನಗಳು:
- ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸುತ್ತದೆ
- ಮಣ್ಣಿನ ರಚನೆ ಸುಧಾರಿಸುತ್ತದೆ
- ನೀರು ಹಿಡಿಯುವ ಸಾಮರ್ಥ್ಯ ಹೆಚ್ಚಿಸುತ್ತದೆ
- ರಾಸಾಯನಿಕ ಮುಕ್ತ ಬೆಳೆ
- ಮಣ್ಣಿನ ಸೂಕ್ಷ್ಮಜೀವಿಗಳನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ

ಬಳಕೆ: ಪ್ರತಿ ಎಕರೆಗೆ 5-10 ಟನ್`,

      'ಮಾನ್ಸೂನ್': `🌧️ ಮಾನ್ಸೂನ್ ಬೆಳೆಗಳು:

ಖರೀಫ್ ಋತು ಬೆಳೆಗಳು (ಜೂನ್-ಅಕ್ಟೋಬರ್):
1. ಬತ್ತ 🌾
2. ಜೋಳ 🌽
3. ರಾಗಿ 🌾
4. ಕಬ್ಬು 🎋
5. ಹತ್ತಿ ☁️
6. ಸೋಯಾಬೀನ್ 🌱
7. ಕಡಲೆಕಾಯಿ 🥜
8. ತೂರು 🌾

ಸಲಹೆಗಳು:
- ಮಳೆಗಾಲಕ್ಕೆ ಮೊದಲು ನೆಟ್ಟು ಮಾಡಿ
- ಒಳಚರಂಡಿ ವ್ಯವಸ್ಥೆ ಇರಿಸಿ
- ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ನೋಡಿ
- ಭದ್ರತಾ ಬೀಜ ಬಳಸಿ`,
    };

    // Generate AI response based on message content
    let aiResponse = '';
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('ಟೊಮೇಟೊ') || lowerMessage.includes('tomato')) {
      aiResponse = responses['ಟೊಮೇಟೊ'];
    } else if (lowerMessage.includes('ಆಲೂಗಡ್ಡೆ') || lowerMessage.includes('potato')) {
      aiResponse = responses['ಆಲೂಗಡ್ಡೆ'];
    } else if (lowerMessage.includes('ಬತ್ತ') || lowerMessage.includes('rice')) {
      aiResponse = responses['ಬತ್ತ'];
    } else if (lowerMessage.includes('ph') || lowerMessage.includes('ಪಿಹೆಚ್')) {
      aiResponse = responses['ಮಣ್ಣಿನ pH'];
    } else if (lowerMessage.includes('ಸಾವಯವ') || lowerMessage.includes('ಗೊಬ್ಬರ') || lowerMessage.includes('organic')) {
      aiResponse = responses['ಸಾವಯವ ಗೊಬ್ಬರ'];
    } else if (lowerMessage.includes('ಮಾನ್ಸೂನ್') || lowerMessage.includes('monsoon') || lowerMessage.includes('ಮಳೆ')) {
      aiResponse = responses['ಮಾನ್ಸೂನ್'];
    } else {
      aiResponse = `ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಧನ್ಯವಾದಗಳು! 🙏

ನಾನು ನಿಮಗೆ ಕೃಷಿಯ ಬಗ್ಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:
- ಬೆಳೆ ಮಾಹಿತಿ (ಟೊಮೇಟೊ, ಬತ್ತ, ಆಲೂಗಡ್ಡೆ, ಇತ್ಯಾದಿ)
- ಮಣ್ಣಿನ pH ಮತ್ತು ಫಲವತ್ತತೆ
- ಸಾವಯವ ಗೊಬ್ಬರ
- ನೀರಾವರಿ ವಿಧಾನಗಳು
- ರೋಗ ನಿಯಂತ್ರಣ
- ಮಾನ್ಸೂನ್ ಬೆಳೆಗಳು

ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ಕೇಳಿ ಅಥವಾ ಮೇಲಿನ ವಿಷಯಗಳ ಬಗ್ಗೆ ಕೇಳಿ. 🌱`;
    }

    // Save chat to database
    await db.insert(chatHistory).values({
      userId,
      message,
      response: aiResponse,
      language: language || 'kannada',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ response: aiResponse }, { status: 200 });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}