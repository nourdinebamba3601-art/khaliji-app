
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'dubai-requests.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
    try {
        if (!fs.existsSync(filePath)) {
            // Return empty array if file doesn't exist
            return NextResponse.json([]);
        }

        const fileContents = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContents);

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
