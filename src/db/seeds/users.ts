import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    // Clear existing users to avoid duplicates
    await db.delete(users);
    
    // Hash passwords
    const hashedPassword1 = await bcrypt.hash('farmer123', 10);
    const hashedPassword2 = await bcrypt.hash('test123', 10);
    
    const sampleUsers = [
        {
            email: 'farmer@test.com',
            password: hashedPassword1,
            name: 'ರಮೇಶ್ ಕುಮಾರ್ (Ramesh Kumar)',
            phoneNumber: '9876543210',
            location: 'ಹುಬ್ಬಳ್ಳಿ (Hubballi)',
            language: 'kannada',
            createdAt: new Date().toISOString(),
        },
        {
            email: 'test@farmer.com',
            password: hashedPassword2,
            name: 'ಲಕ್ಷ್ಮಿ ದೇವಿ (Lakshmi Devi)',
            phoneNumber: '9876543211',
            location: 'ಮೈಸೂರು (Mysore)',
            language: 'kannada',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});