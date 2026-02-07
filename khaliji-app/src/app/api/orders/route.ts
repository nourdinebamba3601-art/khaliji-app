
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'orders.json');

// Configuration JSONBin
const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_ID = process.env.JSONBIN_BIN_ID_ORDERS;

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
                // SAFETY CHECK: Ensure array or empty placeholder
                if (Array.isArray(json.record)) {
                    return NextResponse.json(json.record);
                } else if (!json.record || json.record.empty === true) {
                    return NextResponse.json([]); // Return empty array if placeholder {empty:true} or missing
                }
                return NextResponse.json([]);
            }
        }

        // 2. Local Fallback
        if (!fs.existsSync(filePath)) {
            return NextResponse.json([]);
        }
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(fileContents));

    } catch (error) {
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // 1. JSONBin Cloud Save
        if (API_KEY && BIN_ID) {
            // Prevent "Bin cannot be blank"
            const payload = (Array.isArray(data) && data.length === 0) ? { empty: true } : data;

            const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'X-Master-Key': API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errText = await res.text();
                return NextResponse.json({ error: `Cloud Save Failed: ${errText}` }, { status: 500 });
            }
        }

        // 2. Local Backup (Best Effort)
        try {
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (localError) {
            console.warn("Local backup skipped on Vercel");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
