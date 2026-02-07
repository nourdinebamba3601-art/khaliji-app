
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Defaults to auto-static
export const revalidate = 0;

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'products.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initial Mock Data (Same as in Context)
const initialProducts = [
    {
        id: 1,
        name: "عطر العود الملكي",
        brand: "الرصاصي",
        description: "عطر مميز جداً للمناسبات الرسمية، يجمع بين عبق الشرق وفخامة التصميم.",
        price: 18000,
        quantity: 10,
        category: "perfumes",
        source: "local",
        images: ["https://images.unsplash.com/photo-1594035910387-fea4779426e9?w=800&auto=format&fit=crop"],
        isBestSeller: true,
        salesCount: 120,
        gender: "men",
        perfumeLongevity: "high",
        perfumeVolume: "100ml",
        perfumeScent: "عود ملکی، أخشاب دافئة"
    },
    {
        id: 2,
        name: "رولكس دايتونا",
        brand: "Rolex",
        description: "ساعة فاخرة طلب خاص، تجسيد للأناقة والدقة العالمية.",
        price: 450000,
        quantity: 1,
        category: "watches",
        source: "dubai",
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop"]
    },
    {
        id: 3,
        name: "ساعة أوميغا سيمستر",
        brand: "Omega",
        description: "تصميم كلاسيكي يجمع بين القوة والأناقة، متوفرة الآن في محلنا.",
        price: 250000,
        quantity: 3,
        category: "watches",
        source: "local",
        images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop"],
        isBestSeller: true,
        salesCount: 45
    },
    {
        id: 4,
        name: "عطر ليبر من إيف سام لوران",
        brand: "YSL",
        description: "عطر الأنوثة والحرية، متوفر للطلب الخاص من دبي.",
        price: 22000,
        quantity: 5,
        category: "perfumes",
        source: "dubai",
        shippingDuration: "7 أيام",
        images: ["https://images.unsplash.com/photo-1583467875263-d50dec37a88c?w=800&auto=format&fit=crop"],
        isBestSeller: true,
        salesCount: 85,
        gender: "women",
        perfumeLongevity: "high",
        perfumeVolume: "50ml",
        perfumeScent: "زهور بيضاء، فواكه منعشة"
    },
    {
        id: 5,
        name: "نظارة ري بان كلاسيك",
        brand: "Ray-Ban",
        description: "نظارة شمسية كلاسيكية توفر حماية كاملة من الأشعة فوق البنفسجية.",
        price: 8500,
        quantity: 15,
        category: "glasses",
        source: "local",
        images: ["https://images.unsplash.com/photo-1511499767350-a1590fdb2e17?w=800&auto=format&fit=crop"],
        gender: "unisex",
        lensType: "sun",
        frameShape: "aviator",
        hasFullSet: true
    },
    {
        id: 6,
        name: "نظارة كارتييه سانتوس",
        brand: "Cartier",
        description: "فخامة لا تضاهى مع إطار معدني مطلي بالذهب، متوفرة لطلب خاص.",
        price: 32000,
        quantity: 1,
        category: "glasses",
        source: "dubai",
        shippingDuration: "5 أيام",
        images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop"],
        gender: "men",
        lensType: "sun",
        frameShape: "square",
        hasFullSet: true
    }
];

export async function GET() {
    try {
        if (!fs.existsSync(filePath)) {
            // Write initial data if file doesn't exist
            fs.writeFileSync(filePath, JSON.stringify(initialProducts, null, 2), 'utf-8');
            return NextResponse.json(initialProducts);
        }

        const fileContents = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContents);

        // Add headers to prevent caching
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return NextResponse.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
