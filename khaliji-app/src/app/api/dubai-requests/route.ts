
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'dubai-requests.json');

// Configuration JSONBin
const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_ID = process.env.JSONBIN_BIN_ID_REQUESTS;

export async function GET() {
    try {
        // 1. JSONBin Cloud Fetch
        if (API_KEY && BIN_ID) {
            const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                headers: { 'X-Master-Key': API_KEY },
                cache: 'no-store',
                next: { revalidate: 0 }
            });
            if (res.ok) {
                const json = await res.json();
                return NextResponse.json(json.record || []);
            }
        }

        // 2. Local Fallback
        if (!fs.existsSync(filePath)) {
            return NextResponse.json([]);
        }
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(fileContents));

    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // 1. JSONBin Cloud Save
        if (API_KEY && BIN_ID) {
            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'X-Master-Key': API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }

        // 2. Local Backup
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
