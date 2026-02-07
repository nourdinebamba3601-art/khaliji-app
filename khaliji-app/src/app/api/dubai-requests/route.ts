
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'dubai-requests.json');

// Helper to get DB URL form Enviroment
const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

// Ensure data directory exists
if (!DB_URL && !fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
    try {
        // 1. Cloud Fetch (Firebase REST)
        if (DB_URL) {
            const res = await fetch(`${DB_URL}/dubai-requests.json`, {
                cache: 'no-store',
                next: { revalidate: 0 }
            });
            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data || [], {
                    headers: { 'Cache-Control': 'no-store, no-cache' }
                });
            }
        }

        // 2. Local File Fallback
        if (!fs.existsSync(filePath)) {
            return NextResponse.json([]);
        }
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(fileContents), {
            headers: { 'Cache-Control': 'no-store, no-cache' }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // 1. Cloud Save
        if (DB_URL) {
            await fetch(`${DB_URL}/dubai-requests.json`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Local Backup Save
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
